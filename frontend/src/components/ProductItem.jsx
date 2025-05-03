import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { Link } from 'react-router-dom';

const ProductItem = ({id, image, name, price}) => {
    const { currency } = useContext(ShopContext);

  return (
    <div>
        <Link className='cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                <img src={image[0]} className='hover:scale:120 transition ease-in-out' alt="" />
            </div>
            <p className='pt-3 pb-2 mt-2 text-sm'>{name}</p>
            <p className='text-md font-medium'>{currency} {price}</p>
        </Link>
    </div>
  )
}

export default ProductItem