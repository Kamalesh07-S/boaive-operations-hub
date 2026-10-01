// src/app.ts - Express application setup
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFound } from './middleware/errorHandler';
import prisma from './config/prisma';

// Routes
import authRoutes from './routes/auth';
import clientRoutes from './routes/clients';
import contactRoutes from './routes/contacts';
import leadRoutes from './routes/leads';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import financeRoutes from './routes/finance';
import invoiceRoutes from './routes/invoices';
import expenseRoutes from './routes/expenses';
import assetRoutes from './routes/assets';
import contentRoutes from './routes/content';
import { dashboardController } from './controllers/dashboardController';
import { searchController } from './controllers/searchController';
import { authenticate } from './middleware/auth';

const app = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check (no auth) ─────────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// ─── API Documentation ──────────────────────────────────────────────────────
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Boaive Operations Hub API',
  customCss: '.swagger-ui .topbar { display: none }',
}));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.get('/api/dashboard', authenticate, dashboardController.getDashboard);
app.get('/api/search', authenticate, searchController.search);
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/content', contentRoutes);

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
