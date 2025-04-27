"use client"

import { useEffect, useRef } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HealthData {
  heartRate: number;
  respiratoryRate: number;
  bodyTemperature: number;
  oxygenSaturation: number;
  systolicBP: number;
  diastolicBP: number;
  weight: number;
  hrv: number;
  pulsePressure: number;
  bmi: number;
  map: number;
}

interface YearlyHealthData {
  [key: string]: HealthData;
}

interface HealthTimeSeriesProps {
  data: YearlyHealthData;
  selectedMetric: keyof HealthData;
}

export function HealthTimeSeries({ data, selectedMetric }: HealthTimeSeriesProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 40, left: 60 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Convert data to array format for D3
    const timeSeriesData = Object.entries(data).map(([year, metrics]) => ({
      year: parseInt(year.split('_')[1]),
      value: metrics[selectedMetric]
    }));

    // Create scales
    const x = d3.scaleLinear()
      .domain([1, 10])
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([
        d3.min(timeSeriesData, d => d.value) * 0.9,
        d3.max(timeSeriesData, d => d.value) * 1.1
      ])
      .range([chartHeight, 0]);

    // Create line generator
    const line = d3.line<{ year: number; value: number }>()
      .x(d => x(d.year))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    // Add normal range area if applicable
    const normalRanges: Record<string, [number, number]> = {
      heartRate: [50, 70],
      respiratoryRate: [12, 16],
      bodyTemperature: [37.0, 37.0],
      oxygenSaturation: [98, 100],
      systolicBP: [100, 115],
      diastolicBP: [60, 75],
      bmi: [20, 23],
      pulsePressure: [40, 40],
      map: [70, 90]
    };

    if (normalRanges[selectedMetric]) {
      const [min, max] = normalRanges[selectedMetric];
      chart.append("rect")
        .attr("x", 0)
        .attr("y", y(max))
        .attr("width", chartWidth)
        .attr("height", y(min) - y(max))
        .attr("fill", "#e6f3e6")
        .attr("stroke", "#4caf50")
        .attr("stroke-width", 1);
    }

    // Add the line
    chart.append("path")
      .datum(timeSeriesData)
      .attr("fill", "none")
      .attr("stroke", "#2563eb")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    chart.selectAll(".dot")
      .data(timeSeriesData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(d.year))
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", "#2563eb");

    // Add axes
    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x).ticks(10).tickFormat(d => `Year ${d}`));

    chart.append("g")
      .call(d3.axisLeft(y));

    // Add title with capitalized words
    const title = selectedMetric
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    chart.append("text")
      .attr("x", chartWidth / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text(`${title} Over Time`);

  }, [data, selectedMetric]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center w-full">
          <svg ref={svgRef}></svg>
        </div>
      </CardContent>
    </Card>
  );
} 