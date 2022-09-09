import NextLink from 'next/link';
import { Box, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { AuthLayout } from '../../components/layouts'
import { useContext, useState } from 'react';
import tesloApi from '../../api/tesloApi';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context';
import { getSession, signIn } from 'next-auth/react';
import { GetServerSideProps } from 'next';


type FormData = {
    email: string,
    password: string,
    name: string
  };

const RegisterPage = () => {

    const [formError, setFormError] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const router = useRouter();
    const { registerUser } = useContext(AuthContext);
    const param = router.query.p?.toString();

    const onRegister = async({email, password, name}: FormData) => {
        setFormError(false)

        const {hasError} = await registerUser(name, email, password);

        if(hasError){
            setFormError(true)
            setTimeout(() => setFormError(false), 3000)
        }else{
            // router.push(param ?? '/')
            await signIn('credentials', {email, password});
        }
    }
    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegister)} noValidate>
                <Box sx={{ width: 350, padding:'10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component="h1">Crear cuenta</Typography>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField 
                                    type="name" 
                                    label="Nombre completo" 
                                    variant="filled" {...register("name",
                                        {
                                            required:"Esta campo es requerido", 
                                        }
                                    )} 
                                    error={!!errors.name} 
                                    helperText={errors.name?.message} 
                                    fullWidth 
                                />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField 
                            type="email" 
                            label="Correo" 
                            variant="filled" {...register("email",
                                {
                                    required:"Esta campo es requerido", 
                                }
                            )} 
                            error={!!errors.email} 
                            helperText={errors.email?.message} 
                            fullWidth 
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <TextField 
                            type="password" 
                            label="Contraseña" 
                            variant="filled" {...register("password",
                                {
                                    required:"Esta campo es requerido", 
                                }
                            )} 
                            error={!!errors.password} 
                            helperText={errors.password?.message} 
                            fullWidth 
                        />
                        </Grid>

                        <Grid item xs={12}>
                            <Button type="submit" color="secondary" className='circular-btn' size='large' fullWidth>
                                Ingresar
                            </Button>
                        </Grid>

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href="/auth/login" passHref>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
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

export default RegisterPage