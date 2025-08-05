import { database } from "@/firebase"
import { type Dashboard } from "@/types/data"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { useEffect, useRef, useState } from "react"

export const useDashboard = (id: string | undefined) => {
    const [data, setData] = useState<Dashboard>()
    const [fieldNames, setFieldNames] = useState<string[]>([])

    const docRef = useRef(doc(database, "dashboards", id!))

    useEffect(() => {
        if(id){

            onSnapshot(docRef.current, (doc) => {
            
                
                if(doc.exists()){
                    const dashboard  = {
                        id:doc.id,
                        ...doc.data()
                    } as Dashboard
                    
                    const fieldNames = dashboard.datasets[0].fields.map((field) => field.name)

                    setData(dashboard)
                    setFieldNames(fieldNames)
                    }
            
                  })
        }
    }, [])

    return {
        data,
        setData: (data : Dashboard) => {
            updateDoc(docRef.current,data)
            setData(data)
        },
        fieldNames
    }
}