import type { GetServerSideProps, NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { ProductList } from '../../components/products';
import { dbProducts } from '../../database';
import { IProduct } from '../../interfaces';
import Custom404 from '../404';
import { Box } from '@mui/system';

interface Props {
    products: IProduct[]
    foundProducts: boolean
    query: string
  }

const SearchPage: NextPage<Props> = ({ products, query, foundProducts }) => {

console.log(products)
  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Search</Typography>

            {
                !!foundProducts ?
                <Typography variant='h2' sx={{ mb: 1 }}>Termino {query}</Typography>
                : (
                    <Box display='flex'>
                        <Typography variant='h2' sx={{ mb: 1 }}>No encontramos ningún produto</Typography>
                        <Typography variant='h2' sx={{ ml: 1 }} color="secondary" textTransform="capitalize">{ query }</Typography>
                    </Box>
                )}
                <ProductList products={ products } />
    </ShopLayout>
  )
}

// getServerSideProps 
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
//* No usar esto.... SSR
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
  const { query = '' } = params as { query: string };

  if ( query.length === 0 ) {
    return {
      redirect: {
        destination: '',
        permanent: false
      }
    }
  }

  let products = await dbProducts.getProductsByTerm( query );

  const foundProducts = products.length > 0;

  if( !foundProducts ){
    products = await dbProducts.getAllProducts()
  }


  return {
    props: {
        products,
        foundProducts,
        query
    }
  }
}


export default SearchPage