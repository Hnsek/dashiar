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
    lines:{
        columns:unknown[]
    }[],
    fieldsValues:DataValue[]

}

export type Chart = {

}

export type Dashboard = {
    datasets:Dataset[]
    charts:Chart[]
} 