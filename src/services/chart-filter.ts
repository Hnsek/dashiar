import type { Dataset } from "@/types/data"
import { ChartFilterType } from "@/types/data-type"

const operations = {
    [ChartFilterType.MORETHAN]:(dataset : Dataset, value : number, comparableColumnIndex: number, resultColumnIndex : number) => {
        return dataset.lines
            .filter((line) => line.columns[comparableColumnIndex] as number  > value)
            .map((result) => result.columns[resultColumnIndex])
    },
    [ChartFilterType.LESSTHAN]:(dataset : Dataset, value : number, comparableColumnIndex: number, resultColumnIndex : number) => {
        return dataset.lines
            .filter((line) => line.columns[comparableColumnIndex] as number  < value)
            .map((result) => result.columns[resultColumnIndex])
    },
    [ChartFilterType.EQUAL]:(dataset : Dataset, value : number, comparableColumnIndex: number, resultColumnIndex : number) => {
        return dataset.lines
            .filter((line) => line.columns[comparableColumnIndex] as number  == value)
            .map((result) => result.columns[resultColumnIndex])
    },
}

export const filter = (operation:ChartFilterType, dataset : Dataset,  value : number, comparableColumnIndex: number, resultColumnIndex : number) => {
    return operations[operation](dataset,value, comparableColumnIndex, resultColumnIndex)
}