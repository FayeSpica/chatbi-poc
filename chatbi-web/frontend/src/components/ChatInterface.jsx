import React, { useState, useRef, useEffect } from 'react'
import { Send, Copy, Check, Loader2, Database, Code, AlertCircle } from 'lucide-react'
import { processQuery } from '../utils/api'
import MessageBubble from './MessageBubble'
import QueryInput from './QueryInput'
import ResponseDisplay from './ResponseDisplay'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    useSemantic: true,
    dbName: 'shop',
    model: 'qwen3:8b'
  })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (question) => {
    if (!question.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await processQuery({
        question: question.trim(),
        db_name: settings.dbName,
        use_semantic: settings.useSemantic,
        model: settings.model
      })

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: {
          error: error.message || '处理查询时发生错误',
          question: question
        },
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Database className="w-16 h-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-400 mb-2">欢迎使用 ChatBI</h2>
            <p className="text-gray-500 mb-6 max-w-md">
              输入自然语言问题，我将帮您转换为SQL查询语句。
              支持复杂查询、聚合统计、多表关联等功能。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <Code className="w-6 h-6 text-primary-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">基础查询</h3>
                <p className="text-sm text-gray-600">查询用户、商品、订单等基础信息</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <Database className="w-6 h-6 text-primary-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">聚合统计</h3>
                <p className="text-sm text-gray-600">统计销售数据、用户活跃度等</p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="message-assistant">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                <span className="text-gray-600">正在处理您的查询...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 bg-white p-4">
        <QueryInput 
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          settings={settings}
          onSettingsChange={setSettings}
          onClearChat={handleClearChat}
        />
      </div>
    </div>
  )
}

export default ChatInterface
