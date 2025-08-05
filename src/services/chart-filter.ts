import { ChartFilterType } from "@/types/data-type"

const operations = {
    [ChartFilterType.MORETHAN]:(data : number[], value : number) => data.filter((compareValue) => compareValue > value),
    [ChartFilterType.LESSTHAN]:(data : number[], value : number) => data.filter((compareValue) => compareValue < value),
    [ChartFilterType.EQUAL]:(data : number[], value : number) => data.filter((compareValue) => compareValue == value),
}

export const filter = (operation:ChartFilterType, data : number[],  value : number) => {
    return operations[operation](data,value)
}