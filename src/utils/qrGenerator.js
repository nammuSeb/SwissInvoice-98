import { QRCodeSVG } from 'qrcode.react';

export const generateQRCode = (data) => {
  const qrData = {
    amount: data.total.toFixed(2),
    currency: 'CHF',
    iban: data.bankInfo.iban,
    creditor: {
      name: data.bankInfo.accountName,
      address: data.bankInfo.address || 'Rue exemple',
      zip: data.bankInfo.zip || '1200',
      city: data.bankInfo.city || 'Genève',
      country: 'CH'
    },
    reference: data.number
  };

  return <QRCodeSVG 
    value={JSON.stringify(qrData)}
    size={256}
    level="H"
    includeMargin={true}
  />;
};