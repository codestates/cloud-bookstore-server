import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser, { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes/index';
import { createConnection } from 'typeorm';

createConnection()
  .then(() => {
    console.log('typeorm connected');
  })
  .catch((err) => {
    console.log('typeorm error', err);
  });

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', router);

app.use(
  cors({
    origin: [
      'https://cloud-bookstore.com',
      'https://www.cloud-bookstore.com',
      'https://server.cloud-bookstore.com',
    ],
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
import Novel from '../src/entity/Novel';

app.get('/', async (req: Request, res: Response) => {
  res.status(200).send();
});

//Handle Error
app.use((err: Error, req: Request, res: Response) => {
  res.status(500).send({
    message: err.message,
  });
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('Hello World!!!'));
