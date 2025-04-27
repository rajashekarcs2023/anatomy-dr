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
  age: number;
  weight: number;
  hrv: number;
  pulsePressure: number;
  bmi: number;
  map: number;
}

interface YearlyHealthData {
  [key: string]: HealthData;
}

interface HealthDataVisualizationProps {
  data: YearlyHealthData;
  selectedYear: string;
}

export function HealthDataVisualization({ data, selectedYear }: HealthDataVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data[selectedYear]) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const chart = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const yearData = data[selectedYear];
    const metrics = [
      { name: "Heart Rate", value: yearData.heartRate, normalRange: [60, 100] },
      { name: "Respiratory Rate", value: yearData.respiratoryRate, normalRange: [12, 20] },
      { name: "Body Temperature", value: yearData.bodyTemperature, normalRange: [36.1, 37.2] },
      { name: "Oxygen Saturation", value: yearData.oxygenSaturation, normalRange: [95, 100] },
      { name: "Systolic BP", value: yearData.systolicBP, normalRange: [90, 120] },
      { name: "Diastolic BP", value: yearData.diastolicBP, normalRange: [60, 80] },
      { name: "BMI", value: yearData.bmi, normalRange: [18.5, 24.9] },
      { name: "MAP", value: yearData.map, normalRange: [70, 100] }
    ];

    const x = d3.scaleBand()
      .domain(metrics.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(metrics, d => Math.max(d.value, d.normalRange[1])) || 0])
      .range([chartHeight, 0]);

    // Add normal range areas
    metrics.forEach(metric => {
      chart.append("rect")
        .attr("x", x(metric.name) || 0)
        .attr("y", y(metric.normalRange[1]))
        .attr("width", x.bandwidth())
        .attr("height", y(metric.normalRange[0]) - y(metric.normalRange[1]))
        .attr("fill", "#e6f3e6")
        .attr("stroke", "#4caf50")
        .attr("stroke-width", 1);
    });

    // Add bars
    chart.selectAll(".bar")
      .data(metrics)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name) || 0)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => chartHeight - y(d.value))
      .attr("fill", d => {
        if (d.value < d.normalRange[0]) return "#ff9800";
        if (d.value > d.normalRange[1]) return "#f44336";
        return "#4caf50";
      });

    // Add axes
    chart.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    chart.append("g")
      .call(d3.axisLeft(y));

  }, [data, selectedYear]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <svg ref={svgRef}></svg>
      </CardContent>
    </Card>
  );
} 