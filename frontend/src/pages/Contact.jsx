import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import Newsletter from '../components/Newsletter'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'}/>
      </div>
      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl'>Our Store</p>
          <p className='lato-regular text-neutral-700'>Railway Colony ByLane 5 <br /> Near Nepali Mandir <br /> West Gotanagar, Guwahati</p>
          <p className='lato-regular text-neutral-700'>Tel: (+91) 44871 44887 <br />Email: admin@sportify.com</p>
        </div>

      </div>
      <Newsletter/>
    </div>
  )
}

export default Contact