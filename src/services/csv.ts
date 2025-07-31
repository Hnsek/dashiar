
import Papa from "papaparse"

export const parse = (file: File) => {
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