import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSchemas1713360000000 implements MigrationInterface {
  name = 'CreateSchemas1713360000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_auth`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_dpa`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS mod_nomenclator`);
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS public`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA IF EXISTS public CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_nomenclator CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_dpa CASCADE`);
    await queryRunner.query(`DROP SCHEMA IF EXISTS mod_auth CASCADE`);
  }
}
