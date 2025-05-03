import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const { currency, deliveryFee, getCartAmount } = useContext(ShopContext);
    

  return (
    <div className='w-full'>
        <div className='text-xl'>
            <Title text1={'CART'} text2={'TOTAL'}/>
        </div>
        <div className='flex flex-col gap-2 mt-2 text-md'>
            <div className='flex justify-between'>
                <p className='lato-regular'>Subtotal</p>
                <p className='lato-regular'>{currency} {getCartAmount()}</p>
            </div>
            
            <div className='flex justify-between'>
                <p className='lato-regular'>Shipping Fee</p>
                <p className='lato-regular'>{currency} {getCartAmount() === 0 ? 0 : deliveryFee}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b className='lato-regular font-bold'>Total</b>
                <b className='lato-regular'>{currency} {getCartAmount() === 0 ? 0 : getCartAmount() + deliveryFee}</b>

            </div>
        </div>
    </div>
  )
}

export default CartTotal