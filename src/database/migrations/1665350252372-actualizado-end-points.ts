import { MigrationInterface, QueryRunner } from "typeorm";

export class actualizadoEndPoints1665350252372 implements MigrationInterface {
    name = 'actualizadoEndPoints1665350252372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_a1d991de75805208749c0407ee5"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_a1d991de75805208749c0407ee5" FOREIGN KEY ("end_point_id") REFERENCES "mod_auth"."end_point"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_a1d991de75805208749c0407ee5"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_a1d991de75805208749c0407ee5" FOREIGN KEY ("end_point_id") REFERENCES "mod_auth"."end_point"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
