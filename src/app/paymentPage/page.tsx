'use client'

import React from 'react';
import Donate from '../payment/page';

const PaymentPage = () => {
    return (
        <div className="relative min-h-screen fixed-inset flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 z-0"></div>
            <video 
                autoPlay 
                loop 
                muted 
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto z-[-1] transform -translate-x-1/2 -translate-y-1/2 object-cover"
            >
                <source src="/bg1.mp4" type="video/mp4" />
                <p>Your browser does not support the video tag. Please update your browser.</p>
            </video>
            <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center text-white p-4 sm:p-6 md:p-8">
                <div className="space-y-6 w-full flex flex-col items-center justify-center">
                    <h1 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold transition-opacity duration-500 ease-in-out bg-slate-300 hover:opacity-75 transform rounded-lg p-2 sm:p-3 md:p-4 border border-slate-500 mb-4 sm:mb-6 md:mb-8">
                        Welcome to Our Payment Page.
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6 md:mb-8">Secure and easy payments.</p>
                    <div className="w-full max-w-md flex justify-center p-8 sm:mb-12 md:mb-16">
                        <Donate />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;

