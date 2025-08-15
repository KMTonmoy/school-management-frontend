"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  _id: string;
  name: string;
  email: string;
}

interface Result {
  _id: string;
  student: Student;
  subject: string;
  marks: number;
  date: string;
}

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  name?: string;
  iat: number;
  exp: number;
}

const TeacherDashboard = () => {
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);

  const fetchData = async () => {
    try {
      const [studentsRes, resultsRes] = await Promise.all([
        axios.get<Student[]>("http://localhost:8000/api/teacher/students", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get<Result[]>("http://localhost:8000/api/teacher", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setStudentsCount(studentsRes.data.length);
      setResults(resultsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.role !== "teacher") {
        window.location.href = "/login";
        return;
      }

      setUserInfo({
        id: decoded.id,
        name: decoded.name || "Teacher",
        role: decoded.role,
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (!userInfo) return;
    fetchData();
  }, [userInfo]);

  // Calculate average marks
  const averageMarks =
    results.length > 0
      ? results.reduce((sum, result) => sum + result.marks, 0) / results.length
      : 0;

  // Count of results per subject
  const subjectCounts = results.reduce((acc, result) => {
    acc[result.subject] = (acc[result.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading)
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
          <Skeleton className="h-32 rounded-lg" />
        </div>
      </div>
    );

  if (!userInfo || userInfo.role !== "teacher") return <div>Access denied</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
      <p className="text-gray-600">Welcome back, {userInfo.name}</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Students Count Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentsCount}</div>
            <p className="text-xs text-muted-foreground">
              Students assigned to you
            </p>
          </CardContent>
        </Card>

        {/* Results Count Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results Recorded</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v4" />
              <path d="m16.2 7.8 2.9-2.9" />
              <path d="M18 12h4" />
              <path d="m16.2 16.2 2.9 2.9" />
              <path d="M12 18v4" />
              <path d="m4.9 19.1 2.9-2.9" />
              <path d="M2 12h4" />
              <path d="m4.9 4.9 2.9 2.9" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">
              Total results you've entered
            </p>
          </CardContent>
        </Card>

        {/* Average Marks Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Marks</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v4" />
              <path d="m16.2 7.8 2.9-2.9" />
              <path d="M18 12h4" />
              <path d="m16.2 16.2 2.9 2.9" />
              <path d="M12 18v4" />
              <path d="m4.9 19.1 2.9-2.9" />
              <path d="M2 12h4" />
              <path d="m4.9 4.9 2.9 2.9" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMarks.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Average across all subjects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Distribution Card */}
      <Card>
        <CardHeader>
          <CardTitle>Results by Subject</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(subjectCounts).length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(subjectCounts).map(([subject, count]) => (
                <div key={subject} className="border rounded-lg p-4">
                  <h3 className="font-medium">{subject}</h3>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-sm text-muted-foreground">results</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No results recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDashboard;