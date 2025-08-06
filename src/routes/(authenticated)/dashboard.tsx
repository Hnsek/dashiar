import { Chart, ChartContainer } from '@/components/Charts';
import { DashboardTitle } from '@/components/DashboardTitle';
import { ChartConfigSidebar, ChartsSidebar } from '@/components/Sidebars';
import { calculate } from '@/services/chart-calculator';
import { filter } from '@/services/chart-filter';
import { type Chart as ChartEntity, type ChartField, type ChartFilter } from '@/types/data';
import { ChartFilterType, ChartOperation } from '@/types/data-type';
import { useDashboard } from '@/utils/hooks/use-dashboard';
import { createFileRoute } from '@tanstack/react-router'
import type Konva from 'konva';
import { useEffect, useRef, useState } from 'react';
import {Layer, Rect, Stage, Transformer } from "react-konva"

type Search = {
  id:string | undefined;
}

export const Route = createFileRoute('/(authenticated)/dashboard')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): Search => ({
    id: typeof search.id === 'string' ? search.id : undefined,
  }),
})

function RouteComponent() {

  const { id } = Route.useSearch()

  const {data, setData, fieldNames} = useDashboard(id)

  const [stagePos, setStagePos] = useState({ x: 500, y: 100, scale: 0.7 });

  const [selectedChartIndex, setSelectedChartIndex] = useState<number | null>(null)

  const transformerRef = useRef<Konva.Transformer>(null);
  const stageRef = useRef<Konva.Stage>(null);

  useEffect(() => {

      const eventHandler = (event :  KeyboardEvent) => {
        if(event.key === "Backspace" && selectedChartIndex !== null){
          
          const charts : ChartEntity[] = data!.charts
          charts.splice(selectedChartIndex, 1)

          transformerRef.current?.nodes([]);
          setSelectedChartIndex(null)

          setData({
            ...data!,
            charts
          })
        }
      }

    window.addEventListener("keydown", eventHandler)

    const node = stageRef.current?.findOne(`#chart-${selectedChartIndex}`)
      
    if(!transformerRef.current){
      return
    }

    if(node){
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    }
    else{
      transformerRef.current.nodes([]);
    }


    return () => window.removeEventListener("keydown", eventHandler)
  },[selectedChartIndex])

  return <main className='w-full h-screen bg-[var(--background)]'>
      <section className='absolute top-4 left-1/2 transform -translate-x-1/2 w-fit z-55 flex justify-center self-center'>
          {
            data ?
              <DashboardTitle 
                value={data.name}
                onChange={(name) => {
                  if(data){
                    setData({
                      ...data,
                      name
                    })
                  }
                }}/>
              :
              undefined
          }
      </section>
      <ChartsSidebar
        onDragChart={(chart) => {

          if(!data){
            return
          }

          const charts = data!.charts

          const fieldNameIndex = 0
          
          charts.push({
            ...chart,
            x: chart.x - stagePos.x,
            y: chart.y - stagePos.y,
            fields:[{
              name:"Column name",
              color:"#8884d8",
              type: ChartOperation.SUM,
              key:fieldNames[fieldNameIndex],
              value:200,
              filters:[],
              fieldIndex:fieldNameIndex
            }]
          })
          
          setData({
            ...data!,
            charts
          })
        }}
      />
      <ChartConfigSidebar
        show={selectedChartIndex !== null}
        data={selectedChartIndex !== null && data ? data.charts[selectedChartIndex]?.fields : []}
        fieldNames={fieldNames}
        onCreateField={() => {
          
          if(!data || selectedChartIndex === null){
            return
          }

          const charts : ChartEntity[] = data?.charts

          const value =  !charts[selectedChartIndex].fields.length ? 200 : 0

          const fieldNameIndex = 0

          charts[selectedChartIndex].fields = [
            ...charts[selectedChartIndex].fields,
            {
              name:"Column name",
              key:fieldNames[0],
              type: ChartOperation.SUM,
              color:"#8884d8",
              value,
              filters:[],
              fieldIndex:fieldNameIndex
            }
          ]


          setData({
            ...data,
            charts
          })
        }}
        onUpdateField={(field, index) => {

          if(!data || selectedChartIndex === null){
            return
          }
          
          const charts = data.charts
          const fields = [...charts[selectedChartIndex].fields]
          
          const dataset = data.datasets[0]

          const fieldNameIndex : number = fieldNames.findIndex((fieldName) => fieldName === field.key)

          const values = dataset.lines.map((line) => line.columns[fieldNameIndex]) as number[]
          
          let filteredValues = values
          field.filters.forEach((chartFilter) => {
            filteredValues = filter(chartFilter.type, dataset, chartFilter.value as number, chartFilter.fieldIndex,fieldNameIndex) as number[]
          })

          fields[index] = {
            ...field,
            key:fieldNames[fieldNameIndex],
            value:filteredValues.length ? calculate(field.type,filteredValues) : 0,
            fieldIndex: fieldNameIndex
          }

          charts[selectedChartIndex].fields = fields

          setData({
            ...data,
            charts
          })
        }}
        onRemoveField={(index : number) => {
          
          if(!data || selectedChartIndex === null){
            return 
          }

          
          const charts = data.charts
          
          const fields = [...charts[selectedChartIndex].fields]

          fields.splice(index, 1)

          charts[selectedChartIndex].fields = fields

          setData({
            ...data,
            charts
          })
        }}
        onCreateFilter={(fieldIndex: number)=>{
          if(!data || selectedChartIndex === null){
            return 
          }
          
          const charts = data.charts

          const fields = [...charts[selectedChartIndex].fields]
          const field = fields[fieldIndex]
          
          const filters : ChartFilter[] = [
              ...fields[fieldIndex].filters,
              {
                type:ChartFilterType.EQUAL,
                value:0,
                key: field.key,
                fieldIndex: field.fieldIndex
              }
            ]
          
          fields[fieldIndex] = {
              ...fields[fieldIndex],
              filters
          }

          charts[selectedChartIndex].fields = fields

          setData({
            ...data,
            charts
          })
        }}
        onUpdateFilter={(fieldIndex : number, filters : ChartFilter[]) => {
           if(!data || selectedChartIndex === null){
            return 
          }

          const charts = data.charts
          const dataset = data.datasets[0]
          
          const field = charts[selectedChartIndex].fields[fieldIndex]
          const fieldNameIndex : number = fieldNames.findIndex((fieldName) => fieldName === field.key)

          const values = dataset.lines.map((line) => line.columns[fieldNameIndex]) as number[]
        

          let filteredValues = values
          filters.forEach((chartFilter) => {
            filteredValues = filter(chartFilter.type, dataset, chartFilter.value as number, chartFilter.fieldIndex,fieldNameIndex) as number[]
          })

          const newFields = [...charts[selectedChartIndex].fields]


          const newField : ChartField= {
            ...field,
            filters,
            value: filteredValues.length ? calculate(field.type,filteredValues) : 0
          }
          
          newFields[fieldIndex] = newField

          charts[selectedChartIndex].fields = newFields

          setData({
            ...data,
            charts
          })
        }}
        onRemoveFilter={(fieldIndex, filterIndex) => {
            if(!data || selectedChartIndex === null){
            return 
          }
          
          const charts = data.charts
          
          const fields = [...charts[selectedChartIndex].fields]

          const filters = [
            ...fields[fieldIndex].filters
          ]

          filters.splice(filterIndex, 1)
          
          fields[fieldIndex] = {
            ...fields[fieldIndex],
            filters
          }

          const dataset = data.datasets[0]
          const fieldNameIndex : number = fieldNames.findIndex((fieldName) => fieldName === newFields[fieldIndex].key)
          
          const values = dataset.lines.map((line) => line.columns[fieldNameIndex]) as number[]

          
          let filteredValues = values as number[]
          
          filters.forEach((chartFilter) => {
            filteredValues = filter(chartFilter.type, dataset, chartFilter.value as number, chartFilter.fieldIndex,fieldNameIndex) as number[]
          })

          const newFields = [...charts[selectedChartIndex].fields]

          const newField : ChartField= {
            ...fields[fieldIndex],
            filters,
            value: filteredValues.length ? calculate(fields[fieldIndex].type,filteredValues) : 0
          }

          newFields[fieldIndex] = newField

          charts[selectedChartIndex].fields = newFields

          setData({
            ...data,
            charts
          })
        }}
      />
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        draggable
        x={stagePos.x}
        y={stagePos.y}
        scaleX={stagePos.scale}
        scaleY={stagePos.scale}
        onClick={() => {
            setSelectedChartIndex(null)
        }}
        onDragEnd={(e) => {
          const pos = { x: e.target.x(), y: e.target.y(), scale: stagePos.scale };
          setStagePos(pos);

        }}
        onWheel={(e) => {

          e.evt.preventDefault();

          const pointer = e.target.getStage()!.getPointerPosition()!;
          const scaleBy = e.evt.deltaY > 0 ? 0.9 : 1.1;
          const newScale = stagePos.scale * scaleBy;
          const mousePointToStage = {
            x: (pointer.x - stagePos.x) / stagePos.scale,
            y: (pointer.y - stagePos.y) / stagePos.scale,
          };
          const x = pointer.x - mousePointToStage.x * newScale;
          const y = pointer.y - mousePointToStage.y * newScale;
          setStagePos({ x, y, scale: newScale });
        }}
        >

            <Layer>
                <Rect
                  width={1320}
                  height={878}
                  fill={"#FFF"}
                  shadowColor='#000'
                  shadowEnabled
                >

                </Rect>
            </Layer>
            <Layer >
              {data?.charts.map((chart: ChartEntity, chartIndex: number) => {
                return <ChartContainer
                      key={chartIndex}
                      id={`chart-${chartIndex}`}
                      isSelected={chartIndex === selectedChartIndex}
                      data={chart}
                      onChange={(chart) => {
                        const charts = data.charts

                        charts[chartIndex] = chart

                        setData({
                          ...data,
                          charts
                        })
                      }}
                      onMouseDown={(event) => {
                        event.cancelBubble = true
                        setSelectedChartIndex(chartIndex)
                      }}
                    >
                      <Chart
                          type={chart.type} 
                          data={chart}
                          />
                    </ChartContainer>
              })}
              <Transformer
                  ref={transformerRef}
                  anchorStroke="indigo"
                  anchorFill="#fff"
                  rotateEnabled={false}
                  rotationEnabled={false}
                  enabledAnchors={[
                    'top-center',
                    'middle-right',
                    'middle-left',
                    'bottom-center',
                  ]}
                  flipEnabled={true}
                  onDragEnd={(event) => event.cancelBubble = true}
                />
          </Layer>
        </Stage>
        
  </main>
}
