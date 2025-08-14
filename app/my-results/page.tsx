"use client";
import {
  BookOpen,
  Award,
  BarChart2,
  Calendar,
  Filter,
  Search,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyResults = () => {
  // Sample results data
  const results = [
    {
      id: 1,
      subject: "Mathematics",
      marks: 85,
      total: 100,
      grade: "A",
      date: "2023-11-15",
      teacher: "Mr. Smith",
    },
    {
      id: 2,
      subject: "Science",
      marks: 78,
      total: 100,
      grade: "B+",
      date: "2023-11-18",
      teacher: "Ms. Johnson",
    },
    {
      id: 3,
      subject: "English",
      marks: 92,
      total: 100,
      grade: "A+",
      date: "2023-11-20",
      teacher: "Mr. Williams",
    },
    {
      id: 4,
      subject: "History",
      marks: 65,
      total: 100,
      grade: "C",
      date: "2023-11-22",
      teacher: "Ms. Brown",
    },
  ];

  // Calculate overall performance
  const averageMarks = (
    results.reduce((sum, result) => sum + result.marks, 0) / results.length
  ).toFixed(1);
  const highestSubject = results.reduce((prev, current) =>
    prev.marks > current.marks ? prev : current
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Results</h1>
          <p className="text-muted-foreground">
            View and analyze your academic performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </div>

      {/* Performance Overview Cards */}
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
              <h3 className="text-2xl font-bold">{highestSubject.subject}</h3>
              <p className="text-sm text-muted-foreground">
                {highestSubject.marks}% ({highestSubject.grade})
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

      {/* Results Table */}
      <Card>
        <div className="p-4 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search subjects..."
              className="pl-10 w-full md:w-[300px]"
            />
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
                <TableCell>
                  {result.marks}/{result.total}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      result.grade.startsWith("A")
                        ? "bg-green-100 text-green-800"
                        : result.grade.startsWith("B")
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {result.grade}
                  </span>
                </TableCell>
                <TableCell>{result.date}</TableCell>
                <TableCell>{result.teacher}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
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
