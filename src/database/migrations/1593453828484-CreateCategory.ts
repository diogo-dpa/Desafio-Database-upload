import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export default class CreateCategory1593453828484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // cria-se uma tabela
        await queryRunner.createTable(
            new Table({
                name: 'categories', // nome da tabela
                columns: [
                    {                          // Coluna ID
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {                          // Coluna title
                        name: 'title',
                        type: 'varchar',
                    },
                    {                          // Coluna Created_at
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {                          // Coluna Updated_at
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    }
                ]
            })
        )

        // Cria chave estrangeira
		await queryRunner.createForeignKey(
            'transactions', 
            new TableForeignKey({
                name: 'TransactionCategory', // nome da ForeignKey
                columnNames: ['category_id'], // qual é a coluna que vai receber a chave estrangeira
                referencedColumnNames: ['id'], // qual é a coluna na tabela usuário que vai representar o provider_id
                referencedTableName: 'categories', // nome da tabela que vai fazer referência com esse campo
                onDelete: 'SET NULL', // para o efeito de deletar
                onUpdate: 'CASCADE',
		}));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Deletará essa a chave estrangeira
        await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
        
        //Deleta a tabela
        await queryRunner.dropTable('categories');
    }

}
