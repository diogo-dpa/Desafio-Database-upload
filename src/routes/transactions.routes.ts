import { Router } from 'express';

// importa multer para upload de arquivos
import multer from 'multer';

import {getCustomRepository} from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

// importa as configurações de upload de arquivos
import uploadConfig from '../config/upload';


const transactionsRouter = Router();

const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // Atribui o repositório de Transação a uma variável
  const transactionRepo = getCustomRepository(TransactionsRepository)

  // utilização de await pq mexe com banco de dados
  const transactions = await transactionRepo.find();

  const balance = await transactionRepo.getBalance();

  const result = {
    "transactions": transactions,
    "balance": balance
  }

  return response.json(result);
});


transactionsRouter.post('/', async (request, response) => {
      // recebo os params do corpo da requisição
      const {title, value, type, category} = request.body;
  
      // instancia o service de criação de transição
      const createTransaction = new CreateTransactionService();
  
      // cria transação, por meio do execute do service
      const transaction = await createTransaction.execute({title, value, type, category});
      
      return response.json(transaction)
    
});

transactionsRouter.delete('/:id', async (request, response) => {
  // extrai o parâmetro id de params
  const {id} = request.params;

  // Instancia o Service de delete
  const deleteTransaction = new DeleteTransactionService();

  // chama o método execute de service, com uso do await 
  await deleteTransaction.execute({id}); 

  // retorna função vazia
  return response.status(204).send();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {

  //instancio o service de importação de arquivos
  const importService = new ImportTransactionsService();

  // utiliza o método execute 
  const transactions = await importService.execute(request.file.path);

  return response.json(transactions);
});

export default transactionsRouter;
