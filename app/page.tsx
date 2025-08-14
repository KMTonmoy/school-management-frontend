"use client";
import { useUserFromToken } from "@/Hooks/useUserFromToken";
import React from "react";
import {
  Users,
  BookOpen,
  GraduationCap,
  User,
  Award,
  ClipboardList,
} from "lucide-react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthRedirect } from "@/Hooks/useAuthRedirect";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const getProfileColor = (letter?: string) => {
  if (!letter) return "bg-gray-500 text-white";
  const firstLetter = letter.toLowerCase();
  const colorMap: Record<string, string> = {
    a: "bg-red-500 text-white",
    b: "bg-blue-500 text-white",
    c: "bg-yellow-500 text-white",
    d: "bg-green-500 text-white",
    e: "bg-purple-500 text-white",
    f: "bg-pink-500 text-white",
    g: "bg-indigo-500 text-white",
    h: "bg-teal-500 text-white",
    i: "bg-orange-500 text-white",
    j: "bg-amber-500 text-white",
    k: "bg-lime-500 text-white",
    l: "bg-emerald-500 text-white",
    m: "bg-cyan-500 text-white",
    n: "bg-violet-500 text-white",
    o: "bg-fuchsia-500 text-white",
    p: "bg-rose-500 text-white",
    q: "bg-sky-500 text-white",
    r: "bg-stone-500 text-white",
    s: "bg-slate-500 text-white",
    t: "bg-zinc-500 text-white",
    u: "bg-neutral-500 text-white",
    v: "bg-stone-600 text-white",
    w: "bg-slate-600 text-white",
    x: "bg-zinc-600 text-white",
    y: "bg-neutral-600 text-white",
    z: "bg-gray-600 text-white",
  };
  return colorMap[firstLetter] || "bg-gray-500 text-white";
};

const DashboardCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
}) => (
  <div
    className={`bg-white rounded-lg shadow p-6 border-t-4 border-${color}-500`}
  >
    <div className="flex items-center">
      <div
        className={`p-3 rounded-full bg-${color}-100 text-${color}-600 mr-4`}
      >
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </div>
);

const PerformanceChart = () => {
  const data = {
    labels: ["Math", "Science", "History", "English", "Art"],
    datasets: [
      {
        label: "Class Average",
        data: [78, 85, 72, 88, 91],
        backgroundColor: "rgba(79, 70, 229, 0.8)",
        borderColor: "rgba(79, 70, 229, 1)",
        borderWidth: 1,
      },
      {
        label: "School Average",
        data: [72, 80, 75, 82, 85],
        backgroundColor: "rgba(209, 213, 219, 0.8)",
        borderColor: "rgba(209, 213, 219, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Class Performance vs School Average",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

const Dashboard = () => {
  const { user, loading, error, status, message } = useUserFromToken();
  useAuthRedirect();

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error || status === "error")
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-sm text-red-700">{message}</p>
      </div>
    );

  if (!user)
    return (
      <div className="max-w-md mx-auto mt-10 bg-blue-50 border-l-4 border-blue-500 p-4">
        <p className="text-sm text-blue-700">{message}</p>
      </div>
    );

  const firstLetter = user.name?.charAt(0).toUpperCase() || "U";
  const profileColor = getProfileColor(firstLetter);

  const renderAdminCards = () => (
    <>
      <DashboardCard
        icon={<Users className="h-6 w-6" />}
        title="Total Students"
        value="1,248"
        color="blue"
      />
      <DashboardCard
        icon={<User className="h-6 w-6" />}
        title="Total Teachers"
        value="48"
        color="green"
      />
      <DashboardCard
        icon={<BookOpen className="h-6 w-6" />}
        title="Active Classes"
        value="24"
        color="purple"
      />
      <DashboardCard
        icon={<Award className="h-6 w-6" />}
        title="School Performance"
        value="92%"
        color="yellow"
      />
    </>
  );

  const renderTeacherCards = () => (
    <>
      <DashboardCard
        icon={<Users className="h-6 w-6" />}
        title="My Students"
        value="32"
        color="blue"
      />
      <DashboardCard
        icon={<BookOpen className="h-6 w-6" />}
        title="My Classes"
        value="4"
        color="green"
      />
      <DashboardCard
        icon={<ClipboardList className="h-6 w-6" />}
        title="Pending Grades"
        value="12"
        color="purple"
      />
      <DashboardCard
        icon={<Award className="h-6 w-6" />}
        title="Top Student"
        value="Sarah J."
        color="yellow"
      />
    </>
  );

  const renderStudentCards = () => (
    <>
      <DashboardCard
        icon={<Award className="h-6 w-6" />}
        title="My Average"
        value="88%"
        color="blue"
      />
      <DashboardCard
        icon={<GraduationCap className="h-6 w-6" />}
        title="Completed Courses"
        value="5"
        color="green"
      />
      <DashboardCard
        icon={<User className="h-6 w-6" />}
        title="My Teacher"
        value="Mr. Smith"
        color="purple"
      />
      <DashboardCard
        icon={<ClipboardList className="h-6 w-6" />}
        title="Assignments Due"
        value="3"
        color="yellow"
      />
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="bg-indigo-700 px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-3">
                <div
                  className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold ${profileColor}`}
                >
                  {firstLetter}
                </div>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-indigo-200">{user.email}</p>
                <p className="text-indigo-300 mt-1 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {user.role === "admin" && renderAdminCards()}
          {user.role === "teacher" && renderTeacherCards()}
          {user.role === "student" && renderStudentCards()}
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            {user.role === "admin" && "School Analytics"}
            {user.role === "teacher" && "Class Performance Metrics"}
            {user.role === "student" && "My Progress"}
          </h2>
          <div className="h-96">
            {user.role === "teacher" && <PerformanceChart />}
            {user.role === "admin" && (
              <div className="flex items-center justify-center h-full text-gray-500">
                School-wide analytics dashboard
              </div>
            )}
            {user.role === "student" && (
              <div className="flex items-center justify-center h-full text-gray-500">
                Student progress visualization
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
