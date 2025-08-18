import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface Result {
  _id: string;
  subject: string;
  marks: number;
  date: string;
  teacher: {
    name: string;
  };
}

interface UserToken {
  id: string;
  name: string;
  email: string;
  role: string;
}

const PerformanceChart = ({ data }: { data: any[] }) => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorMark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
          <XAxis 
            dataKey="subject" 
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.3 }}
          />
          <YAxis 
            domain={[0, 100]} 
            tick={{ fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.3 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              backdropFilter: 'blur(4px)',
              color: 'white'
            }}
            formatter={(value: any) => [`${value}%`, "Marks"]}
            labelFormatter={(label) => `Subject: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="marks" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorMark)" 
            strokeWidth={3}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const StudentPage = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded = jwtDecode<UserToken>(token);
      setUser(decoded);
      if (decoded.role !== 'student') {
        router.push('/dashboard');
        return;
      }
      fetchStudentResults(decoded.id);
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  const fetchStudentResults = async (studentId: string) => {
    try {
      const response = await axios.get(`https://sl-backend-nine.vercel.app/api/student/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const formattedResults = response.data.map((result: any) => ({
        ...result,
        date: new Date(result.date).toLocaleDateString()
      }));
      
      setResults(formattedResults);
    } catch (error) {
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B+';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C+';
    if (marks >= 40) return 'C';
    return 'F';
  };

  const getPerformanceTrend = () => {
    if (results.length < 2) return 'Not enough data';
    
    const sortedResults = [...results].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const latest = sortedResults[sortedResults.length - 1].marks;
    const previous = sortedResults[sortedResults.length - 2].marks;
    
    if (latest > previous) return 'Improving ↑';
    if (latest < previous) return 'Declining ↓';
    return 'Stable →';
  };

  const getChartData = () => {
    return results.map((result) => ({
      subject: result.subject,
      marks: result.marks,
      date: result.date
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-500 rounded-full mb-4"></div>
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );

  if (!user) return <div className="container mx-auto px-4 py-8">Not authorized</div>;

  const averageMarks = results.length > 0 
    ? (results.reduce((sum, result) => sum + result.marks, 0) / results.length).toFixed(1)
    : 0;

  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Academic Dashboard</h1>
            <p className="text-gray-600">Hello {user.name}, here's your performance overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Average Score</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">{averageMarks}%</h3>
                <p className="text-xs text-gray-400 mt-2">Across all subjects</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Latest Result</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {latestResult ? `${latestResult.marks}%` : 'N/A'}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  {latestResult ? latestResult.subject : 'No results yet'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Performance Trend</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-1">
                  {results.length > 1 ? getPerformanceTrend() : 'N/A'}
                </h3>
                <p className="text-xs text-gray-400 mt-2">
                  {results.length > 1 ? 'Compared to previous' : 'Need more data'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8 transition-all hover:shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Analysis</h2>
          {results.length > 0 ? (
            <PerformanceChart data={getChartData()} />
          ) : (
            <div className="h-80 flex items-center justify-center">
              <p className="text-gray-500">No results data available yet</p>
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200/50 overflow-hidden transition-all hover:shadow-md">
          <div className="p-6 border-b border-gray-200/50">
            <h2 className="text-xl font-semibold text-gray-900">Recent Assessments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200/50">
                {results.length > 0 ? (
                  [...results].reverse().map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{result.marks}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          calculateGrade(result.marks).startsWith('A') ? 'bg-green-100 text-green-800' :
                          calculateGrade(result.marks).startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          calculateGrade(result.marks).startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {calculateGrade(result.marks)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.teacher.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="text-gray-500">No assessment records found</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;