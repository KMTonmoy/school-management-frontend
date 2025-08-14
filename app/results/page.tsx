'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthRedirect } from '@/Hooks/useAuthRedirect'

type User = {
  id: string
  firstName: string
  lastName: string
  role: 'STUDENT' | 'TEACHER'
}

type Result = {
  id: string
  studentId: string
  subject: string
  marks: number
  grade: string
}

export default function Result() {
  const [results, setResults] = useState<Result[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [currentResult, setCurrentResult] = useState<Result | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [marks, setMarks] = useState('')
  const [selectedStudent, setSelectedStudent] = useState('')

  useEffect(() => {
    const mockStudents: User[] = [
      { id: '1', firstName: 'John', lastName: 'Doe', role: 'STUDENT' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', role: 'STUDENT' },
    ]

    const mockResults: Result[] = [
      { id: '1', studentId: '1', subject: 'Math', marks: 85, grade: 'A' },
      { id: '2', studentId: '2', subject: 'Science', marks: 92, grade: 'A+' },
    ]

    setStudents(mockStudents)
    setResults(mockResults)
  }, [])

  const calculateGrade = (marks: number): string => {
    if (marks >= 97) return 'A+'
    if (marks >= 93) return 'A'
    if (marks >= 90) return 'A-'
    if (marks >= 87) return 'B+'
    if (marks >= 83) return 'B'
    if (marks >= 80) return 'B-'
    if (marks >= 77) return 'C+'
    if (marks >= 73) return 'C'
    if (marks >= 70) return 'C-'
    if (marks >= 67) return 'D+'
    if (marks >= 63) return 'D'
    if (marks >= 33) return 'D-'
    return 'F'
  }

  const getGradeColor = (grade: string): string => {
    switch(grade) {
      case 'A+': return 'bg-green-100 text-green-800'
      case 'A': return 'bg-green-50 text-green-700'
      case 'A-': return 'bg-green-50 text-green-600'
      case 'B+': return 'bg-blue-100 text-blue-800'
      case 'B': return 'bg-blue-50 text-blue-700'
      case 'B-': return 'bg-blue-50 text-blue-600'
      case 'C+': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-yellow-50 text-yellow-700'
      case 'C-': return 'bg-yellow-50 text-yellow-600'
      case 'D+': return 'bg-orange-100 text-orange-800'
      case 'D': return 'bg-orange-50 text-orange-700'
      case 'D-': return 'bg-orange-50 text-orange-600'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmitResult = () => {
    if (!selectedStudent || !subject || !marks) return

    const marksNum = parseInt(marks)
    const grade = calculateGrade(marksNum)

    const resultData = {
      id: currentResult?.id || Date.now().toString(),
      studentId: selectedStudent,
      subject,
      marks: marksNum,
      grade,
    }

    if (currentResult) {
      setResults(results.map(r => r.id === currentResult.id ? resultData : r))
    } else {
      setResults([...results, resultData])
    }

    resetForm()
  }

  const handleDeleteResult = (id: string) => {
    setResults(results.filter(r => r.id !== id))
  }

  const resetForm = () => {
    setSubject('')
    setMarks('')
    setSelectedStudent('')
    setCurrentResult(null)
    setIsDialogOpen(false)
  }
useAuthRedirect();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Result Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentResult(null)}>
              Add Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {currentResult ? 'Edit Result' : 'Add New Result'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Student</Label>
                <Select
                  value={selectedStudent}
                  onValueChange={setSelectedStudent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Subject</Label>
                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label>Marks</Label>
                <Input
                  type="number"
                  placeholder="Marks (0-100)"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>

              {marks && (
                <div className="flex items-center gap-2">
                  <span>Grade:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getGradeColor(calculateGrade(parseInt(marks)))}`}>
                    {calculateGrade(parseInt(marks))}
                  </span>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitResult}>
                  {currentResult ? 'Update' : 'Add'} Result
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Marks</TableHead>
            <TableHead>Grade</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {results.map((result) => {
            const student = students.find(s => s.id === result.studentId)
            return (
              <TableRow key={result.id}>
                <TableCell>
                  {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
                </TableCell>
                <TableCell>{result.subject}</TableCell>
                <TableCell>{result.marks}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${getGradeColor(result.grade)}`}>
                    {result.grade}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentResult(result)
                        setSelectedStudent(result.studentId)
                        setSubject(result.subject)
                        setMarks(result.marks.toString())
                        setIsDialogOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDeleteResult(result.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-sm font-medium mb-1">{children}</label>
)