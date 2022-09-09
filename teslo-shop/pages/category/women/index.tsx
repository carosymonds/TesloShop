import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../../components/layouts';
import { useProducts } from '../../../hooks';
import { FullScreenLoading } from '../../../components/ui/FullScreenLoading';
import { ProductList } from '../../../components/products';


const WomenPage: NextPage = () => {


  const { products, isLoading } = useProducts('/products?gender=women');


  return (
    <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos de Teslo aquí para mujeres'}>
        <Typography variant='h1' component='h1'>Mujeres</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
    </ShopLayout>
  )
}

export default WomenPage