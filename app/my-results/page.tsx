"use client";
import { BookOpen, Award, BarChart2, Calendar, Filter, Search, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

interface Result {
  id: string;
  subject: string;
  marks: number;
  total: number;
  grade: string;
  date: string;
  teacher: string;
}

interface UserToken {
  id: string;
  email: string;
  role: string;
  name?: string;
}

const MyResults = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<UserToken>(token);
      setUser(decoded);
      if (decoded.role !== "student") {
        router.push("/dashboard");
        return;
      }
      fetchStudentResults(decoded.id);
    } catch (error) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  const fetchStudentResults = async (studentId: string) => {
    try {
      const response = await axios.get(`https://sl-backend-nine.vercel.app/api/student/${studentId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const reversedData = [...response.data].reverse();
      const formattedResults = reversedData.map((result: any) => ({
        id: result._id,
        subject: result.subject,
        marks: result.marks,
        total: 100,
        grade: calculateGrade(result.marks),
        date: new Date(result.date).toISOString().split("T")[0],
        teacher: result.teacher?.name || "Teacher",
      }));
      setResults(formattedResults);
    } catch (error) {
      console.error("Failed to fetch results:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B+";
    if (marks >= 60) return "B";
    if (marks >= 50) return "C+";
    if (marks >= 40) return "C";
    return "F";
  };

  const getPerformanceComment = (marks: number): string => {
    if (marks >= 90) return "Exceptional mastery of the subject material with outstanding critical thinking skills";
    if (marks >= 80) return "Excellent comprehension and application of course concepts";
    if (marks >= 70) return "Strong understanding of fundamental principles with room for growth";
    if (marks >= 60) return "Adequate grasp of basic concepts, would benefit from additional practice";
    if (marks >= 50) return "Developing understanding, requires more engagement with the material";
    return "Needs significant improvement, please consult with instructor for support";
  };

  const generateSinglePDF = (result: Result) => {
    if (!user) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Certificate border
    doc.setDrawColor(100, 100, 255);
    doc.setLineWidth(2);
    doc.rect(15, 15, pageWidth - 30, doc.internal.pageSize.height - 30);
    
    // School logo/header (placeholder)
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 200);
    doc.setFont("helvetica", "bold");
    doc.text("Prestige Academy", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("Center for Academic Excellence", pageWidth / 2, 32, { align: "center" });
    
    // Certificate title
    doc.setFontSize(24);
    doc.setTextColor(50, 50, 200);
    doc.setFont("helvetica", "bold");
    doc.text("ACADEMIC ACHIEVEMENT CERTIFICATE", pageWidth / 2, 50, { align: "center" });
    
    // Decorative elements
    doc.setDrawColor(200, 200, 255);
    doc.setLineWidth(0.5);
    doc.line(50, 55, pageWidth - 50, 55);
    
    // Student recognition text
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("This official certificate recognizes that", pageWidth / 2, 70, { align: "center" });
    
    // Student name
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(user.name || "Student Name", pageWidth / 2, 85, { align: "center" });
    
    // Achievement text
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.setFont("helvetica", "normal");
    doc.text("has demonstrated academic excellence in", pageWidth / 2, 100, { align: "center" });
    
    // Subject with decorative box
    doc.setFillColor(240, 240, 255);
    doc.roundedRect(60, 110, pageWidth - 120, 20, 3, 3, 'F');
    doc.setFontSize(18);
    doc.setTextColor(50, 50, 200);
    doc.setFont("helvetica", "bold");
    doc.text(result.subject.toUpperCase(), pageWidth / 2, 125, { align: "center" });
    
    // Grade and marks
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Achieving a grade of ${result.grade} with ${result.marks} out of ${result.total} possible marks`, pageWidth / 2, 145, { align: "center" });
    
    // Performance assessment
    doc.setFontSize(12);
    doc.text("Performance Assessment:", pageWidth / 2, 160, { align: "center" });
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(getPerformanceComment(result.marks), pageWidth - 60);
    doc.text(splitText, pageWidth / 2, 170, { align: "center" });
    
    // Exam date
    doc.setFontSize(10);
    doc.text(`Examination Date: ${new Date(result.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pageWidth / 2, 190, { align: "center" });
    
    // Signatures
    const signatureY = 220;
    doc.setFontSize(10);
    doc.text("Certified by:", 50, signatureY);
    doc.line(50, signatureY + 2, 100, signatureY + 2);
    doc.setFont("helvetica", "bold");
    doc.text(result.teacher, 50, signatureY + 10);
    doc.setFont("helvetica", "normal");
    doc.text("Subject Instructor", 50, signatureY + 15);
    
    doc.text("Verified by:", pageWidth - 70, signatureY);
    doc.line(pageWidth - 70, signatureY + 2, pageWidth - 30, signatureY + 2);
    doc.text("Prestige Academy Administration", pageWidth - 70, signatureY + 10);
    
    // Certificate ID
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Certificate ID: ${result.id.slice(0, 8)}`, pageWidth - 20, doc.internal.pageSize.height - 20, { align: "right" });
    
    doc.save(`${user.name || 'Student'}_${result.subject}_Certificate.pdf`);
  };

  const generatePDF = () => {
    if (!user || results.length === 0) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Certificate border
    doc.setDrawColor(100, 100, 255);
    doc.setLineWidth(2);
    doc.rect(15, 15, pageWidth - 30, doc.internal.pageSize.height - 30);
    
    // School header
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 200);
    doc.setFont("helvetica", "bold");
    doc.text("Prestige Academy", pageWidth / 2, 25, { align: "center" });
    doc.setFontSize(10);
    doc.text("Comprehensive Academic Record", pageWidth / 2, 32, { align: "center" });
    
    // Certificate title
    doc.setFontSize(20);
    doc.setTextColor(50, 50, 200);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL ACADEMIC TRANSCRIPT", pageWidth / 2, 50, { align: "center" });
    
    // Student information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Student Name: ${user.name || "Not Provided"}`, 30, 70);
    doc.text(`Issue Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 30, 80);
    
    // Academic summary
    const averageMarks = (results.reduce((sum, result) => sum + result.marks, 0) / results.length).toFixed(1);
    doc.setFont("helvetica", "bold");
    doc.text("Academic Summary:", 30, 95);
    doc.setFont("helvetica", "normal");
    doc.text(`Cumulative Average: ${averageMarks}%`, 40, 105);
    doc.text(`Total Subjects Completed: ${results.length}`, 40, 115);
    
    // Subjects header
    doc.setFont("helvetica", "bold");
    doc.text("Subject Performance Details", pageWidth / 2, 135, { align: "center" });
    
    // Subjects list
    let yPosition = 145;
    results.forEach((result, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
        doc.setDrawColor(100, 100, 255);
        doc.setLineWidth(2);
        doc.rect(15, 15, pageWidth - 30, doc.internal.pageSize.height - 30);
      }
      
      doc.setFontSize(12);
      doc.setTextColor(50, 50, 200);
      doc.setFont("helvetica", "bold");
      doc.text(`${result.subject}:`, 30, yPosition);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(`${result.marks}/${result.total} (${result.grade}) - ${getPerformanceComment(result.marks)}`, 70, yPosition);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Assessed by: ${result.teacher} on ${result.date}`, 70, yPosition + 5);
      
      yPosition += 15;
    });
    
    // Signatures
    const signatureY = yPosition + 20;
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Certifying Instructor:", 50, signatureY);
    doc.line(50, signatureY + 2, 100, signatureY + 2);
    
    doc.text("Academic Registrar:", pageWidth - 70, signatureY);
    doc.line(pageWidth - 70, signatureY + 2, pageWidth - 30, signatureY + 2);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This document is the official property of Prestige Academy", pageWidth / 2, doc.internal.pageSize.height - 20, { align: "center" });
    
    doc.save(`${user.name || 'Student'}_Academic_Transcript.pdf`);
  };

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!user) return <div className="container mx-auto px-4 py-8">Not authorized</div>;

  const averageMarks = (results.reduce((sum, result) => sum + result.marks, 0) / results.length).toFixed(1);
  
  const highestSubject = results.reduce((prev, current) => {
    if (!prev || current.marks > prev.marks) {
      return current;
    }
    return prev;
  }, results[0]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Results</h1>
          <p className="text-muted-foreground">View and analyze your academic performance</p>
        </div>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Average Score</p>
              <h3 className="text-2xl font-bold">{averageMarks}%</h3>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Best Subject</p>
              <h3 className="text-2xl font-bold">{highestSubject?.subject || "N/A"}</h3>
              <p className="text-sm text-muted-foreground">
                {highestSubject?.marks || 0}% ({highestSubject?.grade || "N/A"})
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <Award className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Subjects</p>
              <h3 className="text-2xl font-bold">{results.length}</h3>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search subjects..." className="pl-10 w-full md:w-[300px]" />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Date
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.id}>
                <TableCell className="font-medium">{result.subject}</TableCell>
                <TableCell>{result.marks}/{result.total}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    result.grade.startsWith("A") ? "bg-green-100 text-green-800" :
                    result.grade.startsWith("B") ? "bg-blue-100 text-blue-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {result.grade}
                  </span>
                </TableCell>
                <TableCell>{result.date}</TableCell>
                <TableCell>{result.teacher}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => generateSinglePDF(result)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default MyResults;