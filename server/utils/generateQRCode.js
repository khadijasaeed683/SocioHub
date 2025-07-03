const QRCode = require('qrcode');

const generateQRCode = async (text) => {
  try {
    const qrDataURL = await QRCode.toDataURL(text, { width: 300 });
    return qrDataURL;
  } catch (err) {
    throw err;
  }
};

module.exports = generateQRCode;
