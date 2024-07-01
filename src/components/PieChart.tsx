import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

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

const PieChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<{ label: string, value: number }[]>([]);

  useEffect(() => {
    // 读取 JSON 文件
    d3.json('C:/Users/lenovo/Desktop/log/resnet18/aisec-dell-server_1651653.1714223441398177611.pt.trace.json').then((jsonData: any) => {
      const traceEvents: TraceEvent[] = jsonData.traceEvents;

      // 统计每个 name 出现的次数
      const nameCounts: { [key: string]: number } = {};
      traceEvents.forEach(event => {
        if (nameCounts[event.name]) {
          nameCounts[event.name]++;
        } else {
          nameCounts[event.name] = 1;
        }
      });

      // 转换为 d3 pie chart 所需的数据格式
      const pieData = Object.keys(nameCounts).map(name => ({
        label: name,
        value: nameCounts[name]
      }));

      setData(pieData);
    }).catch(error => {
      console.error('Error reading JSON file:', error);
    });
  }, []);

  useEffect(() => {
    if (svgRef.current && data.length > 0) {
      const width = 400;
      const height = 400;
      const radius = Math.min(width, height) / 2;

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const pie = d3.pie<{ label: string, value: number }>()
        .value(d => d.value);

      const path = d3.arc<d3.PieArcDatum<{ label: string, value: number }>>()
        .outerRadius(radius - 10)
        .innerRadius(0);

      const label = d3.arc<d3.PieArcDatum<{ label: string, value: number }>>()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);

      const arc = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');

      arc.append('path')
        .attr('d', path)
        .attr('fill', d => color(d.data.label));

      arc.append('text')
        .attr('transform', d => `translate(${label.centroid(d)})`)
        .attr('dy', '0.35em')
        .text(d => d.data.label);
    }
  }, [data]);

  return (
    <svg ref={svgRef}></svg>
  );
};

export default PieChart;
