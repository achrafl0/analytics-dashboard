import React, { useEffect, useRef, useState } from 'react'
import {IDataResult} from "../services/api/data"
import * as d3 from 'd3'

interface ChartProps {
    dataFetcher: () => Promise<IDataResult>
    // We'll assume, for now, that all the data we have is in the form of {identifier: number[], timestamp: number[]}
    dataPointIdentifier: string

    // If we had time, we could have this component take a forwardRef to the chart 
    // svgRef: React.MutableRefObject<null>
}

const Chart: React.FC<ChartProps> = ({dataFetcher, dataPointIdentifier}) => {
  const svgRef = useRef(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<number[]>([]);
  const [error, setError] = useState<string>("")
  const [timestamps, setTimestamps] = useState<number[]>([])
  
  const getMergedData = () => {
    return mergeData(timestamps, data);
  }

  const mergeData = (x: number[], y: number[]) => {
    const data = [];
    for (let i = 0; i < x.length; i++) {
        data.push({x: x[i], y: y[i]})
    }
    return data
  }
  useEffect(() => {
    const fetchData = async () => {
        const fetched = await dataFetcher();     
        // The next line is ugly as we're dealing we a generic easy case
        const fetchedData = fetched[dataPointIdentifier as keyof IDataResult] as number[]
        setData(fetchedData);
        const fetchedTimestamps = fetched["timestamp" as keyof IDataResult] as number[]
        setTimestamps(fetchedTimestamps)
    }
    setLoading(true);
    fetchData()
        .catch((err) => setError(err))
        .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (data.length > 0){
        const width = 600;
        const height = 600;
        const timeformat = d3.timeFormat("%I:%M %p %a %Y");
        // Possibility to refactor this into an utils
        const svgEl = d3.select(svgRef.current).attr("width", width).attr("height", height);
        const chart = d3.select(svgRef.current)
    
        const xMin = d3.min(timestamps) as number;
        const xMax = d3.max(timestamps) as number;

        const yMin = d3.min(data) as number;
        const yMax = d3.max(data) as number;

        const xScale = d3.scaleTime([xMin, xMax], [0, width]);
        const yScale = d3.scaleLinear([yMin, yMax], [height, 0]);

        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale)
        .tickPadding(5)
        .ticks(5)
        .tickFormat((domain) => timeformat(domain as Date));

        chart.selectAll("line")
            .data(getMergedData())
            .enter()
            .append("svg:line")
            .attr("x", (d) => xScale(d.x) + 5)
            .attr("y", (d) => yScale(d.y))
            .attr("stroke", "blue")
        


    }

  }, [data])

  
  if (error !== ""){
    return <p>{error}</p>
  }

  if (data.length > 0 && !loading){
    return (
        <div>   
          <svg ref={svgRef} />
        </div>
      )
  }
  return <p>Loading...</p>
}

export default Chart
