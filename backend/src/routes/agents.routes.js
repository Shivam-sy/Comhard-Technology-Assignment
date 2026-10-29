import { Router } from 'express';
import * as agentsController from '../controllers/agents.controller.js';
import { requireStaff } from '../middleware/auth.js';

const router = Router();

router.get('/', requireStaff, agentsController.listAgents);

export default router;
