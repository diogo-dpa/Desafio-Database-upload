import { Router } from 'express';

import transactionsRouter from './transactions.routes';

const routes = Router();

// Para todas as rotas de transação
routes.use('/transactions', transactionsRouter);

export default routes;
