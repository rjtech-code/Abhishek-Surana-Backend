import { Router } from 'express';
import { isDbConnected } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

router.get('/health', (req, res) => {
  const dbStatus = isDbConnected() ? 'connected' : 'disconnected';
  const data = {
    status: isDbConnected() ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: dbStatus,
    uptimeSeconds: Math.floor(process.uptime()),
  };

  return ApiResponse.success(res, 'API health status check', data);
});

export default router;