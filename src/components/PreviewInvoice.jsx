import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { generateQRCode } from '../utils/qrGenerator';

const PreviewInvoice = ({ client, invoice, remarks, bankInfo }) => {
  const calculateSubtotal = () => {
    return invoice.items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateVAT = () => {
    return invoice.items.reduce((total, item) => {
      const itemTotal = item.quantity * item.price;
      return total + (itemTotal * (item.vatRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-lg shadow-lg mt-6"
    >
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">FACTURE</h1>
          <p className="text-gray-600">N° {invoice.number}</p>
        </div>
        <div className="text-right">
          <p>Date: {format(new Date(invoice.date), 'dd MMMM yyyy', { locale: fr })}</p>
          <p>Échéance: {format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale: fr })}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-semibold mb-2">De:</h2>
          <p>{bankInfo.accountName}</p>
          <p>{bankInfo.address}</p>
          <p>{bankInfo.zip} {bankInfo.city}</p>
          <p>Suisse</p>
        </div>
        <div>
          <h2 className="font-semibold mb-2">Facturer à:</h2>
          <p>{client.company}</p>
          <p>{client.contactName}</p>
          <p>{client.address}</p>
          <p>{client.cityAndZip}</p>
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2">Description</th>
            <th className="text-right py-2">Quantité</th>
            <th className="text-right py-2">Prix unitaire</th>
            <th className="text-right py-2">TVA</th>
            <th className="text-right py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-2">{item.description}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">CHF {item.price.toFixed(2)}</td>
              <td className="text-right py-2">{item.vatRate}%</td>
              <td className="text-right py-2">
                CHF {(item.quantity * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {remarks && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Remarques:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{remarks}</p>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="w-1/3">
          {generateQRCode({ ...invoice, bankInfo, total: calculateTotal() })}
        </div>
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Sous-total:</span>
            <span>CHF {calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>TVA:</span>
            <span>CHF {calculateVAT().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 font-bold border-t-2 border-gray-300">
            <span>Total:</span>
            <span>CHF {calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-600">
        <p className="font-semibold">Instructions de paiement:</p>
        <p>Veuillez effectuer le paiement dans les 30 jours en utilisant les informations suivantes:</p>
        <p>IBAN: {bankInfo.iban}</p>
        <p>BIC: {bankInfo.bic}</p>
      </div>
    </motion.div>
  );
};

export default PreviewInvoice;