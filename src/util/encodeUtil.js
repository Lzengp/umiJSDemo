/*
  基于CryptoJS的加密工具函数
*/
import encUtf8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import Pkcs7 from 'crypto-js/pad-pkcs7';

const DEFAULT_AES_IV = '3468546098617269';
const KEY_AES = 'A4C25461C1E5CC67';


/**aes解密 */
export function decodeAES(ciphertextStr, keyStr = KEY_AES, ivStr = DEFAULT_AES_IV) {
  const key = encUtf8.parse(keyStr);
  const iv = encUtf8.parse(ivStr);
  const encrypted = AES.decrypt(ciphertextStr, key, {
    iv,
    padding: Pkcs7,
  });
  return encrypted.toString(encUtf8);
}

// aes加密
export function encodeAES(passwordStr, keyStr = KEY_AES, ivStr = DEFAULT_AES_IV) {
  const key = encUtf8.parse(keyStr);
  const iv = encUtf8.parse(ivStr);
  const password = encUtf8.parse(passwordStr);
  const encrypted = AES.encrypt(password, key, {
    iv,
    padding: Pkcs7
  });
  return encrypted.toString();
}