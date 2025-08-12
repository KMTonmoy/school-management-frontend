"use client";
import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, User, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
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
import { UserForm } from "@/components/UserForm";

type User = {
  id: string;
  email: string;
  role: "STUDENT" | "TEACHER";
  firstName: string;
  lastName: string;
  phone: string;
  guardianPhone?: string;
  address?: string;
};

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "ALL" | "STUDENT" | "TEACHER"
  >("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Mock data - replace with API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "student1@school.edu",
        role: "STUDENT",
        firstName: "John",
        lastName: "Doe",
        phone: "1234567890",
        guardianPhone: "9876543210",
        address: "123 Main St",
      },
      {
        id: "2",
        email: "teacher1@school.edu",
        role: "TEACHER",
        firstName: "Jane",
        lastName: "Smith",
        phone: "5551234567",
      },
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    let result = users;
    if (selectedRole !== "ALL") {
      result = result.filter((user) => user.role === selectedRole);
    }
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredUsers(result);
  }, [searchTerm, selectedRole, users]);

  const handleDelete = (id: string) => {
    // Add confirmation dialog and API call
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (user: User) => {
    setCurrentUser(user);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setCurrentUser(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = (userData: Omit<User, "id">) => {
    if (currentUser) {
      // Update existing user
      setUsers(
        users.map((u) => (u.id === currentUser.id ? { ...u, ...userData } : u))
      );
    } else {
      // Create new user
      const newUser = { ...userData, id: Math.random().toString() };
      setUsers([...users, newUser]);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {currentUser ? "Edit User" : "Create New User"}
              </DialogTitle>
            </DialogHeader>
            <UserForm onSubmit={handleSubmit} initialData={currentUser} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedRole === "ALL" ? "default" : "outline"}
            onClick={() => setSelectedRole("ALL")}
          >
            All
          </Button>
          <Button
            variant={selectedRole === "STUDENT" ? "default" : "outline"}
            onClick={() => setSelectedRole("STUDENT")}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Students
          </Button>
          <Button
            variant={selectedRole === "TEACHER" ? "default" : "outline"}
            onClick={() => setSelectedRole("TEACHER")}
            className="flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            Teachers
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>A list of all registered users.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Guardian Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    user.role === "STUDENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.guardianPhone || "-"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersPage;
