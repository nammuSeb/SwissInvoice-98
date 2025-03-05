import { QRCodeSVG } from 'qrcode.react';
import type { Invoice, BankInfo } from '../types';

interface QRData {
  amount: string;
  currency: string;
  iban: string;
  creditor: {
    name: string;
    address: string;
    zip: string;
    city: string;
    country: string;
  };
  reference: string;
}

interface QRCodeProps {
  data: Invoice & { bankInfo: BankInfo; total: number };
}

export const generateQRCode: React.FC<QRCodeProps> = ({ data }) => {
  const qrData: QRData = {
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

  return (
    <QRCodeSVG
      value={JSON.stringify(qrData)}
      size={256}
      level="H"
      includeMargin={true}
    />
  );
};