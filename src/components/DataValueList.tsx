import { DataType } from "@/types/data-type"
import { memo } from "react"

type Props = {
    fields:{
        name:string,
        type:DataType
    }[],
    values:unknown[][],
    onFieldTypeChange?:(field:string, type:DataType, fieldIndex:number) => void
}

export const DataList = (props:Props) => {

    return <div className={`h-full grid border-x-1`}
        style={{ gridTemplateColumns: `repeat(${props.fields.length}, minmax(180px, 1fr))` }}
    >
        {props.fields.map((field, index) => {
            return <header key={index} className="border-b-1 bg-white top-0 min-w-20 flex flex-col items-center p-2">
                <h2 className="text-center px-3 py-4 font-bold">{field.name}</h2>
                <select className="w-fit bg-white rounded p-1 hover:brightness-80 cursor-pointer" onChange={(event)=>{
                    const type = event.target.value as DataType
                    props.onFieldTypeChange?.(field.name,type, index)
                }}>
                    <option value={DataType.TEXT}>Text</option>
                    <option value={DataType.NUMBER}>Number</option>
                    <option value={DataType.DATETIME}>Datetime</option>
                </select>
            </header> 
        })}
        {
            props.values.map((line, lineIndex) => {
                return line.map((value, valueIndex) => {
                    return <DataListValue key={`${lineIndex}-${valueIndex}`} value={new String(value)}/>
                })
            })
        }
    </div>
}

const DataListValue = memo(({value} : {value:string | String}) => {
    return <div className="text-center px-5 py-2 border-b-1">{value}</div>
})