import type { Chart as ChartEntity } from '@/types/data';
import { ChartType } from '@/types/data-type';
import type Konva from 'konva';
import { memo, useRef, type ReactNode } from 'react';
import { Group, Rect} from 'react-konva';
import { Html } from 'react-konva-utils';
import { BarChart as RechartBarChart, Bar, XAxis, CartesianGrid, Rectangle, Tooltip, YAxis, Cell, Pie, PieChart as  RechartPieChart, LineChart as  RechartLineChart, Line} from 'recharts';
import type { PieLabelProps } from 'recharts/types/polar/Pie';

type DefaultChartProps = {
  id:string;
  children: ReactNode,
  isSelected:boolean,
  onChange?:(chart:ChartEntity) => void,
  data:ChartEntity
  onMouseDown?:(event: Konva.KonvaEventObject<MouseEvent>) => void
}
export const ChartContainer = (props : DefaultChartProps) => {

    const groupRef = useRef<Konva.Group>(null)


    const handleTransformEnd = () => {
      const group = groupRef.current!;
      const scaleX = group.scaleX();
      const scaleY = group.scaleY();

      group.scaleX(1);
      group.scaleY(1);

      props.onChange?.({
        ...props.data,
        x: group.x(),
        y: group.y(),
        width: Math.max(10, (props.data.width ?? group.width()!) * scaleX),
        height: Math.max(10, (props.data.height ?? group.height()!) * scaleY),
      });
    };

    return <Group
              id={props.id}
              ref={groupRef}
              preventDefault={true}
              draggable
              x={props.data.x}
              y={props.data.y}
              width={props.data.width}
              height={props.data.height}
              onMouseDown={(event) => {
                event.cancelBubble = true
                props.onMouseDown?.(event)
              }}
              onClick={(event) => {
                event.cancelBubble = true
              }}
              onDragEnd={(event) => {
                event.cancelBubble = true

                const chart : ChartEntity = {
                  ...props.data,
                  x:event.target.x(),
                  y:event.target.y()
                } 

                props.onChange?.(chart)
              }}
              onTransformEnd={handleTransformEnd}
              > 
      <Rect 
          width={props.data.width} 
          height={props.data.height} 
          _useStrictMode 
        />
        
        <Html
          transform
          divProps={{
              style: {
                width: props.data.width,
                height: props.data.height,
                pointerEvents:"none",
                cursor:"grab",
                backgroundColor:"transparent",
              },
            }}
            
            >
              {props.children}
          </Html> 
    </Group>
}

type ChartProps = {
  type: ChartType,
  data:ChartEntity
}
export const Chart = (props: ChartProps) => {

  if(props.type === ChartType.BAR){
    return <BarChart data={props.data}/>
  }

  if(props.type === ChartType.PIE){
    return <PieChart data={props.data}/>
  }

  if(props.type === ChartType.LINE){
    return <LineChart data={props.data}/>
  }

}

type BarChartProps = {
    className?: string,
    data: ChartEntity
}
export const BarChart = (props: BarChartProps) => {
  return (
        <RechartBarChart
            width={props.data.width}
            height={props.data.height}
            data={props.data.fields}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={"name"}/>
            <YAxis />
            <Tooltip />
            <Bar dataKey={"value"} activeBar={<Rectangle fill="pink" stroke="blue" />}>
              {
                props.data.fields.map((field, index) => <Cell key={`cell-${index}`} fill={field.color} />)
              }
            </Bar>
        </RechartBarChart>
  );
};

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    
    const x = cx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
    const y = cy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${((percent ?? 1) * 100).toFixed(0)}%`}
      </text>
    );
  };

  type PieChartProps = {
    data: ChartEntity
  }
  export const PieChart = (props: PieChartProps) => {

    const radius = Math.min(props.data.width, props.data.height) / 2;

    const outer = radius * 0.9;

    return <RechartPieChart
          width={props.data.width}
          height={props.data.height}
        >
            <Pie
              data={props.data.fields}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={outer}
              dataKey="value"
              width={props.data.width}
              height={props.data.height}
            >
              {props.data.fields.map((field, index) => (
                <Cell key={`cell-${index}`} fill={field.color} />
              ))}
            </Pie>
          </RechartPieChart>
    
    
  }
  


  type LineChartProps = {
    className?: string,
    data: ChartEntity
}
export const LineChart = memo((props: LineChartProps) => {
  return (
        <RechartLineChart
          width={props.data.width}
          height={props.data.height}
          data={props.data.fields}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis /> 
          <Tooltip />
          <Line dataKey={"value"} activeDot={{ r: 8 }} />
        </RechartLineChart>
  );
})