import express from 'express';
import routes from './routes';
import 'reflect-metadata';
import './database';
import uploadConfig from './config/uploadConfig';

const app = express();
app.use(express.json());
app.use(routes);
app.use('/files', express.static(uploadConfig.directory));
app.listen(3333, () => {
  console.log('🚀 Servidor iniciado na porta 3333');
});
