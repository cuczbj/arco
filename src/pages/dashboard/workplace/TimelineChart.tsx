import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// 定义事件数据接口
interface TraceEvent {
  ph: string;
  cat: string;
  name: string;
  pid: number;
  tid: number;
  ts: number;
  dur: number;
  args: any;
}

const TimelineChart: React.FC<{ data: TraceEvent[] }> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      const width = 1000;
      const height = 500;
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };

      // 设置 x 轴和 y 轴
      const x = d3.scaleLinear()
        .domain([d3.min(data, d => d.ts) as number, d3.max(data, d => d.ts + d.dur) as number])
        .range([margin.left, width - margin.right]);

      const y = d3.scaleBand()
        .domain(data.map(d => d.name))
        .range([margin.top, height - margin.bottom])
        .padding(0.1);

      const xAxis = (g: any) => g
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

      const yAxis = (g: any) => g
        .attr('transform', `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append('g')
        .call(xAxis);

      svg.append('g')
        .call(yAxis);

      // 绘制事件条形图
      svg.append('g')
        .attr('fill', 'steelblue')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', d => x(d.ts))
        .attr('y', d => y(d.name) as number)
        .attr('width', d => x(d.ts + d.dur) - x(d.ts))
        .attr('height', y.bandwidth());
    }
  }, [data]);

  return (
    <svg
      ref={svgRef}
      width={1000}
      height={500}
      viewBox="0 0 1000 500"
    />
  );
};

export default TimelineChart;
