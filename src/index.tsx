import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-qr-decoder' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const QrDecoder = NativeModules.QrDecoder
  ? NativeModules.QrDecoder
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export const decodeQR = (uriString: string) => {
  return new Promise((resolve, reject) => {
    QrDecoder.decode(uriString)
      .then((res: any) => resolve(res))
      .catch((err: any) => reject(err));
  });
};
