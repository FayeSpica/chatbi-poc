import React, { useState } from 'react'
import { Send, Settings, Trash2, ChevronDown } from 'lucide-react'

function QueryInput({ onSendMessage, isLoading, settings, onSettingsChange, onClearChat }) {
  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue)
      setInputValue('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleSettingChange = (key, value) => {
    onSettingsChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className="space-y-4">
      {/* 设置面板 */}
      {showSettings && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">查询设置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                数据库名称
              </label>
              <select
                value={settings.dbName}
                onChange={(e) => handleSettingChange('dbName', e.target.value)}
                className="input-field"
              >
                <option value="shop">shop</option>
                <option value="unknown_db">无语义模式</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                模型
              </label>
              <select
                value={settings.model}
                onChange={(e) => handleSettingChange('model', e.target.value)}
                className="input-field"
              >
                <option value="llama3.1:8b">llama3.1:8b</option>
                <option value="qwen3:8b">qwen3:8b</option>
                <option value="gpt-oss:20b">gpt-oss:20b</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={settings.useSemantic}
                onChange={(e) => handleSettingChange('useSemantic', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">使用语义模式</span>
            </label>
          </div>
        </div>
      )}
      
      {/* 输入区域 */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的自然语言查询，例如：查询最近一周的订单趋势..."
              className="input-field resize-none"
              rows={2}
              disabled={isLoading}
            />
          </form>
        </div>
        
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="btn-secondary"
            title="设置"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClearChat}
            className="btn-secondary text-red-600 hover:text-red-700"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 快捷提示 */}
      <div className="text-xs text-gray-500">
        按 Enter 发送，Shift + Enter 换行
      </div>
    </div>
  )
}

export default QueryInput
