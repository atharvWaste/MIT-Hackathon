import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorHandler } from './src/middlewares/errorHandler.js';
import authRoutes from './src/Routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// ← this was missing
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

export default app;