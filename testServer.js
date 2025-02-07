const express = require('express');
const app = express();
const PORT = 5001;

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Test server error:', err);
});