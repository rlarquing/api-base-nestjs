export declare const env: (name: string, default_value?: any) => any;
export declare const config: () => {
    port: number;
    cors: any;
    logger: any;
    database: {
        ssl: any;
        type: any;
        host: any;
        port: number;
        username: any;
        password: any;
        database: any;
        synchronize: any;
        migrationsRun: any;
    };
    loggerLevels: any;
};
export declare const dataSource: () => any;
