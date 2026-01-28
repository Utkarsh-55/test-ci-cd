import express from 'express';
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
  res.json({ message: 'Hello, utkarsh!' });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Running on http://0.0.0.0:8080');
});