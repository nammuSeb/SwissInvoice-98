import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { generateQRCode } from '../utils/qrGenerator';
import { fr } from 'date-fns/locale';

const PreviewInvoice = ({ client, invoice, remarks, bankInfo }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const loadQRCode = async () => {
      try {
        setIsLoading(true);
        const qrCode = await generateQRCode({
          ...invoice,
          bankInfo,
          total: calculateTotal()
        });
        setQrCodeUrl(qrCode);
      } catch (error) {
        console.error('Error loading QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQRCode();
  }, [invoice, bankInfo]);

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
              <td className="text-right py-2">CHF {(item.quantity * item.price * (1 + item.vatRate / 100)).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right">
        <p className="text-lg font-semibold">Sous-total: CHF {calculateSubtotal().toFixed(2)}</p>
        <p className="text-lg font-semibold">TVA: CHF {calculateVAT().toFixed(2)}</p>
        <p className="text-xl font-bold">Total: CHF {calculateTotal().toFixed(2)}</p>
      </div>

      {isLoading ? (
        <p>Loading QR Code...</p>
      ) : (
        <img src={qrCodeUrl} alt="QR Code" className="mt-4" />
      )}

      <div className="mt-8">
        <h2 className="font-semibold mb-2">Remarques:</h2>
        <p>{remarks}</p>
      </div>
    </motion.div>
  );
};

export default PreviewInvoice;
