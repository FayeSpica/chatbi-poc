import React, { useState } from 'react'
import { Copy, Check, Database, Code, Clock, AlertCircle } from 'lucide-react'
import JsonView from '@uiw/react-json-view'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'

function ResponseDisplay({ response }) {
  const [copiedStates, setCopiedStates] = useState({})

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [key]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }))
      }, 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  if (!response) return null

  const { success, question, intent, semantic_sql, mysql_sql, execution_time, error } = response

  if (!success) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">查询失败</span>
        </div>
        <div className="text-red-700">
          <p><strong>问题:</strong> {question}</p>
          <p><strong>错误:</strong> {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* 查询意图 */}
      <div className="flex items-center space-x-2 text-green-600">
        <Database className="w-5 h-5" />
        <span className="font-medium">查询意图: {intent}</span>
      </div>

      {/* 执行时间 */}
      {execution_time && (
        <div className="flex items-center space-x-2 text-gray-600 text-sm">
          <Clock className="w-4 h-4" />
          <span>执行时间: {execution_time.toFixed(2)}秒</span>
        </div>
      )}

      {/* MySQL SQL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-gray-900">MySQL SQL</span>
          </div>
          <button
            onClick={() => copyToClipboard(mysql_sql, 'mysql')}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {copiedStates.mysql ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SyntaxHighlighter
            language="sql"
            style={tomorrow}
            customStyle={{
              margin: 0,
              padding: '1rem',
              fontSize: '0.875rem',
              lineHeight: '1.5'
            }}
          >
            {mysql_sql}
          </SyntaxHighlighter>
        </div>
      </div>

      {/* 语义SQL JSON */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span className="font-medium text-gray-900">语义SQL (JSON)</span>
          </div>
          <button
            onClick={() => copyToClipboard(JSON.stringify(semantic_sql, null, 2), 'semantic')}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {copiedStates.semantic ? (
              <>
                <Check className="w-4 h-4" />
                <span>已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>复制</span>
              </>
            )}
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <JsonView
            value={semantic_sql}
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            style={{
              padding: '1rem',
              fontSize: '0.875rem',
              backgroundColor: 'transparent'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ResponseDisplay
