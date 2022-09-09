import NextLink from 'next/link';
import { Box, Button, Chip, Divider, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useForm } from 'react-hook-form';
import { validations } from '../../utils';
import tesloApi from '../../api/tesloApi';
import { ErrorOutline } from '@mui/icons-material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { GetServerSideProps } from 'next';


type FormData = {
    email: string,
    password: string,
  };


const LoginPage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

    const router = useRouter();
    const { loginUser } = useContext(AuthContext);

    const [formError, setFormError] = useState(false)

    const [providers, setProviders] = useState<any>({})

    useEffect(() => {
      
        getProviders().then(prov => {
            console.log(prov)
            setProviders(prov);
        })
    
      
    }, [])
    

    const param = router.query.p?.toString();
    const onLoginUser = async({email, password}: FormData) => {

        await signIn('credentials', { email, password})

    //     try{

            
    //         setFormError(false)
    //         const response = loginUser(data.email, data.password)
    //         console.log(data)
    //         console.log(response)
    //         router.push(param ?? '/')
    //     }catch(error){
    //         setFormError(true)
    //         setTimeout(() => setFormError(false), 3000)
    //         console.log(error)

    //     }
    }


    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Iniciar Sesión</Typography>
                            { formError ? <Chip
                                color="error"
                                label="No reconocemos el error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                             /> : ""}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                type="email" 
                                label="Correo" 
                                variant="filled" {...register("email",
                                    {
                                        required:"Esta campo es requerido", 
                                        validate: validations.isEmail
                                    }
                                )} 
                                error={!!errors.email} 
                                helperText={errors.email?.message} 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Contraseña" type='password' {...register("password", {required:"Esta campo es requerido", minLength: {value:6, message:"min 6 catacteres"}})} error={!!errors.password} helperText={errors.password?.message} variant="filled" fullWidth />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={`/auth/register?p=${param}`} passHref>
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>

                        <Grid item xs={12} display='column' justifyContent='end'>
                            <Divider sx={{ width:' 100%', mb: 2}} />
                            {
                                Object.values(providers).map((provider:any) => {
                                    return (
                                        <Button key={provider.id} color="primary" fullWidth onClick={() => signIn(provider.id)}>
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
         
        </AuthLayout>
    )
}

// getServerSideProps 
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto.... SSR
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  
    const session = await getSession({req});

    console.log(session)
    console.log(
        'getServerSideProps'
    )

    const {p = '/'} = query
    if (session){
        return {
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }


    return {
        props: {
        
            
        }
    }
}

export default LoginPage