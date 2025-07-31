import type { DataType } from "./data-type"

export type DataValue = {
    name:string,
    values:unknown[]
}

export type Dataset = {
    name:string,
    rootData: unknown[],
    fields:{
        name:string,
        type:DataType
    }[],
    values:unknown[][],
    fieldsValues:DataValue[]

}