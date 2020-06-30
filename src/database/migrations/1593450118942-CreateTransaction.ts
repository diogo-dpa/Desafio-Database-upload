import {MigrationInterface, QueryRunner, Table} from "typeorm";

export default class CreateTransaction1593450118942 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // cria-se uma tabela
        await queryRunner.createTable(
            new Table({
                name: 'transactions', // nome da tabela
                columns: [
                    {                          // Coluna ID
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {                          // Coluna title
                        name: 'title',
                        type: 'varchar',
                    },
                    {                          // Coluna value
                        name: 'value',
                        type: 'decimal',
                        precision: 10,
                        scale: 2,
                    },
                    {                          // Coluna type
                        name: 'type',
                        type: 'varchar',
                    },
                    {                          // Coluna category_id
                        name: 'category_id',
                        type: 'uuid',
                        isNullable: true,
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        //Deleta a tabela
        await queryRunner.dropTable('transactions');
    }

}
