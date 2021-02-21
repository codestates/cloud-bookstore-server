import express from 'express';
const app = express();

app.get('/', (req, res) => res.status(200).send('Hello??'));

// eslint-disable-next-line no-console
app.listen(5000, () => console.log('Hello World!!!'));
