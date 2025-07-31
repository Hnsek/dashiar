
import Papa from "papaparse"


export const parse = (file: File) : Promise<Papa.ParseResult<unknown>> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete:(data) => resolve(data),
            error:(error) => reject(error),
        })
    })
}


export default {
    parse
}