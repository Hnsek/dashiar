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
    x:number,
    y:number,
    width: number,
    height:number,
}

export type Dashboard = {
    id:string
    datasets:Dataset[]
    charts:Chart[]
} 