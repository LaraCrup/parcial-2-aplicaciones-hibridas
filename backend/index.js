import express from 'express';
import dotenv from 'dotenv';
import routerAPI from './routers/index.js';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config()
const port = process.env.PORT;
const uri_db = process.env.URI_DB;

const app = express();

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use('/uploads', express.static(uploadsDir));

mongoose.connect(uri_db);
const db = mongoose.connection;
db.on('error', (error) => console.error(error, 'Error de conexión'));
db.once('open', () => console.info('Conectado a la base de datos'));

app.use(express.json());
app.use(cors());

app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Iniciando el servidor en el puerto ${port}`);
});

app.get('/', (req, res) => {
  console.log(`Cliente conectado`);
  res.send('<h1>Home</h1>');
});

routerAPI(app);