const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  const [publicId] = filename.split('.');
  return publicId;
};
module.exports = { extractPublicId };