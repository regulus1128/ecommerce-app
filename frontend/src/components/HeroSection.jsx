import React, { useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'


const HeroSection = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const IMAGES = [assets.shoe1, assets.shoe2, assets.shoe3, assets.shoe4, assets.shoe5, assets.shoe6];
    const TEXTS = [
        "Explore Kids Collection",
        "Latest Arrivals On Women's Casual Shoes",
        "Women's Sports Shoes",
        "Men's Classic Formals",
        "Men's Classic Formals",
        "Explore Latest Collection Of Men's Casuals",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center border p-0">
            <div className="max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                            {/* <div className="w-8 md:w-11 h-[2px] bg-[#414141]"></div>
                            <p className="proza-libre-regular font-medium text-sm md:text-base">OUR BESTSELLERS</p> */}
                        </div>
                        <h1 className="lato-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">LATEST ARRIVALS</h1>
                        <div className="flex items-center gap-2">
                            <p className="proza-libre-regular font-semibold text-sm md:text-base">SHOP NOW</p>
                            <div className="w-8 md:w-11 h-[1px] bg-[#414141]"></div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="relative w-full h-[400px]">
                            {IMAGES.map((image, index) => (
                                <img
                                    key={index}
                                    className={`absolute w-full h-full object-contain transition-opacity duration-500 ${
                                        index === imageIndex ? 'opacity-100' : 'opacity-0'
                                    }`}
                                    src={image}
                                    alt={TEXTS[index]}
                                />
                                
                            ))}
                        </div>
                        {/* <div className="flex justify-center mt-4">
                            {IMAGES.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full mx-1 ${
                                        index === imageIndex ? 'bg-gray-800' : 'bg-gray-400'
                                    }`}
                                ></div>
                            ))}
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection