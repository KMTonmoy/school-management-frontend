import { LayoutDashboard, Users, BookOpen, GraduationCap, Mail, Settings } from 'lucide-react'

const DashboardPage = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">School Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span className="font-medium">A</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Students</p>
              <h3 className="text-2xl font-bold">1,248</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Classes</p>
              <h3 className="text-2xl font-bold">24</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pass Rate</p>
              <h3 className="text-2xl font-bold">92%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <Mail className="h-6 w-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">New Messages</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
              <div className="p-2 rounded-full bg-gray-100 text-gray-600 mr-4">
                <Settings className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">System update completed</p>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors">
              <Users className="h-6 w-6 mx-auto mb-2" />
              <span>Add Student</span>
            </button>
            <button className="p-4 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors">
              <BookOpen className="h-6 w-6 mx-auto mb-2" />
              <span>Create Class</span>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg text-purple-600 hover:bg-purple-100 transition-colors">
              <GraduationCap className="h-6 w-6 mx-auto mb-2" />
              <span>Enter Grades</span>
            </button>
            <button className="p-4 bg-yellow-50 rounded-lg text-yellow-600 hover:bg-yellow-100 transition-colors">
              <Mail className="h-6 w-6 mx-auto mb-2" />
              <span>Send Message</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h2>
          <div className="bg-gray-100 rounded-lg p-4 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-3xl font-bold mb-2">15</div>
              <div className="text-sm">October 2023</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage