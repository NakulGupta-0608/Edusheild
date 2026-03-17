const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '../.env.local');
let uri = '';
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (match) {
    uri = match[1].trim();
  }
}

mongoose.connect(uri)
  .then(() => {
    return mongoose.connection.collection('institutes').deleteMany({
      name: { $in: ['Allen Career Institute', 'Resonance', 'Aakash Institute'] }
    });
  })
  .then(res => {
    console.log('Deleted mock data:', res.deletedCount);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
