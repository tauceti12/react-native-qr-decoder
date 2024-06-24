import * as React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { decodeQR } from 'react-native-qr-decoder';

export default function App() {
  const [result, setResult] = React.useState();

  const exampleImage = require('./qr-code.png');

  const barcode = async () =>
    decodeQR(exampleImage)
      .then((data) => {
        setResult(data);
        console.log('QR', data);
      })
      .catch((error) => {
        console.error(error);
      });

  React.useEffect(() => {
    console.log(exampleImage);
    barcode();
  }, [exampleImage]);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
