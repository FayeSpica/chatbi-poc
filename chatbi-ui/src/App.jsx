import React, { useState, useEffect } from 'react'
import ChatInterface from './components/ChatInterface'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import { getHealthStatus, getSchemas, getExamples } from './utils/api'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [healthStatus, setHealthStatus] = useState(null)
  const [schemas, setSchemas] = useState([])
  const [examples, setExamples] = useState([])

  useEffect(() => {
    // 加载初始数据
    const loadInitialData = async () => {
      try {
        const [health, schemasData, examplesData] = await Promise.all([
          getHealthStatus(),
          getSchemas(),
          getExamples()
        ])
        setHealthStatus(health)
        setSchemas(schemasData.schemas || [])
        setExamples(examplesData.examples || [])
      } catch (error) {
        console.error('加载初始数据失败:', error)
      }
    }

    loadInitialData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        healthStatus={healthStatus}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          schemas={schemas}
          examples={examples}
        />
        
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </div>
  )
}

export default App
