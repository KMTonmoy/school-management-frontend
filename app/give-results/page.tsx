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
}

interface Assignment {
  _id: string;
  student: Student;
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

const GiveResults = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [existingResults, setExistingResults] = useState<Result[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resultToDelete, setResultToDelete] = useState<string | null>(null);
  const [editingResult, setEditingResult] = useState<Result | null>(null);
  const [newResult, setNewResult] = useState({
    studentId: "",
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

  const fetchData = async () => {
    try {
      const [assignmentsRes, resultsRes] = await Promise.all([
        axios.get<Assignment[]>("http://localhost:8000/api/teacher/students", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get<Result[]>("http://localhost:8000/api/teacher", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      setAssignments(assignmentsRes.data);
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
      case "A+":
        return "bg-green-100 text-green-800";
      case "A":
        return "bg-green-50 text-green-700";
      case "B":
        return "bg-blue-50 text-blue-700";
      case "C":
        return "bg-yellow-50 text-yellow-700";
      case "D":
        return "bg-orange-50 text-orange-700";
      default:
        return "bg-red-50 text-red-700";
    }
  };

  const handleNewResultChange = (field: string, value: string) => {
    setNewResult((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditResult = (result: Result) => {
    setEditingResult(result);
    setNewResult({
      studentId: result.student._id,
      subject: result.subject,
      marks: result.marks.toString(),
    });
    setShowModal(true);
  };

  const submitResult = async () => {
    if (!newResult.studentId || !newResult.subject || !newResult.marks) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const marksNum = parseInt(newResult.marks);
      if (isNaN(marksNum) || marksNum < 0 || marksNum > 100) {
        toast.error("Please enter valid marks (0-100)");
        return;
      }

      const promise = editingResult
        ? axios.patch(
            `http://localhost:8000/api/results/${editingResult._id}`,
            {
              studentId: newResult.studentId,
              subject: newResult.subject,
              marks: marksNum,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
        : axios.post(
            "http://localhost:8000/api/add-result",
            {
              studentId: newResult.studentId,
              subject: newResult.subject,
              marks: marksNum,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

      toast.promise(promise, {
        loading: editingResult ? "Updating result..." : "Adding result...",
        success: () => {
          fetchData();
          setShowModal(false);
          setEditingResult(null);
          setNewResult({ studentId: "", subject: "", marks: "" });
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
        `http://localhost:8000/api/results/${resultToDelete}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
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
  if (!userInfo || userInfo.role !== "teacher") return <div>Access denied</div>;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Welcome, {userInfo.name}</CardTitle>
            <Button onClick={() => setShowModal(true)}>Add New Result</Button>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Student Results</h3>
          {existingResults.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {existingResults.map((result) => (
                    <TableRow key={result._id}>
                      <TableCell className="font-medium">
                        {result.student.name}
                      </TableCell>
                      <TableCell>{result.subject}</TableCell>
                      <TableCell>{result.marks}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getGradeColor(
                            calculateGrade(result.marks)
                          )}
                        >
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
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500">No results entered yet</p>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          if (!open) {
            setEditingResult(null);
            setNewResult({ studentId: "", subject: "", marks: "" });
          }
          setShowModal(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingResult ? "Edit Result" : "Add New Result"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student</label>
              <Select
                value={newResult.studentId}
                onValueChange={(value) =>
                  handleNewResultChange("studentId", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {assignments.map((assignment) => (
                    <SelectItem
                      key={assignment.student._id}
                      value={assignment.student._id}
                    >
                      {assignment.student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <Select
                value={newResult.subject}
                onValueChange={(value) =>
                  handleNewResultChange("subject", value)
                }
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
                Marks (0-100)
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
                <Badge
                  variant="outline"
                  className={getGradeColor(
                    calculateGrade(parseInt(newResult.marks))
                  )}
                >
                  {calculateGrade(parseInt(newResult.marks))}
                </Badge>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setEditingResult(null);
                  setNewResult({ studentId: "", subject: "", marks: "" });
                }}
              >
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
              This action cannot be undone. This will permanently delete the
              result record.
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

export default GiveResults;
