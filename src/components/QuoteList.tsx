import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import useStore from '../store/useStore';

const QuoteList = ({ onSelectQuote }) => {
  const quotes = useStore((state) => state.quotes);

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Devis existants</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numéro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotes.map((quote) => (
              <tr key={quote.id}>
                <td className="px-6 py-4 whitespace-nowrap">{quote.number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{quote.client.company}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(quote.date), 'dd MMMM yyyy', { locale: fr })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  CHF {quote.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onSelectQuote(quote)}
                    className="text-primary hover:text-red-700"
                  >
                    Créer facture
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuoteList;