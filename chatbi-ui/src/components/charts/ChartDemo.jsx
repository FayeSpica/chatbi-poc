import React from 'react'
import ChartSelector from './ChartSelector'

// 示例数据
const sampleData = [
  { month: '一月', sales: 12000, orders: 150, customers: 120 },
  { month: '二月', sales: 19000, orders: 220, customers: 180 },
  { month: '三月', sales: 15000, orders: 180, customers: 160 },
  { month: '四月', sales: 22000, orders: 280, customers: 220 },
  { month: '五月', sales: 18000, orders: 200, customers: 190 },
  { month: '六月', sales: 25000, orders: 320, customers: 250 }
]

const sampleColumns = ['month', 'sales', 'orders', 'customers']

function ChartDemo() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">图表组件演示</h1>
        <p className="text-gray-600">
          这是一个展示多种图表类型的演示页面，包括表格、折线图、柱状图、条形图和饼图。
        </p>
      </div>
      
      <ChartSelector
        data={sampleData}
        columns={sampleColumns}
        title="销售数据分析"
      />
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">使用说明:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>表格:</strong> 显示完整的原始数据</li>
          <li>• <strong>折线图:</strong> 适合显示趋势变化，如销售额随时间的变化</li>
          <li>• <strong>柱状图:</strong> 适合比较不同类别的数据</li>
          <li>• <strong>条形图:</strong> 水平显示数据，适合类别名称较长的情况</li>
          <li>• <strong>饼图:</strong> 显示数据的比例分布（使用第一个数值列）</li>
        </ul>
      </div>
    </div>
  )
}

export default ChartDemo