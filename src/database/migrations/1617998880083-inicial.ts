import { MigrationInterface, QueryRunner } from 'typeorm';

export class inicial1617998880083 implements MigrationInterface {
  name = 'inicial1617998880083';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mod_auth"."user" ("id" SERIAL NOT NULL, "username" character varying(25) NOT NULL, "email" character varying, "password" character varying NOT NULL, "salt" character varying, "status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8daebdc62af64591c0e08748b1f" UNIQUE ("username"), CONSTRAINT "UQ_8daebdc62af64591c0e08748b1f" UNIQUE ("username"), CONSTRAINT "PK_442f75a9c46f6389c5776bf4ecc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mod_auth"."roles" ("id" SERIAL NOT NULL, "nombre" character varying(20) NOT NULL, "descripcion" text NOT NULL, "status" character varying(8) NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), CONSTRAINT "PK_dd81aaa0fdfeafe900262ef9688" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mod_auth"."user_roles_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "PK_91147f87f65ac1b3d73d8445595" PRIMARY KEY ("userId", "rolesId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4922035489f445e0012c6e87c" ON "mod_auth"."user_roles_roles" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4a3de786a5b914008ee3eb0fb3" ON "mod_auth"."user_roles_roles" ("rolesId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_roles" ADD CONSTRAINT "FK_c4922035489f445e0012c6e87c1" FOREIGN KEY ("userId") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_roles" ADD CONSTRAINT "FK_4a3de786a5b914008ee3eb0fb33" FOREIGN KEY ("rolesId") REFERENCES "mod_auth"."roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_roles" DROP CONSTRAINT "FK_4a3de786a5b914008ee3eb0fb33"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_roles_roles" DROP CONSTRAINT "FK_c4922035489f445e0012c6e87c1"`,
    );
    await queryRunner.query(
      `DROP INDEX "mod_auth"."IDX_4a3de786a5b914008ee3eb0fb3"`,
    );
    await queryRunner.query(
      `DROP INDEX "mod_auth"."IDX_c4922035489f445e0012c6e87c"`,
    );
    await queryRunner.query(`DROP TABLE "mod_auth"."user_roles_roles"`);
    await queryRunner.query(`DROP TABLE "mod_auth"."roles"`);
    await queryRunner.query(`DROP TABLE "mod_auth"."user"`);
  }
}
