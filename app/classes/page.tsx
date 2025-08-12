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

type User = {
  id: string
  email: string
  role: 'ADMIN' | 'TEACHER' | 'STUDENT'
  firstName: string
  lastName: string
}

type Class = {
  id: string
  name: string
  teacherId: string
  studentIds: string[]
}

type Result = {
  id: string
  studentId: string
  subject: string
  marks: number
  grade: string
}

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [results, setResults] = useState<Result[]>([])
  const [currentClass, setCurrentClass] = useState<Class | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [className, setClassName] = useState('')
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Mock data initialization
  useEffect(() => {
    const mockUsers: User[] = [
      { id: '1', email: 'admin@school.edu', role: 'ADMIN', firstName: 'Admin', lastName: 'User' },
      { id: '2', email: 'teacher@school.edu', role: 'TEACHER', firstName: 'Jane', lastName: 'Smith' },
      { id: '3', email: 'student1@school.edu', role: 'STUDENT', firstName: 'John', lastName: 'Doe' },
      { id: '4', email: 'student2@school.edu', role: 'STUDENT', firstName: 'Alice', lastName: 'Johnson' },
    ]

    const mockClasses: Class[] = [
      { id: '1', name: 'Math 101', teacherId: '2', studentIds: ['3', '4'] },
    ]

    const mockResults: Result[] = [
      { id: '1', studentId: '3', subject: 'Math', marks: 85, grade: 'A' },
      { id: '2', studentId: '4', subject: 'Math', marks: 92, grade: 'A+' },
    ]

    setUsers(mockUsers)
    setClasses(mockClasses)
    setResults(mockResults)
    setCurrentUser(mockUsers[0]) // Simulate admin logged in
  }, [])

  const getFilteredClasses = () => {
    if (!currentUser) return []
    
    if (currentUser.role === 'ADMIN') return classes
    if (currentUser.role === 'TEACHER') return classes.filter(c => c.teacherId === currentUser.id)
    if (currentUser.role === 'STUDENT') return classes.filter(c => c.studentIds.includes(currentUser.id))
    
    return []
  }

  const getFilteredStudents = () => {
    if (!currentUser) return []
    
    if (currentUser.role === 'ADMIN') return users.filter(u => u.role === 'STUDENT')
    if (currentUser.role === 'TEACHER') {
      const teacherClasses = classes.filter(c => c.teacherId === currentUser.id)
      const studentIds = teacherClasses.flatMap(c => c.studentIds)
      return users.filter(u => studentIds.includes(u.id))
    }
    if (currentUser.role === 'STUDENT') return users.filter(u => u.id === currentUser.id)
    
    return []
  }

  const getFilteredResults = () => {
    if (!currentUser) return []
    
    if (currentUser.role === 'ADMIN') return results
    if (currentUser.role === 'TEACHER') {
      const teacherClasses = classes.filter(c => c.teacherId === currentUser.id)
      const studentIds = teacherClasses.flatMap(c => c.studentIds)
      return results.filter(r => studentIds.includes(r.studentId))
    }
    if (currentUser.role === 'STUDENT') return results.filter(r => r.studentId === currentUser.id)
    
    return []
  }

  const calculateGrade = (marks: number): string => {
    if (marks >= 90) return 'A+'
    if (marks >= 80) return 'A'
    if (marks >= 70) return 'B'
    if (marks >= 60) return 'C'
    if (marks >= 50) return 'D'
    return 'F'
  }

  const handleSubmitClass = () => {
    if (!className || !selectedTeacher) return

    const classData = {
      id: currentClass?.id || Date.now().toString(),
      name: className,
      teacherId: selectedTeacher,
      studentIds: selectedStudents,
    }

    if (currentClass) {
      setClasses(classes.map(c => c.id === currentClass.id ? classData : c))
    } else {
      setClasses([...classes, classData])
    }

    resetForm()
  }

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
  }

  const handleAddResult = (studentId: string, subject: string, marks: number) => {
    const grade = calculateGrade(marks)
    setResults([...results, {
      id: Date.now().toString(),
      studentId,
      subject,
      marks,
      grade,
    }])
  }

  const handleUpdateResult = (id: string, marks: number) => {
    const grade = calculateGrade(marks)
    setResults(results.map(r => r.id === id ? { ...r, marks, grade } : r))
  }

  const resetForm = () => {
    setClassName('')
    setSelectedTeacher('')
    setSelectedStudents([])
    setCurrentClass(null)
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Class Management</h1>
        {currentUser?.role === 'ADMIN' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentClass(null)}>
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {currentClass ? 'Edit Class' : 'Create New Class'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Class Name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
                <Select
                  value={selectedTeacher}
                  onValueChange={setSelectedTeacher}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'TEACHER').map(teacher => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value=""
                  onValueChange={(value) => {
                    if (value && !selectedStudents.includes(value)) {
                      setSelectedStudents([...selectedStudents, value])
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add Students" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.role === 'STUDENT').map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2">
                  {selectedStudents.map(studentId => {
                    const student = users.find(u => u.id === studentId)
                    return student ? (
                      <div key={studentId} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                        <span>{student.firstName} {student.lastName}</span>
                        <button
                          onClick={() => setSelectedStudents(selectedStudents.filter(id => id !== studentId))}
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ) : null
                  })}
                </div>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitClass}>
                    {currentClass ? 'Update' : 'Create'} Class
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Classes</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Name</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Students</TableHead>
                {currentUser?.role === 'ADMIN' && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredClasses().map((cls) => {
                const teacher = users.find(u => u.id === cls.teacherId)
                return (
                  <TableRow key={cls.id}>
                    <TableCell>{cls.name}</TableCell>
                    <TableCell>
                      {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {cls.studentIds.map(studentId => {
                          const student = users.find(u => u.id === studentId)
                          return student ? (
                            <span key={studentId} className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                              {student.firstName} {student.lastName}
                            </span>
                          ) : null
                        })}
                      </div>
                    </TableCell>
                    {currentUser?.role === 'ADMIN' && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentClass(cls)
                              setClassName(cls.name)
                              setSelectedTeacher(cls.teacherId)
                              setSelectedStudents(cls.studentIds)
                              setIsDialogOpen(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500"
                            onClick={() => handleDeleteClass(cls.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Students</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredStudents().map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'STUDENT' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                {(currentUser?.role === 'ADMIN' || currentUser?.role === 'TEACHER') && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {getFilteredResults().map((result) => {
                const student = users.find(u => u.id === result.studentId)
                return (
                  <TableRow key={result.id}>
                    <TableCell>
                      {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
                    </TableCell>
                    <TableCell>{result.subject}</TableCell>
                    <TableCell>{result.marks}</TableCell>
                    <TableCell>{result.grade}</TableCell>
                    {(currentUser?.role === 'ADMIN' || currentUser?.role === 'TEACHER') && (
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newMarks = prompt('Enter new marks', result.marks.toString())
                            if (newMarks) {
                              handleUpdateResult(result.id, parseInt(newMarks))
                            }
                          }}
                        >
                          Update
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  )
}