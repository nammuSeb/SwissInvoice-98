import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Invoice } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 10
  }
});

interface PDFDocumentProps {
  data: Invoice;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.number}</Text>
      </View>
    </Page>
  </Document>
);

export const generatePDF = async (data: Invoice): Promise<Blob> => {
  return await pdf(<PDFDocument data={data} />).toBlob();
};