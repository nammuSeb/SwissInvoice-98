import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import RemarksField from './components/RemarksField';
import InvoiceForm from './components/InvoiceForm';
import { generatePDF } from './utils/pdfGenerator';
import PreviewInvoice from './components/PreviewInvoice';
import useStore from './store/useStore';
import { generateQRCode } from './utils/qrGenerator';
import QuoteList from './components/QuoteList';
import BankInfoForm from './components/BankInfoForm';
import ClientForm from './components/ClientForm';
import { Client, Invoice, Quote, InvoiceItem } from './types';

function App() {
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

  const [invoice, setInvoice] = useState<{
    number: string;
    date: string;
    dueDate: string;
    items: InvoiceItem[];
    remarks: string;
    quoteRef?: string;
  }>({
    number: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [],
    remarks: ''
  });

  const handleQuoteSelection = (quote: Quote) => {
    setClient(quote.client);
    setInvoice({
      ...quote,
      number: `FAC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      quoteRef: quote.number
    });
    setMode('invoice');
    setStep(2);
  };

  const nextStep = () => {
    if (step === 1 && !bankInfo.iban) {
      toast.error('Veuillez remplir les coordonnées bancaires');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    // Calculate total from items
    const total = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    
    const data = {
      ...invoice,
      client,
      remarks,
      bankInfo,
      type: mode,
      total
    };

    try {
      // Generate the PDF first
      const pdfBlob = await generatePDF(data);
      console.log("PDF generated successfully");

      // Generate QR code
      const qrCode = await generateQRCode(data);
      console.log("QR code generated successfully");

      // Save to store
      if (mode === 'quote') {
        addQuote({ ...data, id: Date.now(), qrCode } as Quote);
        toast.success('Devis enregistré avec succès');
      } else {
        addInvoice({ ...data, id: Date.now(), qrCode } as Invoice);
        toast.success('Facture enregistrée avec succès');
      }

      // Download the PDF
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${mode === 'quote' ? 'Devis' : 'Facture'}-${invoice.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Error during document generation:", error);
      toast.error('Erreur lors de la génération du document');
    }
  };

  // Rest of your component remains the same
  // ...
}

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{opacity: 0, y: -20}}
                    animate={{opacity: 1, y: 0}}
                    className="text-center mb-8"
                >
                    {/*
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setMode('invoice')}
              className={`px-4 py-2 rounded-md ${
                mode === 'invoice' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              Facture
            </button>
            <button
              onClick={() => setMode('quote')}
              className={`px-4 py-2 rounded-md ${
                mode === 'quote' ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              Devis
            </button>

          </div>
          */}

                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {mode === 'quote' ? 'Création de devis' : 'Création de facture'}
                    </h1>

                    <div className="flex justify-center items-center space-x-4">
                        <div className={`h-2 w-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}/>
                        <div className={`h-2 w-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}/>
                        <div className={`h-2 w-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-gray-300'}`}/>
                        <div className={`h-2 w-2 rounded-full ${step >= 4 ? 'bg-primary' : 'bg-gray-300'}`}/>
                    </div>
                </motion.div>

                {step === 1 && (
                    <>
                        <BankInfoForm/>
                        <ClientForm client={client} setClient={setClient}/>
                        {/* }{mode === 'invoice' && <QuoteList onSelectQuote={handleQuoteSelection} />} */}
                    </>
                )}
                {step === 2 && <InvoiceForm invoice={invoice} setInvoice={setInvoice}/>}
                {step === 3 && <RemarksField remarks={remarks} setRemarks={setRemarks}/>}
                {step === 4 &&
                    <PreviewInvoice client={client} invoice={invoice} remarks={remarks} bankInfo={bankInfo}/>}

                <div className="mt-8 flex justify-between">
                    {step > 1 && (
                        <button
                            onClick={prevStep}
                            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
                        >
                            Précédent
                        </button>
                    )}
                    {step < 4 && (
                        <button
                            onClick={nextStep}
                            className="ml-auto bg-primary text-white px-6 py-2 rounded-md hover:bg-red-700"
                        >
                            Suivant
                        </button>
                    )}
                    {step === 4 && (
                        <button
                            onClick={handleSubmit}
                            className="ml-auto bg-primary text-white px-6 py-2 rounded-md hover:bg-red-700"
                        >
                            {mode === 'quote' ? 'Générer Devis' : 'Générer Facture'}
                        </button>
                    )}
                </div>
            </div>
            <ToastContainer position="bottom-right"/>
            <div className="max-w-5xl mx-auto mt-6 flex justify-center">
                <a href="https://nammu.ch" target="_blank" rel="noopener noreferrer">
                    <img src="logo_nammu_dark.png" alt="nammu" style={{maxWidth: 320}}/>
                </a>
            </div>
        </div>
    );
}

export default App;
