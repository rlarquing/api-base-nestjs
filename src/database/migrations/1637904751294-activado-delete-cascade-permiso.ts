import { MigrationInterface, QueryRunner } from 'typeorm';

export class activadoDeleteCascadePermiso1637904751294
  implements MigrationInterface
{
  name = 'activadoDeleteCascadePermiso1637904751294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."rol_permiso" DROP CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_permiso" DROP CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."rol_permiso" ADD CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_permiso" ADD CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_permiso" DROP CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."rol_permiso" DROP CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."user_permiso" ADD CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mod_auth"."rol_permiso" ADD CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
