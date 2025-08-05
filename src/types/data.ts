import type { ChartFilterType, ChartOperation, ChartType, DataType } from "./data-type"

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

export type ChartFilter = {
    type: ChartFilterType,
    value:number
}

export type ChartField = {
    name: string,
    type:ChartOperation,
    key:string,
    color:string,
    value: unknown,
    filters:ChartFilter[],
    dataset:number[]
}


export type Chart = {
    x:number,
    y:number,
    width: number,
    height:number,
    type:ChartType
    fields:ChartField[],
}

type Time = { seconds: number, nanoseconds: number }

export type Dashboard = {
    id:string
    datasets:Dataset[],
    name:string,
    createdBy:string;
    createdByEmail:string;
    updatedBy:string;
    updatedByEmail:string;
    createdAt: Time;
    updatedAt: Time;
    charts:Chart[]
} 