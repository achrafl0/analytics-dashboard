import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const ChartPage: React.FC = () => {
  const svgRef = useRef(null)

  useEffect(() => {
    const svgEl = d3.select(svgRef.current)
    svgEl.append('circle').attr('cx', 150).attr('cy', 70).attr('r', 50)
  }, [])

  return (
    <div className='App'>
      <svg ref={svgRef} />
    </div>
  )
}

export default ChartPage
