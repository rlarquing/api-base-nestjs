import {MigrationInterface, QueryRunner} from "typeorm";

export class seguridadApliada1637511797826 implements MigrationInterface {
    name = 'seguridadApliada1637511797826'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" DROP CONSTRAINT "FK_59b3802b62d799dd301f1929c54"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_6e0f4bcaffd8c7e456dc470c735"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_e022994ce37e6b721a9de12fb63"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_6e0f4bcaffd8c7e456dc470c73"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_e022994ce37e6b721a9de12fb6"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" RENAME COLUMN "user" TO "user_id"`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."grupo" ("id" SERIAL NOT NULL, "activo" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "nombre" character varying(255) NOT NULL, "descripcion" text NOT NULL, CONSTRAINT "UQ_46328b39b3ace503a0968d5fc02" UNIQUE ("nombre"), CONSTRAINT "UQ_46328b39b3ace503a0968d5fc02" UNIQUE ("nombre"), CONSTRAINT "PK_dc8777104b615fea76db518334f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."permiso" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "servicio" character varying NOT NULL, "tipo_alerta_id" integer, CONSTRAINT "PK_8f675309c577bd8f4d826994e95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."entidad" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "schema" character varying NOT NULL, CONSTRAINT "PK_e8e966b92be9a461aed484bb30b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mod_auth"."grupo_rol" ("grupo_id" integer NOT NULL, "rol_id" integer NOT NULL, CONSTRAINT "PK_b9150deeecd1ee1f9ee5174e3da" PRIMARY KEY ("grupo_id", "rol_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_850729ea7faaced36154ec1c0a" ON "mod_auth"."grupo_rol" ("grupo_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3d62028a41a96f123ee374156" ON "mod_auth"."grupo_rol" ("rol_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."grupo_permiso" ("grupo_id" integer NOT NULL, "permiso_id" integer NOT NULL, CONSTRAINT "PK_49a907a2f3ab03f0274a2222b8d" PRIMARY KEY ("grupo_id", "permiso_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_373f45f615c3551a5b5c337f54" ON "mod_auth"."grupo_permiso" ("grupo_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_582bf600fe26958c1df6478681" ON "mod_auth"."grupo_permiso" ("permiso_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."rol_permiso" ("rol_id" integer NOT NULL, "permiso_id" integer NOT NULL, CONSTRAINT "PK_256c1f4f9321263545469f2aff0" PRIMARY KEY ("rol_id", "permiso_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c59b6b0fee02257a3e1ca75c47" ON "mod_auth"."rol_permiso" ("rol_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3c476728351cd2f8f875ceb32e" ON "mod_auth"."rol_permiso" ("permiso_id") `);
        await queryRunner.query(`CREATE TABLE "mod_auth"."user_permiso" ("user_id" integer NOT NULL, "permiso_id" integer NOT NULL, CONSTRAINT "PK_3bf4900288439b1e9470592338c" PRIMARY KEY ("user_id", "permiso_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ddc162bf47606d0c54ab2508e1" ON "mod_auth"."user_permiso" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_316431d4186ebd06d35b2e61f3" ON "mod_auth"."user_permiso" ("permiso_id") `);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol" ADD CONSTRAINT "UQ_9792c580a992d554ee1621c5b45" UNIQUE ("nombre")`);
        await queryRunner.query(`CREATE INDEX "IDX_46dc4d18f715459d7bf682d32b" ON "mod_auth"."user_rol" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e959bd66b9f5a8c77de4fd589e" ON "mod_auth"."user_rol" ("rol_id") `);
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" ADD CONSTRAINT "FK_9837570ff30d7a7326dc3cb2a59" FOREIGN KEY ("tipo_alerta_id") REFERENCES "mod_auth"."entidad"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" ADD CONSTRAINT "FK_007b58c37691032e6366f27de7c" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_rol" ADD CONSTRAINT "FK_850729ea7faaced36154ec1c0ab" FOREIGN KEY ("grupo_id") REFERENCES "mod_auth"."grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_rol" ADD CONSTRAINT "FK_b3d62028a41a96f123ee3741563" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_permiso" ADD CONSTRAINT "FK_373f45f615c3551a5b5c337f54c" FOREIGN KEY ("grupo_id") REFERENCES "mod_auth"."grupo"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_permiso" ADD CONSTRAINT "FK_582bf600fe26958c1df64786815" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_permiso" ADD CONSTRAINT "FK_c59b6b0fee02257a3e1ca75c47b" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_permiso" ADD CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_46dc4d18f715459d7bf682d32b9" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_e959bd66b9f5a8c77de4fd589eb" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_permiso" ADD CONSTRAINT "FK_ddc162bf47606d0c54ab2508e1c" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_permiso" ADD CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d" FOREIGN KEY ("permiso_id") REFERENCES "mod_auth"."permiso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_permiso" DROP CONSTRAINT "FK_316431d4186ebd06d35b2e61f3d"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_permiso" DROP CONSTRAINT "FK_ddc162bf47606d0c54ab2508e1c"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_e959bd66b9f5a8c77de4fd589eb"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" DROP CONSTRAINT "FK_46dc4d18f715459d7bf682d32b9"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_permiso" DROP CONSTRAINT "FK_3c476728351cd2f8f875ceb32ee"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol_permiso" DROP CONSTRAINT "FK_c59b6b0fee02257a3e1ca75c47b"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_permiso" DROP CONSTRAINT "FK_582bf600fe26958c1df64786815"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_permiso" DROP CONSTRAINT "FK_373f45f615c3551a5b5c337f54c"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_rol" DROP CONSTRAINT "FK_b3d62028a41a96f123ee3741563"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."grupo_rol" DROP CONSTRAINT "FK_850729ea7faaced36154ec1c0ab"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" DROP CONSTRAINT "FK_007b58c37691032e6366f27de7c"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."permiso" DROP CONSTRAINT "FK_9837570ff30d7a7326dc3cb2a59"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_e959bd66b9f5a8c77de4fd589e"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_46dc4d18f715459d7bf682d32b"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."rol" DROP CONSTRAINT "UQ_9792c580a992d554ee1621c5b45"`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."municipio" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`ALTER TABLE "mod_dpa"."provincia" ALTER COLUMN "geom" TYPE geometry(GEOMETRY,0)`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_316431d4186ebd06d35b2e61f3"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_ddc162bf47606d0c54ab2508e1"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."user_permiso"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_3c476728351cd2f8f875ceb32e"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_c59b6b0fee02257a3e1ca75c47"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."rol_permiso"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_582bf600fe26958c1df6478681"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_373f45f615c3551a5b5c337f54"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."grupo_permiso"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_b3d62028a41a96f123ee374156"`);
        await queryRunner.query(`DROP INDEX "mod_auth"."IDX_850729ea7faaced36154ec1c0a"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."grupo_rol"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."entidad"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."permiso"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."grupo"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" RENAME COLUMN "user_id" TO "user"`);
        await queryRunner.query(`CREATE INDEX "IDX_e022994ce37e6b721a9de12fb6" ON "mod_auth"."user_rol" ("rol_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_6e0f4bcaffd8c7e456dc470c73" ON "mod_auth"."user_rol" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_e022994ce37e6b721a9de12fb63" FOREIGN KEY ("rol_id") REFERENCES "mod_auth"."rol"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user_rol" ADD CONSTRAINT "FK_6e0f4bcaffd8c7e456dc470c735" FOREIGN KEY ("user_id") REFERENCES "mod_auth"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" ADD CONSTRAINT "FK_59b3802b62d799dd301f1929c54" FOREIGN KEY ("user") REFERENCES "mod_auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
