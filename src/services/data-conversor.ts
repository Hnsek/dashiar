import { DataType } from "@/types/data-type";
import parse  from "number-parsing"
import dateParser from 'any-date-parser';

const options = {
    [DataType.NUMBER]:(value : string | number) => parse(value),
    [DataType.DATETIME]:(value:string) => dateParser.fromString(value),
    [DataType.TEXT]:(value:string) => value
}

export const convert = (value: string, type:DataType) => {
    const convertFunction = options[type] || options[DataType.TEXT]
    return convertFunction(value)
}