export interface BankInfo {
  accountName: string;
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
}

export interface Quote extends Invoice {
  id: number;
  client: Client;
  total: number;
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