import express, { Request, Response, NextFunction } from 'express';
import routes from './routes';
import 'reflect-metadata';
import './database';
import AppError from './errors/AppError';

const app = express();
app.use(express.json());
app.use(routes);
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({ message: err.message });
  }

  if (err) {
    return response.status(500).json({ message: err.message });
  }
});

app.listen(3333, () => {
  console.log('🚀 Servidor iniciado na porta 3333');
});
