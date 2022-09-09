import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined, AddOutlined } from '@mui/icons-material';

import { Button, CardMedia, Chip, Grid, Typography } from '@mui/material'
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { SummaryTile } from '../../components/admin/SummaryTile';
import { DashboardSummaryResponse, IProduct } from '../../interfaces';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Box } from '@mui/system';



const columns:GridColDef[] = [
    { field: 'id', headerName: 'Product ID', width: 250 },
    { field: 'title', headerName: 'Title', width: 250 },
    { field: 'price', headerName: 'Price', width: 300 },
    { field: 'inStock', headerName: 'In Stock', align: 'center', width: 150 },
    { field: 'image', headerName: 'Image', width: 300,  renderCell: ({ row }: GridValueGetterParams) => {
        return (
            <a href={ `/product/${ row.slug }` } target="_blank" rel="noreferrer" >
               <CardMedia 
                    component="img"
                    className='fadeIn'
                    image={`${ row.image }`}
               />
            </a>
        )
    }},
    { field: 'gender', headerName: 'Gender', width: 300 },
    { field: 'sizes', headerName: 'Sizes', width: 300 },
    {
        field: 'check',
        headerName: 'Ver producto',
        renderCell: ({ row }: GridValueGetterParams) => {
            return (
                <a href={ `/admin/products/${ row.slug }` } target="_blank" rel="noreferrer" >
                    Ver
                </a>
            )
        }
    },

];


const ProductsPage = () => {

    const {data, error} = useSWR<IProduct[]>('/api/admin/products');

    if ( !data && !error ) return (<></>);
    
    const rows = data!.map( order => ({
        id    : order._id,
        title : order.title,
        price  : order.price,
        inStock : order.inStock,
        image: order.images[0],
        gender: order.gender,
        sizes: order.sizes,
        slug: order.slug,
    }));
    

    // if ( !error && !data ) {
    //     return <></>
    // }


    return (
        <AdminLayout
            title='Products'
            subTitle='Estadisticas generales'
            icon={ <CategoryOutlined /> }
        >
            <Box display='flex' justifyContent=''>
                <Button
                    startIcon={<AddOutlined />}
                    color='secondary'
                    href='/admin/products/new'
                >
                    Create product
                </Button>
            </Box>
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height:650, width: '100%' }}>
                    <DataGrid 
                        rows={ rows }
                        columns={ columns }
                        pageSize={ 10 }
                        rowsPerPageOptions={ [10] }
                    />

                </Grid>
            </Grid>
        </AdminLayout>
    )
}

export default ProductsPage