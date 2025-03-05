import { pdf } from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import QRCode from 'qrcode';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontFamily: 'Helvetica',
    fontSize: 9
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 3
  },
  invoiceNumber: {
    fontSize: 10,
    marginBottom: 5
  },
  dateSection: {
    fontSize: 9,
    textAlign: 'right'
  },
  addressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    fontSize: 9
  },
  addressBox: {
    width: '40%'
  },
  addressTitle: {
    fontWeight: 'bold',
    marginBottom: 4
  },
  table: {
    marginBottom: 15
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 6,
    fontWeight: 'bold',
    fontSize: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 8
  },
  descriptionCol: { width: '40%' },
  quantityCol: { width: '10%', textAlign: 'center' },
  priceCol: { width: '20%', textAlign: 'right' },
  vatCol: { width: '10%', textAlign: 'center' },
  totalCol: { width: '20%', textAlign: 'right' },

  remarksSection: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 8,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 3
  },

  contentRow: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15
  },
  qrCodeColumn: {
    width: '40%',
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  summaryColumn: {
    width: '60%',
    alignItems: 'flex-end',
  },
  summaryTable: {
    width: '60%',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    fontSize: 8
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 5,
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: 10
  },

  footer: {
    marginTop: 15,
    marginBottom: 20,
    fontSize: 8,
    color: '#333',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },

  qrBillSection: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 15
  },
  qrGrid: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    height: 130
  },
  qrReceiptCol: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 6
  },
  qrMainCol: {
    width: '33%',
    borderRightWidth: 1,
    borderRightColor: '#000',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrInfoCol: {
    width: '34%',
    padding: 6
  },
  qrTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3
  },
  qrText: {
    fontSize: 6,
    marginBottom: 1
  },
  clientAddress: {
    marginTop: 3,
    marginBottom: 5
  }
});

const generateQrCodeData = async (data) => {
  if (!data || !data.bankInfo || !data.bankInfo.iban) {
    console.log("Missing data for QR code generation");
    return null;
  }

  try {
    const total = (data.items || []).reduce((sum, item) => {
      const price = item.price || item.unitPrice || 0;
      return sum + (item.quantity * price);
    }, 0);

    const qrData = {
      amount: total.toFixed(2),
      currency: 'CHF',
      iban: data.bankInfo.iban || '',
      creditor: {
        name: data.bankInfo.accountHolder || data.bankInfo.accountName || '',
        address: data.bankInfo.address || '',
        zip: data.bankInfo.zip || '',
        city: data.bankInfo.city || '',
        country: 'CH'
      },
      debtor: {
        name: data.client?.company || '',
        address: data.client?.address || '',
        zip: data.client?.cityAndZip?.split(' ')[0] || '',
        city: data.client?.cityAndZip?.split(' ').slice(1).join(' ') || '',
        country: 'CH'
      },
      reference: data.number
    };

    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
      errorCorrectionLevel: 'H',
      margin: 1,
      width: 250
    });

    console.log("QR code generated successfully");
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    return null;
  }
};

const PDFDocument = ({ data }) => {
  const calculateSubtotal = () => {
    return (data.items || []).reduce((total, item) => {
      const price = item.price || item.unitPrice || 0;
      return total + (item.quantity * price);
    }, 0);
  };

  const calculateVAT = () => {
    return (data.items || []).reduce((total, item) => {
      const price = item.price || item.unitPrice || 0;
      const vatRate = item.vatRate || item.tax || 0;
      const itemTotal = item.quantity * price;
      return total + (itemTotal * (vatRate / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header with invoice number and date */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {data.type === 'quote' ? 'DEVIS' : 'FACTURE'}
              </Text>
              <Text style={styles.invoiceNumber}>N° {data.number}</Text>
            </View>
            <View style={styles.dateSection}>
              <Text>Date: {format(new Date(data.date), 'dd MMMM yyyy', { locale: fr })}</Text>
              {data.type === 'invoice' && (
                  <Text>Échéance: {format(new Date(data.dueDate), 'dd MMMM yyyy', { locale: fr })}</Text>
              )}
            </View>
          </View>

          {/* Address section */}
          <View style={styles.addressSection}>
            <View style={styles.addressBox}>
              <Text style={styles.addressTitle}>De:</Text>
              <Text>{data.bankInfo?.accountHolder || data.bankInfo?.accountName || ''}</Text>
              <Text>{data.bankInfo?.address || ''}</Text>
              <Text>{data.bankInfo?.zip || ''} {data.bankInfo?.city || ''}</Text>
              <Text>Suisse</Text>
            </View>
            <View style={styles.addressBox}>
              <Text style={styles.addressTitle}>Facturer à:</Text>
              <Text>{data.client?.company || ''}</Text>
              <Text>{data.client?.contactName || ''}</Text>
              <Text>{data.client?.address || ''}</Text>
              <Text>{data.client?.cityAndZip || ''}</Text>
            </View>
          </View>

          {/* Invoice items table */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.descriptionCol}>Description</Text>
              <Text style={styles.quantityCol}>Quantité</Text>
              <Text style={styles.priceCol}>Prix unitaire</Text>
              <Text style={styles.vatCol}>TVA</Text>
              <Text style={styles.totalCol}>Total</Text>
            </View>

            {(data.items || []).map((item, index) => {
              const price = item.price || item.unitPrice || 0;
              const vatRate = item.vatRate || item.tax || 0;
              return (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.descriptionCol}>{item.description || ''}</Text>
                    <Text style={styles.quantityCol}>{item.quantity || 0}</Text>
                    <Text style={styles.priceCol}>CHF {price.toFixed(2)}</Text>
                    <Text style={styles.vatCol}>{vatRate}%</Text>
                    <Text style={styles.totalCol}>
                      CHF {(item.quantity * price).toFixed(2)}
                    </Text>
                  </View>
              );
            })}
          </View>

          {/* Remarks section */}
          {data.remarks && (
              <View style={styles.remarksSection}>
                <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Remarques:</Text>
                <Text>{data.remarks}</Text>
              </View>
          )}

          {/* QR code and Summary layout */}
          <View style={styles.contentRow}>
            <View style={styles.qrCodeColumn}>
              {data.qrCode ? (
                  <Image src={data.qrCode} style={styles.qrCode} />
              ) : (
                  <View style={{
                    width: 150,
                    height: 150,
                    border: '1px solid #ddd',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Text style={{fontSize: 8, textAlign: 'center'}}>QR Code</Text>
                  </View>
              )}
            </View>

            <View style={styles.summaryColumn}>
              <View style={styles.summaryTable}>
                <View style={styles.summaryRow}>
                  <Text>Sous-total:</Text>
                  <Text>CHF {calculateSubtotal().toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text>TVA:</Text>
                  <Text>CHF {calculateVAT().toFixed(2)}</Text>
                </View>
                <View style={styles.summaryTotal}>
                  <Text>Total:</Text>
                  <Text>CHF {calculateTotal().toFixed(2)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Payment instructions */}
          <View style={styles.footer}>
            <Text style={{ fontWeight: 'bold', marginBottom: 3 }}>Instructions de paiement:</Text>
            <Text>Veuillez effectuer le paiement dans les 30 jours en utilisant les informations suivantes:</Text>
            <Text>IBAN: {data.bankInfo?.iban || ''}</Text>
            {data.bankInfo?.bic && <Text>BIC: {data.bankInfo.bic}</Text>}
          </View>

          {/* Swiss QR Bill Section */}
          <View style={styles.qrBillSection} wrap={false}>
            <View style={styles.qrGrid}>
              {/* Receipt Column */}
              <View style={styles.qrReceiptCol}>
                <Text style={styles.qrTitle}>Récépissé</Text>
                <Text style={styles.qrText}>Compte / Payable à</Text>
                <Text style={styles.qrText}>{data.bankInfo?.iban || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.accountHolder || data.bankInfo?.accountName || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.address || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.zip || ''} {data.bankInfo?.city || ''}</Text>

                <Text style={[styles.qrText, {marginTop: 3, marginBottom: 2, fontWeight: 'bold'}]}>Payable par (nom/adresse)</Text>
                <View style={styles.clientAddress}>
                  <Text style={styles.qrText}>{data.client?.company || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.contactName || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.address || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.cityAndZip || ''}</Text>
                </View>

                <Text style={styles.qrText}>Monnaie</Text>
                <Text style={styles.qrText}>CHF</Text>
              </View>

              {/* QR Code Column */}
              <View style={styles.qrMainCol}>
                <Text style={styles.qrTitle}>Section paiement</Text>
                {data.qrCode ? (
                    <Image src={data.qrCode} style={{ width: 85, height: 85 }} />
                ) : (
                    <View style={{ width: 85, height: 85 }}>
                      <Text style={{fontSize: 6, textAlign: 'center', marginTop: 30}}>QR Code</Text>
                    </View>
                )}

                <Text style={[styles.qrText, {marginTop: 3}]}>Monnaie</Text>
                <Text style={styles.qrText}>CHF</Text>

                <Text style={styles.qrText}>Montant</Text>
                <Text style={styles.qrText}>CHF {calculateTotal().toFixed(2)}</Text>
              </View>

              {/* Information Column */}
              <View style={styles.qrInfoCol}>
                <Text style={styles.qrText}>Compte / Payable à</Text>
                <Text style={styles.qrText}>{data.bankInfo?.iban || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.accountHolder || data.bankInfo?.accountName || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.address || ''}</Text>
                <Text style={styles.qrText}>{data.bankInfo?.zip || ''} {data.bankInfo?.city || ''}</Text>

                <Text style={[styles.qrText, {marginTop: 3, marginBottom: 2, fontWeight: 'bold'}]}>Payable par (nom/adresse)</Text>
                <View style={styles.clientAddress}>
                  <Text style={styles.qrText}>{data.client?.company || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.contactName || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.address || ''}</Text>
                  <Text style={styles.qrText}>{data.client?.cityAndZip || ''}</Text>
                </View>
              </View>
            </View>
          </View>
        </Page>
      </Document>
  );
};

export const generatePDF = async (data) => {
  try {
    console.log("Generating PDF with data:", data);
    let modifiedData = { ...data };

    // Generate QR code synchronously before creating the PDF
    if (!modifiedData.qrCode) {
      const qrCode = await generateQrCodeData(data);
      if (qrCode) {
        modifiedData.qrCode = qrCode;
      }
    }

    // Wait for PDF generation
    const result = await pdf(<PDFDocument data={modifiedData} />).toBlob();
    console.log("PDF generation successful");

    // Verify QR code is included
    if (!modifiedData.qrCode) {
      console.warn("⚠️ Warning: PDF generated without QR code");
    } else {
      console.log("✓ QR code successfully included in PDF");
    }

    return result;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};
