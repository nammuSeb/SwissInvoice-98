import React from 'react';
import { motion } from 'framer-motion';
import useStore from '../store/useStore';
import type { BankInfo } from '../types';

const BankInfoForm: React.FC = () => {
  const { bankInfo, setBankInfo } = useStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankInfo({ ...bankInfo, [name]: value } as BankInfo);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Coordonnées bancaires et entreprise</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
          <input
            type="text"
            name="accountName"
            value={bankInfo.accountName}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        {/* ... other fields ... */}
      </div>
    </motion.div>
  );
};

export default BankInfoForm;