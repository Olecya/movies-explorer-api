const JWT_KEY_SECRET = 'SICRET';
const addressMongodb = process.env.ADDRESSMONGOBD || 'mongodb://localhost:27017/bitfilmsdb';

module.exports = {
  JWT_KEY_SECRET, addressMongodb,
};
