import { useState } from "react"

let timeout : NodeJS.Timeout

type Props = {
    value?:string;
    onChange?:(value : string ) => void
}
export const DashboardTitle = (props : Props) => {
    const [value, setValue] = useState(props.value || "")

    return <input className='text-3xl font-bold w-fit text-center' value={value} onChange={(event) => {
            const value = event.target.value
        
            clearTimeout(timeout)

            timeout = setTimeout(() => {
                props.onChange?.(value)
            },1500)

            setValue(value)
          }}/>
}