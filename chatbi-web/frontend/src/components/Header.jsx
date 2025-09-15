import React from 'react'
import { Menu, Database, Wifi, WifiOff } from 'lucide-react'

function Header({ isSidebarOpen, onToggleSidebar, healthStatus }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-primary-600" />
            <h1 className="text-xl font-bold text-gray-900">ChatBI</h1>
            <span className="text-sm text-gray-500">自然语言转SQL</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* 健康状态指示器 */}
          <div className="flex items-center space-x-2">
            {healthStatus?.ollama_available ? (
              <div className="flex items-center space-x-1 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Ollama 已连接</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-red-600">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm">Ollama 未连接</span>
              </div>
            )}
          </div>
          
          {/* 语义模式数量 */}
          {healthStatus?.semantic_schemas > 0 && (
            <div className="text-sm text-gray-600">
              语义模式: {healthStatus.semantic_schemas}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
