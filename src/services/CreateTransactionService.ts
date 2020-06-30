import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import {getCustomRepository, getRepository} from 'typeorm';
import Category from '../models/Category'
import TransactionRepository from '../repositories/TransactionsRepository'

interface Request{
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({title, value, type, category}: Request): Promise<Transaction> {
    // TODO

    const transactionRepository = getCustomRepository(TransactionRepository);

    const { total } = await transactionRepository.getBalance();

    if(type === 'outcome' && value > total ){
      throw new AppError('Error', 400)
    }

    const categoryRepository = getRepository(Category);

    // verifico se há o mesmo título na categoria 
    let checkCategoryTitle = await categoryRepository.findOne({
      where: {title: category}
    })


    // caso não exista uma categoria
    if(!checkCategoryTitle){
        // se cria uma
        checkCategoryTitle = categoryRepository.create({
        title: category,
      })
    }
    
      await categoryRepository.save(checkCategoryTitle);
      
      const transaction = transactionRepository.create({
        title: title,
        value: value,
        type: type,
        category: checkCategoryTitle,
        category_id: checkCategoryTitle.id,
      });
      

      // salvo a transação
      await transactionRepository.save(transaction);

      return transaction;
  }
}

export default CreateTransactionService;
