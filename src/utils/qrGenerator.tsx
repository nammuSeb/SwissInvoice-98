import QRCode from 'qrcode';
import { Invoice } from '../types';

export const generateQRCode = async (data: Invoice): Promise<string> => {
  try {
    console.log("Generating QR code...");

    // Calculate total from items
    const total = data.items.reduce((sum, item) => 
      sum + (item.quantity * item.price), 0);

    const qrData = {
      amount: total.toFixed(2),
      currency: 'CHF',
      iban: data.bankInfo?.iban,
      creditor: {
        name: data.bankInfo?.accountName,
        address: data.bankInfo?.address || '',
        zip: data.bankInfo?.zip || '',
        city: data.bankInfo?.city || '',
        country: 'CH'
      },
      reference: data.number
    };

    // Generate a data URL that can be stored
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 4,
      width: 256
    });

    console.log("QR code generated successfully");
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};
