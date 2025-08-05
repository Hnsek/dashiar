import { useEffect } from "react"

export const useUpdateEffect = (executor : () => unknown, params: unknown[]) => {
    let initialized = false

    useEffect(() => {
        if(!initialized){
            initialized = true
            return
        }
        executor()
    }, params)
}