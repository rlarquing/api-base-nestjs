import {DatabaseModule} from "./database/database.module";
import {PersistenceModule} from "./persistence/persistence.module";
import {CoreModule} from "./core/core.module";
import {ApiModule} from "./api/api.module";
import {MailModule} from "./mail/mail.module";
import {DashboardModule} from "./dashboard/dashboard.module";

export const module = [
  DatabaseModule,
  PersistenceModule,
  CoreModule,
  ApiModule,
  MailModule,
  DashboardModule,
];
