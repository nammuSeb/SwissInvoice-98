export interface BankInfo {
  accountName: string;
  iban: string;
  bic: string;
  bankName: string;
  bankAddress: string;
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
  tax?: number;
}

export interface BaseDocument {
  id: number;
  number: string;
  date: string;
  client: Client;
  items: InvoiceItem[];
  remarks: string;
  total: number;
  qrCode?: string;
}

export interface Invoice extends BaseDocument {
  dueDate: string;
  quoteRef?: string;
}

export interface Quote extends BaseDocument {
  validUntil?: string;
}

export interface Store {
  bankInfo: BankInfo;
  invoices: Invoice[];
  quotes: Quote[];
  addInvoice: (invoice: Invoice) => void;
  addQuote: (quote: Quote) => void;
  updateBankInfo: (info: Partial<BankInfo>) => void;
}
