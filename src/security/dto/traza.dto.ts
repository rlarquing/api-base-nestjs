import {IsDate, IsNotEmpty, IsNumber, IsString} from 'class-validator';
import {HISTORY_ACTION} from "../entity/traza.entity";

export class TrazaDto{

    @IsNumber()
    id: number;

    @IsString()
    user: string;

    @IsDate()
    date: Date;

    @IsString()
    model: string;

    @IsNotEmpty()
    data: object;

    @IsNotEmpty()
    action:HISTORY_ACTION;

    @IsNumber()
    record: number;

    constructor(id: number, user: string, date: Date, model: string, data: object, action: HISTORY_ACTION, record: number) {
        this.id = id;
        this.user = user;
        this.date = date;
        this.model = model;
        this.data = data;
        this.action = action;
        this.record = record;
    }
}
