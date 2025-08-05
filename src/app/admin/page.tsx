'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Users, UserCheck, UserX, CheckSquare, Clock, AlertCircle } from 'lucide-react'

interface DashboardStats {
  totalUsers: number
  pendingUsers: number
  approvedUsers: number
  rejectedUsers: number
  totalTasks: number
  completedTasks: number
  pendingTasks: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    rejectedUsers: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  })
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // For now, we'll use mock data since we haven't implemented all APIs yet
      // In a real implementation, you would fetch from multiple API endpoints
      setStats({
        totalUsers: 25,
        pendingUsers: 3,
        approvedUsers: 20,
        rejectedUsers: 2,
        totalTasks: 15,
        completedTasks: 8,
        pendingTasks: 7
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Karyawan',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Menunggu Persetujuan',
      value: stats.pendingUsers,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Karyawan Aktif',
      value: stats.approvedUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Tugas',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    }
  ]

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Selamat Datang di Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Kelola karyawan, tugas, dan monitor aktivitas sistem dari sini.
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <a
                href="/admin/users?status=PENDING"
                className="flex items-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Persetujuan Registrasi</p>
                  <p className="text-sm text-gray-600">{stats.pendingUsers} karyawan menunggu persetujuan</p>
                </div>
              </a>
              <a
                href="/admin/tasks"
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <CheckSquare className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Kelola Tugas</p>
                  <p className="text-sm text-gray-600">Buat dan kelola tugas karyawan</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Tugas</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selesai</span>
                <span className="font-semibold text-green-600">{stats.completedTasks}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Dalam Progress</span>
                <span className="font-semibold text-yellow-600">{stats.pendingTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ 
                    width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%` 
                  }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}% tugas selesai
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

