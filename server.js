import express from 'express';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import path from 'path';

const app = express();
const PORT = 8080;

// Middleware
app.use(express.json());
app.use(express.static('.'));

// AWS SQS Client
const sqs = new SQSClient({ region: 'eu-west-2' });

// SQS Queue URL
const QUEUE_URL = 'https://sqs.eu-west-2.amazonaws.com/740726746628/email-queue';

// Serve UI
app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

// Subscribe API
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const message = {
    type: 'SUBSCRIBE',
    email,
    timestamp: new Date().toISOString(),
    data: `You have successfully subscribed to our newsletter from email ${email}.`
  };

  try {
    await sqs.send(
      new SendMessageCommand({
        QueueUrl: QUEUE_URL,
        MessageBody: JSON.stringify(message?.data)
      })
    );

    res.json({
      message: 'Subscribed successfully! Check your email.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Failed to subscribe'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Running on http://0.0.0.0:${PORT}`);
});
