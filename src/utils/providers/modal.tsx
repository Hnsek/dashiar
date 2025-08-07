import {createContext, useContext, useState, type ReactNode} from "react"


const GlobalContext = createContext<{
    show:(componente : ReactNode) => void,
    hide: () => void
}>({
    show() {},
    hide() {},
})

export const ModalProvider = ({children} : {children : ReactNode}) => {
    const [component, setComponent] = useState<ReactNode>()
    
    const show = (component : ReactNode) => {
        setComponent(() => component)
    }
    const hide = () => setComponent(undefined)

    return <GlobalContext.Provider value={{ show, hide }}>
        {children}
        {component ? 
            <div className="z-99999 w-full h-screen fixed top-0 left-0 flex items-center justify-center">
                <button 
                    onMouseDown={() => hide()} 
                    className="w-full h-screen bg-black opacity-80  absolute"
                
                ></button>
                <div 
                    className="flex items-center justify-center z-50 bg-red-500">
                    {component}
                </div>


            </div>
            :
            undefined
        }
    </GlobalContext.Provider>
} 

export const useModal = () => useContext(GlobalContext)