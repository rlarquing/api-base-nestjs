import {MigrationInterface, QueryRunner} from "typeorm";

export class traza1619011004257 implements MigrationInterface {
    name = 'traza1619011004257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mod_auth"."traza" ("id" SERIAL NOT NULL, "date" TIMESTAMP DEFAULT now(), "model" character varying NOT NULL, "data" jsonb, "action" character varying NOT NULL, "record" integer, "user" integer, CONSTRAINT "PK_43e196a3ce37e805a706bf6c544" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" ADD CONSTRAINT "FK_eb9cea016458c8ed6b5624674f6" FOREIGN KEY ("user") REFERENCES "mod_auth"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mod_auth"."traza" DROP CONSTRAINT "FK_eb9cea016458c8ed6b5624674f6"`);
        await queryRunner.query(`DROP TABLE "mod_auth"."traza"`);
    }

}
