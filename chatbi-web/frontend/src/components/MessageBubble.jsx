import React from 'react'
import { User, Bot, AlertCircle } from 'lucide-react'
import ResponseDisplay from './ResponseDisplay'

function MessageBubble({ message }) {
  const getIcon = () => {
    switch (message.type) {
      case 'user':
        return <User className="w-5 h-5 text-primary-600" />
      case 'assistant':
        return <Bot className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      default:
        return <Bot className="w-5 h-5 text-gray-600" />
    }
  }

  const getBubbleClass = () => {
    switch (message.type) {
      case 'user':
        return 'message-user'
      case 'assistant':
        return 'message-assistant'
      case 'error':
        return 'bg-red-50 border border-red-200 rounded-lg p-4 mr-12'
      default:
        return 'message-assistant'
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex space-x-3 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* 头像 */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            {getIcon()}
          </div>
        </div>
        
        {/* 消息内容 */}
        <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
          <div className={getBubbleClass()}>
            {message.type === 'error' ? (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-red-800">处理失败</span>
                </div>
                <p className="text-red-700 mb-2">{message.content.error}</p>
                <div className="text-sm text-red-600">
                  <strong>问题:</strong> {message.content.question}
                </div>
              </div>
            ) : message.type === 'assistant' ? (
              <ResponseDisplay response={message.content} />
            ) : (
              <p className="text-gray-800">{message.content}</p>
            )}
          </div>
          
          {/* 时间戳 */}
          <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : ''}`}>
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
