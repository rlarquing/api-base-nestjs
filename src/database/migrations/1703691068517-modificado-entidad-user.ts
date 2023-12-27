import { MigrationInterface, QueryRunner } from "typeorm";

export class ModificadoEntidadUser1703691068517 implements MigrationInterface {
    name = 'ModificadoEntidadUser1703691068517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "username"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "refreshtoken"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "refreshtokenexp"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "user_name" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "UQ_d34106f8ec1ebaf66f4f8609dd6" UNIQUE ("user_name")`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "refresh_token_exp" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "refresh_token_exp"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "refresh_token"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP CONSTRAINT "UQ_d34106f8ec1ebaf66f4f8609dd6"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" DROP COLUMN "user_name"`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "refreshtokenexp" date`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "refreshtoken" character varying`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD "username" character varying(25) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."user" ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username")`);
    }

}
