import type { InputHTMLAttributes } from "react"
import type React from "react"

type InputProps = {
    icon?: React.ReactNode,
    label?:string,
    error?:string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = (props: InputProps) => {
    const { icon, label, error, ...inputProps} = props
    return <div>
        {
            label ?
                <label>{label}</label>
                :
                undefined    
        }
        <div className="flex rounded border"
            style={{
                borderColor: props.error ? "#F00" : "#000",
            }}
        >
            <input {...inputProps}/>
            { icon }
        </div>
        {props.error?
            <p className="text-red-500">{props.error}</p>
            :
            undefined
        }
    </div>
}