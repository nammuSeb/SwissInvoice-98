import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const VAT_RATES = [
  { value: 7.7, label: '7.7% (Standard)' },
  { value: 2.5, label: '2.5% (Réduit)' },
  { value: 3.7, label: '3.7% (Hébergement)' },
];

const InvoiceForm = ({ invoice, setInvoice }) => {
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, price: 0, vatRate: 7.7 }]
    }));
  };

  const updateItem = (index, field, value) => {
    setInvoice(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const removeItem = (index) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return invoice.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      const vatAmount = itemTotal * (item.vatRate / 100);
      return total + itemTotal + vatAmount;
    }, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-lg mt-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Détails de la facture</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Numéro de facture</label>
          <input
            type="text"
            value={invoice.number}
            onChange={(e) => setInvoice(prev => ({ ...prev, number: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date de facturation</label>
          <input
            type="date"
            value={format(new Date(invoice.date), 'yyyy-MM-dd')}
            onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Échéance</label>
          <input
            type="date"
            value={format(new Date(invoice.dueDate), 'yyyy-MM-dd')}
            onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Articles</h3>
        {invoice.items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4 items-end">
            <div className="col-span-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Quantité</label>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Prix CHF</label>
              <input
                type="number"
                step="0.01"
                value={item.price}
                onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">TVA</label>
              <select
                value={item.vatRate}
                onChange={(e) => updateItem(index, 'vatRate', parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                {VAT_RATES.map(rate => (
                  <option key={rate.value} value={rate.value}>{rate.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => removeItem(index)}
                className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={addItem}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Ajouter un article
        </button>
      </div>

      <div className="border-t pt-4">
        <div className="text-right">
          <p className="text-xl font-bold">
            Total: CHF {calculateTotal().toFixed(2)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default InvoiceForm;