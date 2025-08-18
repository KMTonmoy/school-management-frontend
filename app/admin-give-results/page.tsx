"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: string;
  email: string;
  class?: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface Result {
  _id: string;
  student: Student;
  teacher?: Teacher;
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

const ManageResults = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [existingResults, setExistingResults] = useState<Result[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<string | null>(null);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [newResult, setNewResult] = useState({
    studentId: "",
    teacherId: "",
    subject: "",
    marks: "",
  });
  const [loading, setLoading] = useState(true);
  const [subjects] = useState(["Math", "Science", "English", "History"]);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    name: string;
    role: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");

  const fetchData = async () => {
    try {
      const [studentsRes, teachersRes, resultsRes] = await Promise.all([
        axios.get<Student[]>("https://sl-backend-nine.vercel.app/api/students", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get<Teacher[]>("https://sl-backend-nine.vercel.app/api/teachers", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get<Result[]>("https://sl-backend-nine.vercel.app/api/all-results", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
      setExistingResults(resultsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
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
      if (decoded.role !== "admin") {
        window.location.href = "/login";
        return;
      }

      setUserInfo({
        id: decoded.id,
        name: decoded.name || "Admin",
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

  const calculateGrade = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A+": return "bg-green-100 text-green-800";
      case "A": return "bg-green-50 text-green-700";
      case "B": return "bg-blue-50 text-blue-700";
      case "C": return "bg-yellow-50 text-yellow-700";
      case "D": return "bg-orange-50 text-orange-700";
      default: return "bg-red-50 text-red-700";
    }
  };

  const handleNewResultChange = (field: string, value: string) => {
    setNewResult((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setNewResult({
      studentId: result.student._id,
      teacherId: result.teacher?._id || "",
      subject: result.subject,
      marks: result.marks.toString(),
    });
    setShowModal(true);
  };

  const filteredResults = existingResults.filter((result) => {
    const matchesSearch =
      result.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (result.student?.class?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.teacher?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject =
      filterSubject === "all" || result.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const submitResult = async () => {
    if (!newResult.studentId || !newResult.subject || !newResult.marks) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const marksNum = parseInt(newResult.marks);
      if (isNaN(marksNum) ){
        toast.error("Please enter valid marks");
        return;
      }

      const payload = {
        studentId: newResult.studentId,
        teacherId: newResult.teacherId || undefined,
        subject: newResult.subject,
        marks: marksNum,
      };

      const promise = editingResult
        ? axios.patch(`https://sl-backend-nine.vercel.app/api/admin/${editingResult._id}`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          })
        : axios.post("https://sl-backend-nine.vercel.app/api/admin", payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });

      toast.promise(promise, {
        loading: editingResult ? "Updating result..." : "Adding result...",
        success: () => {
          fetchData();
          setShowModal(false);
          setEditingResult(null);
          setNewResult({
            studentId: "",
            teacherId: "",
            subject: "",
            marks: "",
          });
          return editingResult ? "Result updated!" : "Result added!";
        },
        error: "Failed to save result",
      });
    } catch (error) {
      console.error("Error saving result:", error);
      toast.error("Failed to save result");
    }
  };

  const confirmDelete = (resultId: string) => {
    setResultToDelete(resultId);
    setShowDeleteModal(true);
  };

  const deleteResult = async () => {
    if (!resultToDelete) return;

    try {
      const promise = axios.delete(
        `https://sl-backend-nine.vercel.app/api/admin/${resultToDelete}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      toast.promise(promise, {
        loading: "Deleting result...",
        success: () => {
          fetchData();
          return "Result deleted!";
        },
        error: "Failed to delete result",
      });
    } catch (error) {
      console.error("Error deleting result:", error);
      toast.error("Failed to delete result");
    } finally {
      setShowDeleteModal(false);
      setResultToDelete(null);
    }
  };

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (!userInfo || userInfo.role !== "admin") return <div>Access denied</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Welcome, {userInfo.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <Button onClick={() => setShowModal(true)}>Add New Result</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search by student name, class, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterSubject}
              onValueChange={(value) => setFilterSubject(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell className="font-medium">
                        {result.student?.name || "Unknown"}
                      </TableCell>
                      <TableCell>{result.student?.class || "-"}</TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.teacher?.name || "Not assigned"}</TableCell>
                      <TableCell>{result.marks}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getGradeColor(calculateGrade(result.marks))}>
                          {calculateGrade(result.marks)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(result.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditResult(result)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => confirmDelete(result._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingResult ? "Edit Result" : "Add New Result"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Student <span className="text-red-500">*</span>
              </label>
              <Select
                value={newResult.studentId}
                onValueChange={(value) => handleNewResultChange("studentId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name} {student.class && `(${student.class})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <Select
                value={newResult.teacherId}
                onValueChange={(value) => handleNewResultChange("teacherId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher._id} value={teacher._id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <Select
                value={newResult.subject}
                onValueChange={(value) => handleNewResultChange("subject", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Marks (0-100) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={newResult.marks}
                onChange={(e) => handleNewResultChange("marks", e.target.value)}
              />
            </div>

            {newResult.marks && (
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Grade:</span>
                <Badge variant="outline" className={getGradeColor(calculateGrade(parseInt(newResult.marks)))}>
                  {calculateGrade(parseInt(newResult.marks))}
                </Badge>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={submitResult}>
                {editingResult ? "Update" : "Save"} Result
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the result record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteResult}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManageResults;