'use client'

import { useEffect, useState } from 'react'
import EmployeeLayout from '@/components/layout/EmployeeLayout'
import { CheckSquare, Clock, AlertCircle, Bell, Calendar, User } from 'lucide-react'

interface DashboardStats {
  totalTasks: number
  notStartedTasks: number
  inProgressTasks: number
  completedTasks: number
  unreadNotifications: number
}

interface RecentTask {
  id: string
  title: string
  status: string
  dueDate: string | null
  createdAt: string
}

export default function EmployeeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    notStartedTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    unreadNotifications: 0
  })
  
  const [recentTasks, setRecentTasks] = useState<RecentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [tasksResponse, notificationsResponse] = await Promise.all([
        fetch('/api/tasks?limit=5'),
        fetch('/api/notifications?unread=true')
      ])

      const tasksData = await tasksResponse.json()
      const notificationsData = await notificationsResponse.json()

      if (tasksResponse.ok) {
        const tasks = tasksData.tasks
        setRecentTasks(tasks)
        
        // Calculate stats
        const stats = {
          totalTasks: tasks.length,
          notStartedTasks: tasks.filter((t: any) => t.status === 'NOT_STARTED').length,
          inProgressTasks: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
          completedTasks: tasks.filter((t: any) => t.status === 'COMPLETED').length,
          unreadNotifications: notificationsResponse.ok ? notificationsData.unreadCount : 0
        }
        
        setStats(stats)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Tugas',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Belum Dikerjakan',
      value: stats.notStartedTasks,
      icon: AlertCircle,
      color: 'bg-gray-500',
      textColor: 'text-gray-600'
    },
    {
      title: 'Sedang Dikerjakan',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Selesai',
      value: stats.completedTasks,
      icon: CheckSquare,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      NOT_STARTED: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800'
    }
    
    const labels = {
      NOT_STARTED: 'Belum Dikerjakan',
      IN_PROGRESS: 'Sedang Dikerjakan',
      COMPLETED: 'Selesai'
    }

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </EmployeeLayout>
    )
  }

  return (
    <EmployeeLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di Dashboard Karyawan
          </h1>
          <p className="text-gray-600">
            Kelola tugas Anda dan pantau progress pekerjaan dari sini.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tugas Terbaru</h3>
              <a
                href="/employee/tasks"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Lihat Semua
              </a>
            </div>
            
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">Belum ada tugas</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Tugas yang diberikan akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                      {getStatusBadge(task.status)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {task.dueDate && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>Deadline: {new Date(task.dueDate).toLocaleDateString('id-ID')}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Dibuat: {new Date(task.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions & Notifications */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <a
                  href="/employee/tasks?status=NOT_STARTED"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <AlertCircle className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Tugas Belum Dikerjakan</p>
                    <p className="text-sm text-gray-600">{stats.notStartedTasks} tugas menunggu</p>
                  </div>
                </a>
                <a
                  href="/employee/tasks?status=IN_PROGRESS"
                  className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                >
                  <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Tugas Sedang Dikerjakan</p>
                    <p className="text-sm text-gray-600">{stats.inProgressTasks} tugas dalam progress</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Notifications Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
                <a
                  href="/employee/notifications"
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Lihat Semua
                </a>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Notifikasi Belum Dibaca</p>
                  <p className="text-sm text-gray-600">
                    {stats.unreadNotifications} notifikasi baru
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Tugas</h3>
          
          {stats.totalTasks > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Belum Dikerjakan</span>
                <span>{stats.notStartedTasks} dari {stats.totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gray-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.notStartedTasks / stats.totalTasks) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sedang Dikerjakan</span>
                <span>{stats.inProgressTasks} dari {stats.totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>Selesai</span>
                <span>{stats.completedTasks} dari {stats.totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${(stats.completedTasks / stats.totalTasks) * 100}%` 
                  }}
                ></div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-green-600">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}% Selesai
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                Belum ada tugas yang diberikan
              </p>
            </div>
          )}
        </div>
      </div>
    </EmployeeLayout>
  )
}

