import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

import csvParse from 'csv-parse';

import {getCustomRepository, getRepository, In} from 'typeorm';

import fs from 'fs';

interface CSVTransaction{
  title: string;
  type: 'income'|'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {

    const categoriesRepository = getRepository(Category);

    const transactionsRepository = getCustomRepository(TransactionRepository);
    
    const data = fs.createReadStream(path,'utf8');

    const parsers = csvParse({
      from_line: 2, // a partir da linha 2
    });

    // conforme a linha estiver disponível, será lido
    const parseCSV = data.pipe(parsers);

    // estratégia book insert, para somente abrir a conexão com o banco de dados 1 vez
    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim() );
      
      
      if( !title || !type || !value ) return;
  
      categories.push(category);
      transactions.push({ title, type, value, category });


    });

    // quando o parseCSv acabar
    await new Promise(resolve => parseCSV.on('end', resolve))
    
    const existenctCategories = await categoriesRepository.find({
        where: {
          title: In(categories),
        },
    })

    const existentCategoriesTitles = existenctCategories.map( (category: Category) => category.title )

    const addCategoryTitles = categories.filter( category => !existentCategoriesTitles.includes(category))
                                        .filter((value, index, self) => self.indexOf(value) == index); // não terá mais duplicatas

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      }),
    ));

    await categoriesRepository.save(newCategories);

    const finalCategories = [ ...newCategories, ...existenctCategories ];
    
    const createdTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(
            category => category.title === transaction.category,
          ),
        }
      )),
    );

    await transactionsRepository.save(createdTransactions);

    // excluir o arquivo depois de usar
    await fs.promises.unlink(path);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
