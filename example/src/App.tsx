import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, Image } from 'react-native';
import { decodeQR } from 'react-native-qr-decoder';
import { launchImageLibrary } from 'react-native-image-picker';

type QR = {
  name: string;
  url: string;
};

export default function App() {
  const [result, setResult] = useState<QR[]>([]);
  const [imageUri, setImageUri] = useState('');
  const [openImgLib, setOpenImgLib] = useState(false);

  const openImageLibrary = async () => {
    try {
      const response = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 1,
      });

      if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      }
    } catch (error) {
      console.error('Error opening image library: ', error);
    }
  };

  useEffect(() => {
    if (openImgLib) {
      openImageLibrary();
      setOpenImgLib(false);
    }
  }, [openImgLib]);

  useEffect(() => {
    if (imageUri) {
      decodeQR(imageUri)
        .then((data) => {
          setResult(data);
          console.log('QR code result:', data);
        })
        .catch((error) => {
          console.error('Error decoding QR code: ', error);
        });
    }
  }, [imageUri]);

  return (
    <View style={styles.container}>
      <Button
        title="Open Image Library"
        color="#841584"
        onPress={() => setOpenImgLib(true)}
      />
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : null}
      {result ? (
        result.map(() => (
          <Text style={{ color: 'white' }}>{result[0].url}</Text>
        ))
      ) : (
        <Text>No QR code decoded.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});
