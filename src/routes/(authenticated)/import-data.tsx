import { Button, FileButton } from '@/components/Buttons'
import csv from '@/services/csv';
import { type Dataset } from '@/types/data';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { RxUpload } from "react-icons/rx";
import {toast,ToastContainer} from "react-toastify"
import { DataList } from '@/components/DataValueList';
import { DataType } from '@/types/data-type';
import { convert } from '@/services/data-conversor';
import Loading from '@/components/Loading';
import { FaArrowRight } from "react-icons/fa";
import { FileImport } from '@/components/FileImport';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/config/firebase';
import { useAuth } from '@/utils/providers/auth-provider';

export const Route = createFileRoute('/(authenticated)/import-data')({
  component: RouteComponent,
})

function RouteComponent() {
  const [datasets, setDatasets] = useState<Dataset[]>()
  const [values, setValues] = useState<unknown[][]>()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const auth = useAuth()

  const onChoose = ( files : File[]) => {
    if(!files){
      toast.error("No file imported")
      return 
    }

    const requests = files.map((file: File) => csv.parse(file))

    setLoading(true)

    Promise.all(requests)
        .then((result) => {
            const filesData = result.map((value) => value.data)
        
            const newData = filesData.map((rootData, index) => {
              const [fields, ...values]  = rootData as [string[], unknown[]]

              const formattedFields = fields.map((name) => ({
                name,
                type: DataType.TEXT
              }))

              setValues(values)

              const lines = values.map((value) => ({columns : value}))

              const data : Dataset = {
                name: files[index].name,
                fields: formattedFields,
                lines
              }
              
              setLoading(false)

              return data
          })

          setDatasets(newData)
        })
        .catch((error) => {
          console.error(error)
          toast.error("The file cannot be imported")
        })
  } 

  if(!datasets){
    return <main className='flex flex-col h-screen bg-[var(--background)] w-full justify-center items-center'>
        <FileImport
          onChoose={(files) => onChoose(files)}
        />
      </main>
    }

  return <main className='flex flex-col h-screen bg-[var(--background)] w-full'>
    

      <header className='flex justify-between p-2 py-3 shadow w-full'>
          <FileButton
            text='Upload CSV'
            icon={<RxUpload/>}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if(event.target.files){
                onChoose(Array.from(event.target.files))
              }
            }}
          />
          {
            datasets ?
              <Button
                text="Next"
                onClick={() => {
                  addDoc(collection(database, "dashboards"), {
                    datasets,
                    createdBy: auth.user?.uid,
                    createdByEmail: auth.user?.email,
                    createdAt:new Date(),
                    updatedBy: auth.user?.uid,
                    updatedByEmail: auth.user?.email,
                    updatedAt: new Date(),  
                    name:"Dashboard",
                    charts:[]
                  })
                  .then((result) => {
                    navigate({
                      to:"/dashboard",
                      search:{
                        id:result.id
                      }
                    })
                  })
                  .catch((error) => {
                    console.error(error)
                    toast.error("Data can't be saved")
                  })
                }}
                icon={<FaArrowRight />}
              />
              :
              undefined
          }
      </header>
      {
        loading ?
          <div className='w-full flex-1 flex justify-center items-center'>
            <Loading/>
          </div>
          :
          <main className='flex overflow-auto flex-1'>
              {/* TODO: refact to multiple files */}
              {datasets && values ? 
                <div className='h-fit'>
                  <DataList
                    fields={datasets[0]?.fields}
                    values={values}
                    onFieldTypeChange={(_, type: DataType, fieldIndex:number) => {
                        setDatasets((dataset) => {
                          if(!dataset){
                            return dataset
                          }

                          const index = 0
                          
                          dataset[index].fields[fieldIndex].type = type

                          dataset[index].lines.map((line) => {
                            line.columns[fieldIndex] = convert(line.columns[fieldIndex] as string, type) 
                          })
                          

                          return [...dataset]
                        })
                    }}
                  />
                </div>
                :
                undefined
            }
          </main>
      }
      <ToastContainer/>
  </main>
}
