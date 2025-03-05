import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClientForm from './components/ClientForm';
import InvoiceForm from './components/InvoiceForm';
import PreviewInvoice from './components/PreviewInvoice';
import BankInfoForm from './components/BankInfoForm';
import RemarksField from './components/RemarksField';
import QuoteList from './components/QuoteList';
import useStore from './store/useStore';
import { generatePDF } from './utils/pdfGenerator';
import { generateQRCode } from './utils/qrGenerator';
import type { Client, Invoice, Quote } from './types';

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'invoice' | 'quote'>('invoice');
  const [client, setClient] = useState<Client>({
    company: '',
    contactName: '',
    address: '',
    cityAndZip: '',
    email: '',
    phone: ''
  });
  const [remarks, setRemarks] = useState('');
  const { bankInfo, addQuote, addInvoice } = useStore();

  const [invoice, setInvoice] = useState<Invoice>({
    number: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    remarks: ''
  });

  // ... rest of your component code ...

  return (
    // ... your JSX ...
  );
};

export default App;