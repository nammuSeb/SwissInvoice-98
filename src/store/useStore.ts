import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Store, BankInfo, Client, Quote, Invoice } from '../types';

const useStore = create<Store>(
  persist(
    (set) => ({
      bankInfo: {
        accountName: '',
        iban: '',
        bic: '',
        bank: '',
        address: '',
        zip: '',
        city: ''
      },
      clients: [],
      quotes: [],
      invoices: [],
      setBankInfo: (bankInfo: BankInfo) => set({ bankInfo }),
      addClient: (client: Client) => set((state) => ({ 
        clients: [...state.clients, client] 
      })),
      addQuote: (quote: Quote) => set((state) => ({ 
        quotes: [...state.quotes, quote] 
      })),
      addInvoice: (invoice: Invoice) => set((state) => ({ 
        invoices: [...state.invoices, invoice] 
      })),
      updateQuote: (id: number, quote: Quote) => set((state) => ({
        quotes: state.quotes.map((q) => q.id === id ? quote : q)
      })),
      updateInvoice: (id: number, invoice: Invoice) => set((state) => ({
        invoices: state.invoices.map((i) => i.id === id ? invoice : i)
      })),
    }),
    {
      name: 'swiss-invoice-storage',
    }
  )
);

export default useStore;