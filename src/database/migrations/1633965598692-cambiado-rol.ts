import { MigrationInterface, QueryRunner } from 'typeorm';

export class cambiadoRol1633965598692 implements MigrationInterface {
  name = 'cambiadoRol1633965598692';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mod_auth"."rol" ("id" SERIAL NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "nombre" character varying(255) NOT NULL, "descripcion" text NOT NULL, CONSTRAINT "PK_c93a22388638fac311781c7f2dd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mod_auth"."user_roles_rol" ("userId" integer NOT NULL, "rolId" integer NOT NULL, CONSTRAINT "PK_7ffcc7eef4faba39ba9be32b611" PRIMARY KEY ("userId", "rolId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6e0f4bcaffd8c7e456dc470c73" ON "mod_auth"."user_roles_rol" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e022994ce37e6b721a9de12fb6" ON "mod_auth"."user_roles_rol" ("rolId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_rol" ADD CONSTRAINT "FK_6e0f4bcaffd8c7e456dc470c735" FOREIGN KEY ("userId") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_rol" ADD CONSTRAINT "FK_e022994ce37e6b721a9de12fb63" FOREIGN KEY ("rolId") REFERENCES "mod_auth"."rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_rol" DROP CONSTRAINT "FK_e022994ce37e6b721a9de12fb63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_rol" DROP CONSTRAINT "FK_6e0f4bcaffd8c7e456dc470c735"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `DROP INDEX "mod_auth"."IDX_e022994ce37e6b721a9de12fb6"`,
    );
    await queryRunner.query(
      `DROP INDEX "mod_auth"."IDX_6e0f4bcaffd8c7e456dc470c73"`,
    );
    await queryRunner.query(`DROP TABLE "mod_auth"."user_roles_rol"`);
    await queryRunner.query(`DROP TABLE "mod_auth"."rol"`);
  }
}
