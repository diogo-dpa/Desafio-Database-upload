import AppError from '../errors/AppError';

import {getCustomRepository} from 'typeorm';
import Transaction from '../models/Transaction';

import TransactionsRepository  from "../repositories/TransactionsRepository";

interface Request{
  id: string;
}


class DeleteTransactionService {
  public async execute({id}: Request): Promise<void> {
    // TODO

    const transactionRepo = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepo.findOne(id);

    // se a transaction não existe
    if(!transaction){
      throw new AppError('TRansaction does not exist.', 404);
    }
    
    await transactionRepo.delete({id: transaction.id});

  }
}

export default DeleteTransactionService;
