import {MigrationInterface, QueryRunner} from "typeorm";

export class dpa1619562103788 implements MigrationInterface {
    name = 'dpa1619562103788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mod_dpa"."provincia" ("id" SERIAL NOT NULL, "nombre" text NOT NULL, "codigo" character varying(2) NOT NULL, "geom" geometry, "nombre_corto" text NOT NULL, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_1ade30cd3eae6a2a6d6ae25203a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_dpa"."municipio" ("id" SERIAL NOT NULL, "nombre" character varying(255) NOT NULL, "codigo" character varying(4) NOT NULL, "geom" geometry, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "provinciaId" integer, CONSTRAINT "PK_f0a4fc7e027921fd448f9f075e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ADD CONSTRAINT "FK_7a5e829ee4d214fb5d1f2835352" FOREIGN KEY ("provinciaId") REFERENCES "mod_dpa"."provincia"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" DROP CONSTRAINT "FK_7a5e829ee4d214fb5d1f2835352"`);
        await queryRunner.query(`DROP TABLE "mod_dpa"."municipio"`);
        await queryRunner.query(`DROP TABLE "mod_dpa"."provincia"`);
    }

}
