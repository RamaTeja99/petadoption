import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
    return (
        <div>

            <div className='text-center text-2xl pt-10 text-[#707070]'>
                <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-12'>
                <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
                    <p>At Pet Haven, we believe every pet deserves a loving home. Our mission is to bridge the gap between homeless animals and compassionate adopters by creating a simple, transparent, and caring adoption platform.</p>
                    <p>We partner with trusted animal shelters, rescue organizations, and foster homes to bring you pets who are ready to be adopted. Whether you're looking for a playful puppy, a gentle senior dog, or a cuddly cat, you'll find them here.</p>
                    <p>Our goal is not only to help pets find homes but also to guide families in making responsible adoption choices. By choosing adoption, you're not just bringing joy into your life — you're giving an animal a second chance at happiness.</p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>To connect loving families with rescued pets while promoting responsible pet ownership and animal welfare in our community.</p>
                </div>
            </div>

            <div className='text-xl my-4'>
                <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
            </div>

            <div className='flex flex-col md:flex-row mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>EFFICIENCY:</b>
                    <p>Streamlined adoption process that makes finding your perfect pet quick and hassle-free.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>CONVENIENCE:</b>
                    <p>Browse pets from the comfort of your home and schedule meet-and-greet sessions at your convenience.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
                    <b>PERSONALIZATION:</b>
                    <p>Get matched with pets that suit your lifestyle, living situation, and preferences perfectly.</p>
                </div>
            </div>

        </div>
    )
}

export default About