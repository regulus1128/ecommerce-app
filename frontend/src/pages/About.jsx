import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import Newsletter from "../components/Newsletter";

const About = () => {
  return (
    <div>
      <div className="text-3xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img className="w-full md:max-w-[450px]" src={assets.aboutimg} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 lato-regular">
          <h2 className="text-2xl font-bold">
            Step Into Style. Step Into SoleVibe.
          </h2>
          <p>
            At SoleVibe, we believe that every step you take should speak
            volumes about who you are. That’s why we’ve created a space where
            fashion meets function—offering a curated collection of formals,
            casuals, and sports shoes that match every vibe and lifestyle.
          </p>
          <p>
            Whether you're dressing up for the boardroom, chilling out on the
            weekend, or pushing limits at the gym, SoleVibe is here to make sure
            your feet never miss a beat.
          </p>
          <h2 className="font-bold">Our Mission</h2>
          <p>
            To empower individuals with the confidence to walk their path in
            style. We’re not just selling shoes—we’re building a movement around
            comfort, quality, and bold self-expression.
          </p>
          <h2 className="font-bold">Walk With Us</h2>
          <p>
             We’re not just a brand—we’re a community of movers,
            doers, and style seekers. Join the #SoleVibe movement and discover
            the perfect pair for every part of your journey. 
          </p>
          <h2 className="text-xl font-bold">Stay stylish. Stay
            moving. Welcome to SoleVibe.</h2>
        </div>
      </div>
      <div className="mt-6">
        <Newsletter />
      </div>
    </div>
  );
};

export default About;
