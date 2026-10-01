// src/server.ts - Entry point
import app from './app';
import { env } from './config/env';
import prisma from './config/prisma';
import { logger } from './utils/logger';

async function bootstrap() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    app.listen(env.PORT, () => {
      logger.info(`🚀 Boaive Backend running on http://localhost:${env.PORT}`);
      logger.info(`📖 API docs: http://localhost:${env.PORT}/api/docs`);
      logger.info(`🏥 Health: http://localhost:${env.PORT}/api/health`);
      logger.info(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:', err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

bootstrap();
