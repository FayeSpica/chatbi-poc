import React from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// 颜色调色板
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1',
  '#d084d0', '#87d068', '#ffc0cb', '#ffb347', '#98fb98'
]

// 数据转换工具函数
const transformDataForCharts = (data, columns) => {
  if (!data || !data.length || !columns || !columns.length) {
    return { chartData: [], xKey: '', yKeys: [] }
  }

  // 识别数值列和文本列
  const numericColumns = columns.filter(col => {
    const sampleValues = data.slice(0, 5).map(row => row[col])
    return sampleValues.some(val => 
      val !== null && val !== undefined && !isNaN(Number(val)) && val !== ''
    )
  })

  const textColumns = columns.filter(col => !numericColumns.includes(col))
  
  // 选择X轴（优先选择文本列，如果没有则选择第一列）
  const xKey = textColumns.length > 0 ? textColumns[0] : columns[0]
  
  // 选择Y轴（数值列，最多取前5个）
  const yKeys = numericColumns.slice(0, 5)

  // 转换数据
  const chartData = data.map(row => {
    const transformedRow = { [xKey]: row[xKey] }
    yKeys.forEach(key => {
      const value = row[key]
      transformedRow[key] = value !== null && value !== undefined ? Number(value) : 0
    })
    return transformedRow
  })

  return { chartData, xKey, yKeys }
}

// 折线图组件
export const LineChartComponent = ({ data, columns, title }) => {
  const { chartData, xKey, yKeys } = transformDataForCharts(data, columns)

  if (!chartData.length || !yKeys.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>没有合适的数据用于生成折线图</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

// 柱状图组件
export const BarChartComponent = ({ data, columns, title }) => {
  const { chartData, xKey, yKeys } = transformDataForCharts(data, columns)

  if (!chartData.length || !yKeys.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>没有合适的数据用于生成柱状图</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[index % COLORS.length]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 水平条形图组件
export const HorizontalBarChartComponent = ({ data, columns, title }) => {
  const { chartData, xKey, yKeys } = transformDataForCharts(data, columns)

  if (!chartData.length || !yKeys.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>没有合适的数据用于生成条形图</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          layout="horizontal"
          data={chartData} 
          margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis 
            type="category" 
            dataKey={xKey} 
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip />
          <Legend />
          {yKeys.map((key, index) => (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[index % COLORS.length]}
              radius={[0, 2, 2, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// 饼图组件
export const PieChartComponent = ({ data, columns, title }) => {
  const { chartData, xKey, yKeys } = transformDataForCharts(data, columns)

  if (!chartData.length || !yKeys.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>没有合适的数据用于生成饼图</p>
      </div>
    )
  }

  // 对于饼图，我们使用第一个数值列
  const valueKey = yKeys[0]
  const pieData = chartData.map((item, index) => ({
    name: item[xKey],
    value: item[valueKey],
    fill: COLORS[index % COLORS.length]
  }))

  // 自定义标签函数
  const renderLabel = ({ name, value, percent }) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [value, valueKey]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

// 表格组件（保持原有的表格显示）
export const TableComponent = ({ data, columns, title }) => {
  if (!data || !data.length || !columns || !columns.length) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>没有数据可显示</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {title && <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-96">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {row[column] !== null && row[column] !== undefined 
                        ? String(row[column]) 
                        : <span className="text-gray-400 italic">null</span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}