import React, { useState } from 'react'
import { Table, TrendingUp, BarChart3, BarChart2, PieChart } from 'lucide-react'
import {
  LineChartComponent,
  BarChartComponent,
  HorizontalBarChartComponent,
  PieChartComponent,
  TableComponent
} from './ChartComponents'

// 图表类型配置
const CHART_TYPES = [
  {
    id: 'table',
    name: '表格',
    icon: Table,
    component: TableComponent,
    description: '以表格形式显示数据'
  },
  {
    id: 'line',
    name: '折线图',
    icon: TrendingUp,
    component: LineChartComponent,
    description: '显示数据趋势和变化'
  },
  {
    id: 'bar',
    name: '柱状图',
    icon: BarChart3,
    component: BarChartComponent,
    description: '比较不同类别的数据'
  },
  {
    id: 'horizontal-bar',
    name: '条形图',
    icon: BarChart2,
    component: HorizontalBarChartComponent,
    description: '水平显示数据比较'
  },
  {
    id: 'pie',
    name: '饼图',
    icon: PieChart,
    component: PieChartComponent,
    description: '显示数据的比例分布'
  }
]

function ChartSelector({ data, columns, title }) {
  const [selectedChartType, setSelectedChartType] = useState('table')

  // 获取当前选中的图表组件
  const currentChart = CHART_TYPES.find(chart => chart.id === selectedChartType)
  const ChartComponent = currentChart?.component || TableComponent

  return (
    <div className="space-y-4">
      {/* 图表类型选择器 */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
        <span className="text-sm font-medium text-gray-700 self-center mr-2">
          显示方式:
        </span>
        {CHART_TYPES.map((chartType) => {
          const Icon = chartType.icon
          const isSelected = selectedChartType === chartType.id
          
          return (
            <button
              key={chartType.id}
              onClick={() => setSelectedChartType(chartType.id)}
              className={`
                flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
                transition-all duration-200 hover:shadow-sm
                ${isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
              title={chartType.description}
            >
              <Icon className="w-4 h-4" />
              <span>{chartType.name}</span>
            </button>
          )
        })}
      </div>

      {/* 当前选中的图表 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <ChartComponent 
          data={data} 
          columns={columns} 
          title={title}
        />
      </div>

      {/* 数据统计信息 */}
      {data && data.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-2">
          <span>
            共 {data.length} 行数据，{columns?.length || 0} 列
          </span>
          <span>
            当前显示: {currentChart?.name || '表格'}
          </span>
        </div>
      )}
    </div>
  )
}

export default ChartSelector