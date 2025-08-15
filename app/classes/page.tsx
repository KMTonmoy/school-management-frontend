"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import axios from "axios";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  isBlocked: boolean;
};

type Assignment = {
  _id: string;
  teacher: User;
  student: User;
  assignedAt: string;
  assignedBy: User;
};

const API_BASE_URL = "http://localhost:8000/api";

export default function AssignmentManager() {
  const [teachers, setTeachers] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user role from localStorage
  const currentUserRole =
    typeof window !== "undefined"
      ? (localStorage.getItem("role") as "admin" | "teacher" | "student")
      : null;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch teachers and students without token
      const [teachersRes, studentsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/teachers`),
        axios.get(`${API_BASE_URL}/students`),
      ]);

      setTeachers(teachersRes.data);
      setStudents(studentsRes.data);

      // Fetch assignments with token if available
      const token = localStorage.getItem("token");
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };
        const assignmentsRes = await axios.get(
          `${API_BASE_URL}/assign/assignments`,
          { headers }
        );
        setAssignments(assignmentsRes.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStudents = async () => {
    if (!selectedTeacher || selectedStudents.length === 0) {
      toast.warning("Please select both teacher and students");
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Always use bulk assignment endpoint for simplicity
      const response = await axios.post(
        `${API_BASE_URL}/assign/bulk`,
        {
          teacherId: selectedTeacher,
          studentIds: selectedStudents,
        },
        { headers }
      );

      if (response.data.success) {
        await fetchData(); // Refresh data
        toast.success(`Assigned ${response.data.assignedCount} students`);
      } else {
        toast.warning(`Some assignments failed: ${response.data.message}`);
      }

      setIsDialogOpen(false);
      setSelectedTeacher("");
      setSelectedStudents([]);
    } catch (error) {
      toast.error("Assignment failed. Please log in as admin.");
      console.error("Error assigning students:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassignStudent = async (assignmentId: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${API_BASE_URL}/assignment/${assignmentId}`);

      setAssignments(assignments.filter((a) => a._id !== assignmentId));
      toast.success("Student unassigned successfully");
    } catch (error) {
      toast.error("Unassignment failed. Please log in as admin.");
      console.error("Error unassigning student:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student-Teacher Assignments</h1>
        {currentUserRole === "admin" && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Assign Students</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Students to Teacher</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select
                  value={selectedTeacher}
                  onValueChange={setSelectedTeacher}
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
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !selectedStudents.includes(value)) {
                      setSelectedStudents([...selectedStudents, value]);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add Students" />
                  </SelectTrigger>
                  <SelectContent>
                    {students
                      .filter((student) => !student.isBlocked)
                      .map((student) => (
                        <SelectItem key={student._id} value={student._id}>
                          {student.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {selectedStudents.map((studentId) => {
                    const student = students.find((s) => s._id === studentId);
                    return student ? (
                      <div
                        key={studentId}
                        className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                      >
                        <span>{student.name}</span>
                        <button
                          onClick={() =>
                            setSelectedStudents(
                              selectedStudents.filter((id) => id !== studentId)
                            )
                          }
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      setSelectedTeacher("");
                      setSelectedStudents([]);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAssignStudents} disabled={isLoading}>
                    {isLoading ? "Assigning..." : "Assign Students"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Current Assignments</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Assigned At</TableHead>
                {currentUserRole === "admin" && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment._id}>
                  <TableCell>{assignment.teacher?.name}</TableCell>
                  <TableCell>{assignment.student?.name}</TableCell>
                  <TableCell>
                    {new Date(assignment.assignedAt).toLocaleString()}
                  </TableCell>
                  {currentUserRole === "admin" && (
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500"
                        onClick={() => handleUnassignStudent(assignment._id)}
                        disabled={isLoading}
                      >
                        Unassign
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
