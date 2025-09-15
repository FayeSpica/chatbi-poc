import React from 'react'
import { X, Database, Lightbulb, Settings } from 'lucide-react'

function Sidebar({ isOpen, onClose, schemas, examples }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
        onClick={onClose}
      />
      
      {/* 侧边栏内容 */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl lg:relative lg:shadow-none">
        <div className="flex flex-col h-full">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">设置与示例</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* 语义模式 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Database className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">语义模式</h3>
              </div>
              
              {schemas.length > 0 ? (
                <div className="space-y-2">
                  {schemas.map((schema) => (
                    <div key={schema.name} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-gray-900">{schema.name}</div>
                      <div className="text-sm text-gray-600">{schema.description}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        业务领域: {schema.business_domain} | 表数量: {schema.tables.length}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">暂无语义模式</div>
              )}
            </div>
            
            {/* 示例查询 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Lightbulb className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">示例查询</h3>
              </div>
              
              <div className="space-y-3">
                {examples.map((category, index) => (
                  <div key={index}>
                    <div className="text-sm font-medium text-gray-700 mb-2">
                      {category.category}
                    </div>
                    <div className="space-y-1">
                      {category.queries.map((query, queryIndex) => (
                        <div
                          key={queryIndex}
                          className="text-sm text-gray-600 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            // 这里可以添加点击示例查询的逻辑
                            console.log('选择示例:', query)
                          }}
                        >
                          {query}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 设置 */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Settings className="w-5 h-5 text-primary-600" />
                <h3 className="font-medium text-gray-900">设置</h3>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">使用语义模式</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm text-gray-700">显示执行时间</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
