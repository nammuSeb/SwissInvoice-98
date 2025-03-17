export interface BankInfo {
  accountName: string;
  accountHolder: string; // Added accountHolder
  iban: string;
  bic: string;
  bank: string;
  address: string;
  zip: string;
  city: string;
}

export interface Client {
  company: string;
  contactName: string;
  address: string;
  cityAndZip: string;
  email: string;
  phone: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  vatRate: number;
  unitPrice: number; // Added unitPrice
}

export interface Invoice {
  id?: number;
  number: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  remarks?: string;
  quoteRef?: string;
  total?: number;
  client?: Client;
  qrCode?: string;
  bankInfo?: BankInfo; // Added bankInfo
}

export interface Quote extends Invoice {
  id: number;
  client: Client;
  total: number;
  qrCode?: string;
}

export interface Store {
  bankInfo: BankInfo;
  clients: Client[];
  quotes: Quote[];
  invoices: Invoice[];
  setBankInfo: (bankInfo: BankInfo) => void;
  addClient: (client: Client) => void;
  addQuote: (quote: Quote) => void;
  addInvoice: (invoice: Invoice) => void;
  updateQuote: (id: number, quote: Quote) => void;
  updateInvoice: (id: number, invoice: Invoice) => void;
}
