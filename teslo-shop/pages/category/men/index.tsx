import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../../components/layouts';
import { useProducts } from '../../../hooks';
import { FullScreenLoading } from '../../../components/ui/FullScreenLoading';
import { ProductList } from '../../../components/products';


const MenPage: NextPage = () => {


  const { products, isLoading } = useProducts('/products?gender=men');


  return (
    <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Encuentra los mejores productos de Teslo aquí para hombres'}>
        <Typography variant='h1' component='h1'>Hombres</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>
        {
          isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products } />
        }
    </ShopLayout>
  )
}

export default MenPage