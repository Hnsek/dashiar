import { Button, FileButton } from '@/components/Buttons'
import { createFileRoute } from '@tanstack/react-router'
import { useState, type DragEvent } from 'react'
import { CiSearch, CiTrash } from "react-icons/ci";
import { IoDocument } from "react-icons/io5";
import csv from '@/services/csv';
import { FaArrowRight } from "react-icons/fa6";
import {TailSpin} from "react-loading-icons"
import Loading from '@/components/Loading';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {

  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDragOver = (event : DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }
  
  const onDragLeave = (event : DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const onDrop = (event : DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    
    setIsDragging(false)

    const file = event.dataTransfer.files.item(0)

    if(file){
      setFiles([file])
    }
    
    // setFiles(event.dataTransfer.files)
  }
  
  const onChoose = ( event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if(file){
      setFiles([file])
    }
  }

  const onNext = () => {
      const requests = files.map((file: File) => {
          return csv.parse(file)
      })

      setLoading(true)

      Promise.all(requests)
        .then((result) => console.warn("result: ", result))
  }

  if(loading){
    return (
      <main className='flex flex-col h-screen bg-[var(--background)] justify-center items-center gap-6'>
          <Loading/>
          <h2>Processing data</h2>
      </main>
    )
  }

  return (
    <main className='flex flex-col h-screen bg-[var(--background)]'
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
        <section className='flex-1 h-full flex justify-center items-center flex-col gap-8'>
          <h1 className='font-bold text-6xl text-center'>Create dashboards effortlessly!</h1>
          <p className='w-[90%] sm:w-[60%] text-center text-[var(--text-secondary)]'>Create powerful, customized dashboards in minutes—no technical skills or coding required. Our intuitive platform lets you visualize your data with easy drag-and-drop tools, so you can focus on insights instead of complexity.</p>
        
          { files?.length ? 
            <div className='flex flex-col w-full items-center gap-4'> 
                <div className='flex gap-2'>
                  {
                    files.map((file: File, index: number) => {
                      return <Button
                        className='flex items-center gap-1 bg-[#dee2e6] rounded p-3 cursor-pointer hover:brightness-80'
                        text={file.name}
                        icon={<CiTrash />}
                        onClick={() => {
                            setFiles((files) => {
                              files.splice(index, 1)

                              return [...files]
                            })
                        }}
                      />
                    })
                  }
                </div>
                <Button
                  text='Next'
                  icon={<FaArrowRight />}
                  onClick={onNext}
                />
              </div>  
                :
              <div className='flex gap-2 flex-col items-center mt-8'>
                <div className='flex gap-2 items-center'>
                  <p className='font-bold'>Drag a CSV</p>
                  <IoDocument />
                </div>
                <p>or</p>
                <FileButton
                  text='Browse'
                  icon={<CiSearch/>}
                  acceptedFiles={["csv"]}
                  onChange={onChoose}
                  multiple={false}
                />
              </div> 
          }
        </section>
    </main>
  )
}
