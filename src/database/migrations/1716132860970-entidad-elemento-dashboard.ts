import { MigrationInterface, QueryRunner } from "typeorm";

export class EntidadElementoDashboard1716132860970 implements MigrationInterface {
    name = 'EntidadElementoDashboard1716132860970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "elemento_dashboard" ("id" BIGSERIAL NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "nombre" character varying(255) NOT NULL, "tipo" character varying(255) NOT NULL, "capa" jsonb, "consulta" jsonb, CONSTRAINT "PK_71dd8251693fdd57c42536562c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_237a0fe43278378e9c5729d17af"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" DROP CONSTRAINT "FK_081bb94cc56736d4d76a6e66d98"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "menu_id_seq" OWNED BY "menu"."id"`);
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "id" SET DEFAULT nextval('"menu_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" DROP CONSTRAINT "FK_171ab157447420f1284a8a45d65"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" DROP CONSTRAINT "FK_273f59cc606dc3d818235f08796"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "mod_auth"."funcion_id_seq" OWNED BY "mod_auth"."funcion"."id"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" ALTER COLUMN "id" SET DEFAULT nextval('"mod_auth"."funcion_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_237a0fe43278378e9c5729d17af" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" ADD CONSTRAINT "FK_081bb94cc56736d4d76a6e66d98" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" ADD CONSTRAINT "FK_171ab157447420f1284a8a45d65" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" ADD CONSTRAINT "FK_273f59cc606dc3d818235f08796" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" DROP CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" DROP CONSTRAINT "FK_273f59cc606dc3d818235f08796"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" DROP CONSTRAINT "FK_171ab157447420f1284a8a45d65"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" DROP CONSTRAINT "FK_081bb94cc56736d4d76a6e66d98"`);
        await queryRunner.query(`ALTER TABLE "menu" DROP CONSTRAINT "FK_237a0fe43278378e9c5729d17af"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "centroide" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "mod_auth"."funcion_id_seq"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion_end_point" ADD CONSTRAINT "FK_8d632ce50f972ad8f58ea565c74" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_funcion" ADD CONSTRAINT "FK_273f59cc606dc3d818235f08796" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_funcion" ADD CONSTRAINT "FK_171ab157447420f1284a8a45d65" FOREIGN KEY ("funcion_id") REFERENCES "mod_auth"."funcion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "menu_id_seq"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."funcion" ADD CONSTRAINT "FK_081bb94cc56736d4d76a6e66d98" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu" ADD CONSTRAINT "FK_237a0fe43278378e9c5729d17af" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`DROP TABLE "elemento_dashboard"`);
    }

}
