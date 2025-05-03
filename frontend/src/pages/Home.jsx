import React from 'react'
import LatestCollection from '../components/LatestCollection'
import OurPolicy from '../components/OurPolicy'
import Newsletter from '../components/Newsletter'
import ImageSilder from '../components/ImageSilder'

const Home = () => {
  return (
    <>
    <ImageSilder/>
    <LatestCollection/>
    {/* <BestSeller/> */}
    <OurPolicy/>
    <Newsletter/>
    </>
  )
}

export default Home