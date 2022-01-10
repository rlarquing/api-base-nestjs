import { MigrationInterface, QueryRunner } from 'typeorm';

export class seguridadPermisos1637770791579 implements MigrationInterface {
  name = 'seguridadPermisos1637770791579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."permiso" DROP CONSTRAINT "FK_6562debbf9208143434319328a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."permiso" DROP COLUMN "modelo_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."permiso" ADD "modelo_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."permiso" ADD CONSTRAINT "FK_6562debbf9208143434319328a2" FOREIGN KEY ("modelo_id") REFERENCES "mod_auth"."modelo"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
