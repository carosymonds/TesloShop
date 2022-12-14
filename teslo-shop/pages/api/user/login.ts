import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '../../../database'
import { IProduct } from '../../../interfaces/products';
import User from '../../../models/User';
import bycryptjs from 'bcryptjs';
import { IUser } from '../../../interfaces/user';
import { jwt } from '../../../utils/';
import { useForm } from 'react-hook-form';


type Data = 
| { message: string }
| {
    token: string,
    user: {
        email: string,
        role: string,
        name: string
    }
}


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return loginUser( req, res )

        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    }
}

const loginUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { email, password } = req.body;
    console.log(email)

    await db.connect();
    const user = await User.findOne({email});

    if ( !user ) {
        return res.status(400).json({message: "Correo no es valido" + email});
    }

    // if(!bycryptjs.compareSync(password, user.password!)){
    //     return res.status(400).json({message: "Contraseña no es valida"});
    // }

    const { role, name, _id } = user;

    const token =  jwt.signToken(_id, email);

    return res.status(200).json({
        token: token,
        user: {
            email, role, name
        }
    });

}
