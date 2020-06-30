import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // retorna todas as transações
    const transactions = await this.find();

    // realiza as operações de soma do income, outcome e a operação de total
    const income = transactions.reduce((acum, current) => current.type == 'income'? acum+ Number(current.value) : acum , 0 );

    const outcome = transactions.reduce((acum, current) => current.type == 'outcome'? acum + Number(current.value) : acum , 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

}

export default TransactionsRepository;
