import { Chart, ChartContainer } from '@/components/Charts';
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
      <ChartsSidebar
        onDragChart={(chart) => {

          if(!data){
            return
          }

          const charts = data!.charts

          const fieldName = fieldNames[0]

          const fieldValues = data!.datasets[0].fieldsValues.find((fieldValues) => fieldValues.name === fieldName)

          if(!fieldValues){
            return
          }

          charts.push({
            ...chart,
            x: chart.x - stagePos.x,
            y: chart.y - stagePos.y,
            fields:[{
              name:fieldNames[0],
              color:"#8884d8",
              type: ChartOperation.SUM,
              key:fieldNames[0],
              value:200,
              filters:[],
              dataset: fieldValues.values as number[] || []
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

          const dataset = data.datasets[0]

          const fieldValues = dataset.fieldsValues.find((fieldValues) => fieldValues.name === fieldNames[0])

          if(!fieldValues){
            return
          }

          const value =  !charts[selectedChartIndex].fields.length ? 200 : 0

          
          charts[selectedChartIndex].fields = [
            ...charts[selectedChartIndex].fields,
            {
              name:fieldNames[0],
              key:fieldNames[0],
              type: ChartOperation.SUM,
              color:"#8884d8",
              value,
              filters:[],
              dataset: fieldValues.values as number[] || []
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

          const fieldDataset = dataset.fieldsValues.find((fieldValues) => fieldValues.name === fieldNames[fieldNameIndex])


          if(!fieldDataset){
            return
          }
          

          let values = fieldDataset.values as number[]
          
          
          field.filters.forEach((chartFilter) => {
            values = filter(chartFilter.type,values, chartFilter.value)
          })

          fields[index] = {
            ...field,
            key:fieldNames[fieldNameIndex],
            dataset:values || [],
            value:values.length ? calculate(field.type,values) : 0
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

          const filters = [
              ...fields[fieldIndex].filters,
              {
                type:ChartFilterType.EQUAL,
                value:0
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

          const field = charts[selectedChartIndex].fields[fieldIndex]

          const fieldDataset = data.datasets[0].fieldsValues.find((fieldValues) => fieldValues.name === field.key)

          if(!fieldDataset){
            return
          }

          let values = fieldDataset.values as number[]
          
          
          filters.forEach((chartFilter) => {
            values = filter(chartFilter.type,values, chartFilter.value)
          })

          const newFields = [...charts[selectedChartIndex].fields]

          const newField : ChartField= {
            ...field,
            dataset:values || [],
            filters,
            value: values.length ? calculate(field.type,values) : 0
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

          
          
          const fieldDataset = data.datasets[0].fieldsValues.find((fieldValues) => fieldValues.name === fields[fieldIndex].key)

          if(!fieldDataset){
            return
          }

          let values = fieldDataset.values as number[]
          
          filters.forEach((chartFilter) => {
            values = filter(chartFilter.type,values, chartFilter.value)
          })

          const newFields = [...charts[selectedChartIndex].fields]

          const newField : ChartField= {
            ...fields[fieldIndex],
            filters,
            value: values.length ? calculate(fields[fieldIndex].type,values) : 0
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
