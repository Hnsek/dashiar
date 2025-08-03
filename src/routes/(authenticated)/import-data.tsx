import { Button, FileButton } from '@/components/Buttons'
import csv from '@/services/csv';
import { type Dataset } from '@/types/data';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { RxUpload } from "react-icons/rx";
import {toast,ToastContainer} from "react-toastify"
import lodash from "lodash"
import { DataList } from '@/components/DataValueList';
import { DataType } from '@/types/data-type';
import { convert } from '@/services/data-conversor';
import Loading from '@/components/Loading';
import { FaArrowRight } from "react-icons/fa";
import { FileImport } from '@/components/FileImport';
import { addDoc, collection } from 'firebase/firestore';
import { database } from '@/firebase';

export const Route = createFileRoute('/(authenticated)/import-data')({
  component: RouteComponent,
})

function RouteComponent() {
  const [datasets, setDatasets] = useState<Dataset[]>()
  const [values, setValues] = useState<unknown[][]>()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

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

              
              const transposedValues = lodash.unzip(values)
              const fieldsValues = fields.map((name, index) => ({
                name,
                values: transposedValues[index]
              }))

              const formattedFields = fields.map((name) => ({
                name,
                type: DataType.TEXT
              }))

              setValues(values)

              const lines = values.map((value) => ({columns : value}))

              const data : Dataset = {
                name: files[index].name,
                rootData: rootData.map(data => ({columns:data})),
                fields: formattedFields,
                lines,
                fieldsValues
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
                    onFieldTypeChange={(fieldName : string, type: DataType) => {
                        setDatasets((dataset) => {
                          if(!dataset){
                            return dataset
                          }

                          const index = 0
                          const fieldIndex = dataset[index].fields.findIndex((field) => field.name === fieldName)

                          dataset[index].fields[fieldIndex].type = type

                          let fieldTransposedValues = lodash.unzip(values)[fieldIndex]

                          fieldTransposedValues=fieldTransposedValues.map((value) => convert(value as string, type))

                          dataset[index].fieldsValues[fieldIndex].values = fieldTransposedValues

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
