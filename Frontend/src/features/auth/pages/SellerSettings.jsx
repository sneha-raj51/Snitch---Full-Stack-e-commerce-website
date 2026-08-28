import React from 'react';

const SellerSettings = () => {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />
            <div className="min-h-screen selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}>
                <div className="max-w-7xl mx-auto px-8 lg:px-16 xl:px-24 pt-20">
                    <div className="mb-10 text-center">
                        <span className="text-[10px] uppercase tracking-[0.24em] font-medium" style={{ color: '#C9A96E' }}>
                            Seller Dashboard
                        </span>
                        <h1 className="text-5xl lg:text-6xl font-light mt-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Settings
                        </h1>
                    </div>
                    
                    <div className="py-24 text-center flex flex-col items-center">
                        <h2 className="text-2xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}>
                            Store Preferences
                        </h2>
                        <p className="max-w-md mx-auto text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                            Configure your notification preferences, payout methods, and security settings here.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SellerSettings;
