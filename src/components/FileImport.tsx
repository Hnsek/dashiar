import { IoDocument } from "react-icons/io5";
import { FileButton } from "./Buttons";

import { CiSearch} from "react-icons/ci";


type Props = {
    onChoose?:(files:File[]) => void
}

export const FileImport = (props: Props) => {
    return <div   
          className="flex justify-center items-center flex-col gap-2 w-full h-full"
          onDrop={(event: React.DragEvent<HTMLElement>) => {
            console.warn("drop")
            event.preventDefault()
            props.onChoose?.(Array.from(event.dataTransfer.files))
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => event.preventDefault()}
        >
                <div className='flex gap-2 items-center'>
                  <p className='font-bold'>Drag a CSV</p>
                  <IoDocument />
                </div>

                <p>or</p>

                <FileButton
                  text='Browse'
                  icon={<CiSearch/>}
                  acceptedFiles={["csv"]}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.preventDefault()
                    if(event.target.files){   
                        props.onChoose?.(Array.from(event.target.files))
                    }
                  }}
                  multiple={false}
                />
    </div>
}