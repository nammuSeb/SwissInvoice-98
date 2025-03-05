import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  },
  // ... autres styles
});

const PDFDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Contenu du PDF */}
    </Page>
  </Document>
);

export const generatePDF = async (data) => {
  return await pdf(<PDFDocument data={data} />).toBlob();
};