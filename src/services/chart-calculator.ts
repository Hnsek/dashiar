import { ChartOperation } from "@/types/data-type";

const operations = {
    [ChartOperation.SUM] : (data:unknown[]) => {
        const values = data as number[]
        return values.reduce((previousValue : number, currentValue:number) => previousValue + currentValue)
    },
    [ChartOperation.AVERAGE] : (data:unknown[]) => {
        const values = data as number[]

        const sum = values.reduce((previousValue : number, currentValue:number) => previousValue + currentValue)
        return sum / data.length
    },
    [ChartOperation.COUNT] : (data:unknown[]) => {
        
        return data.length
    },
}

export const calculate = (operation : ChartOperation, values:unknown[]) => operations[operation](values)