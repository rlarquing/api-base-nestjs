import {MigrationInterface, QueryRunner} from "typeorm";

export class renombramientoEntidadModelo1637528318067 implements MigrationInterface {
    name = 'renombramientoEntidadModelo1637528318067'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" DROP CONSTRAINT "FK_6562debbf9208143434319328a2"`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."modelo" ("id" SERIAL NOT NULL, "nombre" character varying NOT NULL, "schema" character varying NOT NULL, CONSTRAINT "PK_4d5d3a7d7efe7e5f03944aa15d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" ADD CONSTRAINT "FK_6562debbf9208143434319328a2" FOREIGN KEY ("modelo_id") REFERENCES "mod_auth"."modelo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" DROP CONSTRAINT "FK_6562debbf9208143434319328a2"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`DROP TABLE "mod_auth"."modelo"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" ADD CONSTRAINT "FK_6562debbf9208143434319328a2" FOREIGN KEY ("modelo_id") REFERENCES "mod_auth"."entidad"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
