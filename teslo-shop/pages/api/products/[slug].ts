import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose';

import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import Product from '../../../models/Products';

type Data = 
| { message: string } 
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    // const { id } = req.query;

    // if ( !mongoose.isValidObjectId( id ) ) {
    //     return res.status(400).json({ message: 'El id no es válido ' + id })
    // }
    
    switch ( req.method ) {
        case 'PUT':
            return updateProduct( req, res );

        case 'GET':
            return getProduct( req, res );

            
        default:
            return res.status(400).json({ message: 'Método no existe ' + req.method });
    }

}

const getProduct = async( req: NextApiRequest, res: NextApiResponse ) => {
    
    const { slug } = req.query;

    console.log(slug)
    await db.connect();
    const ProductInDB = await Product.findOne({slug});
    await db.disconnect();

    if ( !ProductInDB ) {
        return res.status(400).json({ message: 'No hay entrada con ese ID: ' + slug })
    }

    return res.status(200).json( ProductInDB );
}



const updateProduct = async( req: NextApiRequest, res: NextApiResponse<Data> ) => {
    
    const { id } = req.query;

    await db.connect();

    console.log('updateProduct')
    const ProductToUpdate = await Product.findById( id );

    if ( !ProductToUpdate ) {
        await db.disconnect();
        return res.status(400).json({ message: 'No hay entrada con ese ID: ' + id })
    }

    const {
        description = ProductToUpdate.description,
        // status = ProductToUpdate.status,
    } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate( id, { description, status }, { runValidators: true, new: true });
        await db.disconnect();
        res.status(200).json( updatedProduct! );
        
    } catch (error: any) {
        await db.disconnect();
        res.status(400).json({ message: error.errors.status.message });
    }
    // entryToUpdate.description = description;
    // entryToUpdate.status = status;
    // await entryToUpdate.save();



}