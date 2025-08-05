import { ChartFilterType, ChartOperation, ChartType } from "@/types/data-type";
import { memo, useState, type ReactNode } from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import BarChartImage from "../assets/barchart.png" 
import LineChartImage from "../assets/lineChart.png" 
import PieChartImage from "../assets/piechart.png" 
import type { Chart, ChartField, ChartFilter } from "@/types/data";
import { FaPlus } from "react-icons/fa6";
import { FaTimes } from 'react-icons/fa';
import { HexColorPicker } from "react-colorful";
import Collapsible from 'react-collapsible';

type Option = {
    name:string,
    type:ChartType,
    icon:ReactNode,
}

const options : Option[] = [{
    name:"Bar",
    type:ChartType.BAR,
    icon:<img src={BarChartImage}/>
},
{
    name:"Pie",
    type:ChartType.PIE,
    icon:<img src={PieChartImage}/>
},
{
    name:"Line",
    type:ChartType.LINE,
    icon:<img src={LineChartImage}/>
},
]

type Props = {
    onDragChart?: (chart:Chart) => void

}

export const ChartsSidebar = (props : Props) => {
    const [show, setShow] = useState(true)

    return <main 
        style={{
            width: show ? "16%" : 0
        }}
        className="absolute left-0 top-0 h-screen bg-white w-[16%] z-50 shadow transition-all ">
        <button 
            className="absolute -right-12 top-[50%] bottom-[50%] bg-white rounded-full h-fit p-3 shadow cursor-pointer hover:brightness-80"
            onClick={() => setShow(!show)}
            >
            {
                show    ?
                    <IoIosArrowBack />
                    :
                    <IoIosArrowForward />
            }
        </button>

        <section className="w-full grid grid-cols-2 p-4 gap-5"
            style={{
            display: show ? undefined : "none"
        }}
        >
            {
                options.map((option, index) => {
                    return <button 
                        key={index}
                        draggable 
                        className="flex flex-col items-center justify-center gap-2 h-fit cursor-grab hover:brightness-80"
                        onDragEnd={(event) => {
                            const newChart : Chart = {
                                height:200,
                                width:300,
                                type: option.type,
                                x:event.clientX,
                                y:event.clientY,
                                fields:[]
                            }

                            props.onDragChart?.(newChart)
                        }}
                        >
                        <div className="h-30 flex items-center justify-center">
                            {option.icon}
                        </div>
                        <h2 className="font-bold">{option.name}</h2>
                    </button>
                })
            }
        </section>
    </main>
}

type ChartConfigSidebarProps = {
    show?: boolean,
    data:ChartField[],
    fieldNames? :string[],
    onCreateField?:() => void,
    onRemoveField?:(index : number) => void,
    onUpdateField?:(data: ChartField, index: number) => void,
    onCreateFilter?:(fieldIndex : number)=>void,
    onUpdateFilter?:(fieldIndex : number, data: ChartFilter[]) => void,
    onRemoveFilter?:(fieldIndex : number, filterIndex : number) => void,
}

export const ChartConfigSidebar = memo((props : ChartConfigSidebarProps) => {
    
    if(!props.show){
        return 
    }


    return <main 
        style={{
            width: props.show ? "30%" : 0
        }}
        className="absolute right-0 top-0 h-screen bg-white w-[16%] z-50 shadow transition-all p-2 gap-3 flex flex-col overflow-auto"
        >


            <section className="flex flex-col gap-2">
                <h2 className="font-bold text-3xl">Fields</h2>
                <div className="flex flex-col gap-2">
                    {
                        props.data?.map((field, fieldIndex : number) => {
                            return <Collapsible 
                                key={fieldIndex}
                                trigger={
                                    <div className="w-full cursor-pointer flex border p-2 rounded border-gray-300 bg-white hover:brightness-80 items-center justify-between">
                                        <h2 className="font-bold ">{field.name}</h2>
                                        <button 
                                                className="flex flex-col items-center justify-center p-4 cursor-pointer hover:brightness-80 bg-white w-fit rounded-full"
                                                onMouseDown={() => props.onRemoveField?.(fieldIndex)}
                                                >
                                                <FaTimes />
                                            </button>
                                    </div>}
                                    transitionTime={100}
                                    className="w-full font-bold cursor-pointer">
                                <div key={fieldIndex} className="flex flex-col mt-3">
                                    <div className="flex gap-1 w-full flex-col" >
                                        <input
                                            placeholder="Name" 
                                            className="flex rounded border bg-white p-1 hover:brightness-80 cursor-text flex-1"
                                            value={field.name}
                                            onKeyDown={(event) => event.stopPropagation()}
                                            onChange={(event)=>{
                                                props.onUpdateField?.({
                                                    ...field,
                                                    name:event.target.value,
                                                }, fieldIndex)
                                            }}
                                            >
                                        </input>
                                        <select 
                                            value={field.key}
                                            className="flex rounded border bg-white p-1 hover:brightness-80 cursor-pointer flex-1" onChange={(event)=>{
                                            props.onUpdateField?.({
                                                ...field,
                                                key:event.target.value
                                            }, fieldIndex)
                                        }}>
                                            {
                                                props.fieldNames?.map((fieldName : string, fieldIndex : number) => {
                                                    return <option key={fieldIndex} value={fieldName}>{fieldName}</option>
                                                })
                                            }
                                            </select>

                                        <select 
                                            
                                            value={field.type}
                                            className=" flex rounded border bg-white p-1 hover:brightness-80 cursor-pointer flex-1" onChange={(event)=>{
                                            props.onUpdateField?.({
                                                ...field,
                                                type:event.target.value as ChartOperation,
                                            }, fieldIndex)
                                        }}>
                                            <option value={ChartOperation.SUM}>Sum</option>
                                            <option value={ChartOperation.AVERAGE}>Average</option>
                                            <option value={ChartOperation.COUNT}>Count</option>
                                        </select> 
                                        
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-bold mt-4">Filters</h2>
                                        <div className="w-full flex flex-col items-center justify-center gap-4">

                                            {field.filters.map((filter, filterIndex) => {
                                                return <div className="flex gap-2  w-full" key={filterIndex}>
                                                    <select 
                                                        value={filter.type}
                                                        className=" flex rounded border bg-white p-1 hover:brightness-80 cursor-pointer flex-1" onChange={(event)=>{

                                                            const newFilters = [...field.filters] 

                                                            newFilters[filterIndex] = {
                                                                ...filter,
                                                                type:event.target.value as ChartFilterType,
                                                            }

                                                            props.onUpdateFilter?.(fieldIndex, newFilters)
                                                        }}>
                                                        <option value={ChartFilterType.EQUAL}>Equal</option>
                                                        <option value={ChartFilterType.LESSTHAN}>Less than</option>
                                                        <option value={ChartFilterType.MORETHAN}>More than</option>
                                                    </select>
                                                    <input
                                                        placeholder="Value" 
                                                        type="number"
                                                        className="flex rounded border bg-white p-1 hover:brightness-80 cursor-text flex-1"
                                                        value={filter.value}
                                                        onKeyDown={(event) => event.stopPropagation()}
                                                        onChange={(event)=>{
                                                            const filters = field.filters
                                                            
                                                            const newFilters = [...filters] 

                                                            newFilters[filterIndex] = {
                                                            ...filter,
                                                            value:parseFloat(event.target.value),
                                                        }

                                                            props.onUpdateFilter?.(fieldIndex, newFilters)
                                                        }}
                                                        >
                                                    </input>
                                                    <button 
                                                        className="flex flex-col items-center justify-center p-2 cursor-pointer hover:brightness-80 bg-white w-fit rounded-full"
                                                        onMouseDown={() => props.onRemoveFilter?.(fieldIndex,filterIndex)}
                                                        >
                                                        <FaTimes />
                                                    </button>

                                                </div>
                                            })}

                                            <button 
                                                className="flex gap-2 items-center justify-center p-4 cursor-pointer hover:brightness-80 bg-white w-fit rounded-full"
                                                onMouseDown={() => props.onCreateFilter?.(fieldIndex)}
                                                >
                                                <p>Add filter</p>
                                                <FaPlus />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="transform scale-70 origin-left p-0 m-0">
                                        <HexColorPicker className="flex-1" color={field.color}  onChange={(color)=>{
                                            props.onUpdateField?.({
                                                ...field,
                                                color,
                                            }, fieldIndex)
                                        }}/>
                                    </div>
                                    <div className="w-full h-1 border-b-1 border-gray-200"></div>
                                </div>
                            </Collapsible>
                        })
                    } 
                    <div className="w-full flex items-center justify-center">
                        <button 
                            className="flex items-center justify-center p-4 cursor-pointer hover:brightness-80 bg-white w-fit rounded-full gap-2"
                            onMouseDown={() => props.onCreateField?.()}
                            >
                            Add field
                            <FaPlus />
                        </button>
                    </div>
                </div>
            </section>
        </main>
})