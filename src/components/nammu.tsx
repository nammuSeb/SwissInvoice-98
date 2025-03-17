import React from 'react';

const Nammu = () => {
    return (
        <div className="max-w-5xl mx-auto mt-6">
            <div className="flex justify-center mb-6">
                <a href="https://nammu.ch" target="_blank" rel="noopener noreferrer">
                    <img src="logo_nammu_dark.png" alt="nammu" className="max-w-xs" />
                </a>
            </div>
            <div className="text-center px-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Créez vos factures en quelques clics</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Outil suisse spécialisé dans la création de factures professionnelles conformes aux normes suisses avec QR-code.
                </p>
            </div>
        </div>
    );
};

export default Nammu;
