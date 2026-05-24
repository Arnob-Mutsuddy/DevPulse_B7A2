import { Router } from 'express';
import { create, getAll, getSingle, update, dele } from './issues.controller';
import authenticate from '../../middleware/authenticate';
import authorize from '../../middleware/authorize';

const router = Router();

router.get('/', getAll);
router.get('/:id', getSingle);
router.post('/', authenticate, authorize('contributor', 'maintainer'), create);
router.patch('/:id', authenticate, authorize('contributor', 'maintainer'), update);
router.delete('/:id', authenticate, authorize('maintainer'), dele);

export default router;