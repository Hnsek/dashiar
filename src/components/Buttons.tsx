import { useRef, type ButtonHTMLAttributes, type ChangeEvent, type ReactNode } from "react"

type FileButtonProps = {
    text?:string,
    onChange?: (event: ChangeEvent<HTMLInputElement>)  => void,
    icon?: ReactNode,
    acceptedFiles?:string[],
    multiple?:boolean
}

export const FileButton = (props:FileButtonProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    return <>
        <button className="flex items-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80" onClick={() =>  inputRef.current?.click()}>
            <p>{props.text}</p>
            {props.icon}
        </button>
        <input ref={inputRef} 
            type="file" 
            className="absolute hidden" 
            onChange={(event) => props.onChange?.(event)} 
            accept={props.acceptedFiles?.join(",")}
            multiple={props.multiple}
            />
    </>
}

type ButtonProps = {
    text?:string,
    icon?: ReactNode,
} & ButtonHTMLAttributes<HTMLButtonElement>

export const Button = (props: ButtonProps) => {
    const { text, icon, ...buttonProps} = props
     return <button className="flex items-center gap-1 bg-[var(--primary)] rounded text-[var(--text)] p-3 cursor-pointer hover:brightness-80"
        {...buttonProps}
     >
        <p>{props.text}</p>
        {props.icon}
    </button>
}