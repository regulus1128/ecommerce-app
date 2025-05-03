import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {
    const { products } = useContext(ShopContext);
    const [BestSeller, setBestSeller] = useState([]);


    useEffect(() => {
        const bestProducts = products.filter((item) => (item.bestSeller));
        setBestSeller(bestProducts.slice(0, 5));
        console.log('Best seller array: ', bestProducts);

    }, [products]);


  return (
    <>
        <div className='my-12'>
            <div className='text-center text-2xl py-6'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base'>
                    This is our best sellers.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {
                    BestSeller.map((item, index) => (
                        <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price}/>
                    ))
                }

            </div>


        </div>
    </>
  )
}

export default BestSeller