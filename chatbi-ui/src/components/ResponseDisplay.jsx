import React, { useState } from 'react'
import { Copy, Check, Database, Code, Clock, AlertCircle, Play, Loader2, Table } from 'lucide-react'
import JsonView from '@uiw/react-json-view'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { executeSQL } from '../utils/api'

function ResponseDisplay({ response }) {
  const [copiedStates, setCopiedStates] = useState({})
  const [isExecuting, setIsExecuting] = useState(false)
  const [executeResult, setExecuteResult] = useState(null)
  const [executeError, setExecuteError] = useState(null)

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

  const handleExecuteSQL = async (sql, dbName = 'shop') => {
    setIsExecuting(true)
    setExecuteError(null)
    setExecuteResult(null)

    try {
      const result = await executeSQL({
        sql: sql,
        db_name: dbName
      })

      if (result.success) {
        setExecuteResult(result)
      } else {
        setExecuteError(result.error || '执行失败')
      }
    } catch (error) {
      setExecuteError(error.message || '网络请求失败')
    } finally {
      setIsExecuting(false)
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
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleExecuteSQL(mysql_sql)}
              disabled={isExecuting}
              className="flex items-center space-x-1 text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>执行中...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>执行查询</span>
                </>
              )}
            </button>
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

      {/* 查询结果 */}
      {executeError && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">执行失败</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{executeError}</p>
          </div>
        </div>
      )}

      {executeResult && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-green-600">
              <Table className="w-4 h-4" />
              <span className="font-medium">查询结果</span>
              <span className="text-sm text-gray-500">
                ({executeResult.row_count} 行, {executeResult.execution_time?.toFixed(3)}秒)
              </span>
            </div>
            {executeResult.data && executeResult.data.length > 0 && (
              <button
                onClick={() => copyToClipboard(JSON.stringify(executeResult.data, null, 2), 'result')}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {copiedStates.result ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>已复制</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>复制数据</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          {executeResult.data && executeResult.data.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto max-h-96">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      {executeResult.columns.map((column, index) => (
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
                    {executeResult.data.map((row, rowIndex) => (
                      <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {executeResult.columns.map((column, colIndex) => (
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
              
              {executeResult.row_count > executeResult.data.length && (
                <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
                  显示前 {executeResult.data.length} 行，共 {executeResult.row_count} 行数据
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <Database className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">查询成功，但没有返回数据</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ResponseDisplay
