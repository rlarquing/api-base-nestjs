import { MigrationInterface, QueryRunner } from "typeorm";

export class creadoNomencladorMenu1667866409247 implements MigrationInterface {
    name = 'creadoNomencladorMenu1667866409247'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu" ADD "nomemclador" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "UQ_ff803fc14e062ad17d2f15862cc" UNIQUE ("nomemclador")`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "UQ_ff803fc14e062ad17d2f15862cc"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP COLUMN "nomemclador"`);
    }

}
