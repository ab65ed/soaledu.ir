'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type: 'bar' | 'donut' | 'line' | 'area';
  width?: number;
  height?: number;
  className?: string;
  showValues?: boolean;
  showLabels?: boolean;
  animated?: boolean;
}

/**
 * کامپوننت Chart پایه برای نمایش انواع نمودارها
 * Base Chart component for different chart types
 */
const Chart: React.FC<ChartProps> = ({
  data,
  type,
  width = 400,
  height = 300,
  className = '',
  showValues = true,
  showLabels = true,
  animated = true
}) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  const renderBarChart = () => {
    const barWidth = (width - 80) / data.length;
    const barMaxHeight = height - 80;

    return (
      <svg width={width} height={height} className={className}>
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.1"/>
        
        {/* Y-axis */}
        <line x1="40" y1="20" x2="40" y2={height - 60} stroke="#6b7280" strokeWidth="1"/>
        
        {/* X-axis */}
        <line x1="40" y1={height - 60} x2={width - 20} y2={height - 60} stroke="#6b7280" strokeWidth="1"/>
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.value / maxValue) * barMaxHeight;
          const x = 40 + (index * barWidth) + (barWidth * 0.1);
          const y = height - 60 - barHeight;
          const barColor = item.color || colors[index % colors.length];

          return (
            <g key={index}>
              {animated ? (
                <motion.rect
                  x={x}
                  y={height - 60}
                  width={barWidth * 0.8}
                  height={0}
                  fill={barColor}
                  rx="4"
                  initial={{ height: 0, y: height - 60 }}
                  animate={{ height: barHeight, y }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              ) : (
                <rect
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill={barColor}
                  rx="4"
                />
              )}
              
              {showValues && (
                <text
                  x={x + (barWidth * 0.4)}
                  y={y - 5}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-iransans"
                >
                  {item.value}
                </text>
              )}
              
              {showLabels && (
                <text
                  x={x + (barWidth * 0.4)}
                  y={height - 40}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-iransans"
                >
                  {item.label}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Y-axis labels */}
        {[0, 25, 50, 75, 100].map((value, index) => {
          const y = height - 60 - (value / 100) * barMaxHeight;
          return (
            <g key={index}>
              <line x1="35" y1={y} x2="40" y2={y} stroke="#6b7280" strokeWidth="1"/>
              <text
                x="30"
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-gray-600 font-iransans"
              >
                {Math.round((value / 100) * maxValue)}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  const renderDonutChart = () => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    const innerRadius = radius * 0.6;
    
    let currentAngle = -90; // Start from top
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const createArcPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + outerRadius * Math.cos(startAngleRad);
      const y1 = centerY + outerRadius * Math.sin(startAngleRad);
      const x2 = centerX + outerRadius * Math.cos(endAngleRad);
      const y2 = centerY + outerRadius * Math.sin(endAngleRad);
      
      const x3 = centerX + innerRadius * Math.cos(endAngleRad);
      const y3 = centerY + innerRadius * Math.sin(endAngleRad);
      const x4 = centerX + innerRadius * Math.cos(startAngleRad);
      const y4 = centerY + innerRadius * Math.sin(startAngleRad);
      
      const largeArc = endAngle - startAngle > 180 ? 1 : 0;
      
      return [
        `M ${x1} ${y1}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
        `L ${x3} ${y3}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}`,
        'Z'
      ].join(' ');
    };

    return (
      <svg width={width} height={height} className={className}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;
          const color = item.color || colors[index % colors.length];
          
          const arcPath = createArcPath(startAngle, endAngle, radius, innerRadius);
          
          // Label position
          const labelAngle = (startAngle + endAngle) / 2;
          const labelRadius = radius + 20;
          const labelX = centerX + labelRadius * Math.cos((labelAngle * Math.PI) / 180);
          const labelY = centerY + labelRadius * Math.sin((labelAngle * Math.PI) / 180);
          
          currentAngle += angle;
          
          return (
            <g key={index}>
              {animated ? (
                <motion.path
                  d={arcPath}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                />
              ) : (
                <path
                  d={arcPath}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
              
              {showLabels && percentage > 5 && (
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  className="text-xs fill-gray-700 font-iransans"
                >
                  {item.label}
                </text>
              )}
              
              {showValues && percentage > 5 && (
                <text
                  x={labelX}
                  y={labelY + 12}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 font-iransans"
                >
                  {percentage.toFixed(1)}%
                </text>
              )}
            </g>
          );
        })}
        
        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-lg font-bold fill-gray-700 font-iransans"
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-sm fill-gray-500 font-iransans"
        >
          کل
        </text>
      </svg>
    );
  };

  const renderLineChart = () => {
    const padding = 50;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    const xStep = chartWidth / (data.length - 1);
    const points = data.map((item, index) => ({
      x: padding + index * xStep,
      y: padding + chartHeight - (item.value / maxValue) * chartHeight
    }));
    
    const pathData = points.reduce((path, point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;
      return `${path} L ${point.x} ${point.y}`;
    }, '');

    return (
      <svg width={width} height={height} className={className}>
        {/* Grid */}
        <defs>
          <pattern id="grid-line" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect x={padding} y={padding} width={chartWidth} height={chartHeight} fill="url(#grid-line)" opacity="0.1"/>
        
        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="1"/>
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="1"/>
        
        {/* Line */}
        {animated ? (
          <motion.path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5 }}
          />
        ) : (
          <path
            d={pathData}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        
        {/* Points */}
        {points.map((point, index) => (
          <g key={index}>
            {animated ? (
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3B82F6"
                stroke="#fff"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              />
            ) : (
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3B82F6"
                stroke="#fff"
                strokeWidth="2"
              />
            )}
            
            {showValues && (
              <text
                x={point.x}
                y={point.y - 10}
                textAnchor="middle"
                className="text-xs fill-gray-600 font-iransans"
              >
                {data[index].value}
              </text>
            )}
            
            {showLabels && (
              <text
                x={point.x}
                y={height - padding + 15}
                textAnchor="middle"
                className="text-xs fill-gray-700 font-iransans"
              >
                {data[index].label}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'donut':
        return renderDonutChart();
      case 'line':
        return renderLineChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="flex justify-center items-center">
      {renderChart()}
    </div>
  );
};

export default Chart; 