import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
  },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.table}>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Nombre</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Edad</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Ciudad</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Juan</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>30</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>San Salvador</Text>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Ana</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>25</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Santa Ana</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export const Pdf = () => (
  <div>
    <h1>Mi Aplicación PDF</h1>
    <PDFDownloadLink document={<MyDocument />} fileName="reporte.pdf">
      {({
        // blob, url,
        loading,
        // error
      }) => (loading ? "Generando PDF..." : "Descargar PDF")}
    </PDFDownloadLink>
  </div>
);
