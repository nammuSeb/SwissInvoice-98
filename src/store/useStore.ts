import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import * as Types from '../types';

type MyPersist = (
  config: (set: any, get: any, api: any) => Types.Store,
  options: PersistOptions<Types.Store>
) => (set: any, get: any, api: any) => Types.Store;

const useStore = create<Types.Store>(
  (persist as MyPersist)(
    (set) => ({
      bankInfo: {
        accountName: '',
        iban: '',
        bic: '',
        bank: '',
        address: '',
        zip: '',
        city: '',
        accountHolder: ''
      },
      clients: [],
      quotes: [],
      invoices: [],
      setBankInfo: (bankInfo: Types.BankInfo) => set({ bankInfo }),
      addClient: (client: Types.Client) => set((state) => ({
        clients: [...state.clients, client]
      })),
      addQuote: (quote: Types.Quote) => set((state) => ({
        quotes: [...state.quotes, quote]
      })),
      addInvoice: (invoice: Types.Invoice) => set((state) => ({
        invoices: [...state.invoices, invoice]
      })),
      updateQuote: (id: number, quote: Types.Quote) => set((state) => ({
        quotes: state.quotes.map((q) => q.id === id ? quote : q)
      })),
      updateInvoice: (id: number, invoice: Types.Invoice) => set((state) => ({
        invoices: state.invoices.map((i) => i.id === id ? invoice : i)
      })),
    }),
    {
      name: 'swiss-invoice-storage',
    }
  )
);

export default useStore;
