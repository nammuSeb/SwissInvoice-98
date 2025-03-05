import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
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
      setBankInfo: (bankInfo) => set({ bankInfo }),
      addClient: (client) => set((state) => ({ 
        clients: [...state.clients, client] 
      })),
      addQuote: (quote) => set((state) => ({ 
        quotes: [...state.quotes, quote] 
      })),
      addInvoice: (invoice) => set((state) => ({ 
        invoices: [...state.invoices, invoice] 
      })),
      updateQuote: (id, quote) => set((state) => ({
        quotes: state.quotes.map((q) => q.id === id ? quote : q)
      })),
      updateInvoice: (id, invoice) => set((state) => ({
        invoices: state.invoices.map((i) => i.id === id ? invoice : i)
      })),
    }),
    {
      name: 'swiss-invoice-storage',
    }
  )
);