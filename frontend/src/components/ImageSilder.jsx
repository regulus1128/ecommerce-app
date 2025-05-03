import React, { useEffect, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'

const ImageSilder = () => {
    
    const IMAGES = [assets.shoe1, assets.shoe2, assets.shoe3, assets.shoe4, assets.shoe5, assets.shoe6, assets.shoe7];

    const TEXTS = [
        "Fresh Fits for Little Feet",
        "New In: Women's Casual Kicks",
        "Step Up: Women's Activewear",
        "Timeless Style for Him",
        "Sleek & Sophisticated Formals",
        "Everyday Cool: Men's Casuals",
        "Heels That Turn Heads"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const INTERVAL_TIME = 5000; // 5 seconds

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        }, INTERVAL_TIME);

        return () => clearInterval(interval);
    }, [IMAGES.length]);

    const handleIndicatorClick = (index) => {
        setCurrentIndex(index);
    }


  return (
    <div className="relative w-full h-[75vh] rounded-sm overflow-hidden">
      {/* Images */}
      {IMAGES.map((src, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <img src={src || "/placeholder.svg"} alt={TEXTS[index]} className="object-cover w-full h-full" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/40 p-6 md:p-8 rounded-sm max-w-2xl text-center">
              <h2 className="text-white text-md lato-regular md:text-4xl sm:text-4xl">{TEXTS[index]}</h2>
            </div>
          </div>
        </div>
      ))}

      {/* Indicators */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
        {IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => handleIndicatorClick(index)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full transition-all ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSilder