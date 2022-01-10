import { MigrationInterface, QueryRunner } from 'typeorm';

export class cambiadoStatusActivo1630673745240 implements MigrationInterface {
  name = 'cambiadoStatusActivo1630673745240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" RENAME COLUMN "status" TO "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" RENAME COLUMN "status" TO "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" DROP COLUMN "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" ADD "activo" boolean NOT NULL DEFAULT true`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" DROP COLUMN "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" ADD "activo" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" DROP COLUMN "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" ADD "activo" character varying(8) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" DROP COLUMN "activo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" ADD "activo" character varying(8) NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."roles" RENAME COLUMN "activo" TO "status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user" RENAME COLUMN "activo" TO "status"`,
    );
  }
}
