"use client";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/user";
import { UserCards } from "./admin/UserCards";
import { UserTable } from "./admin/UserTable";
import { UserPagination } from "./admin/UserPagination";
import { UserForm } from "./admin/UserForm";

const ITEMS_PER_PAGE = 10;

export const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "admin" | "teacher" | "student"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [displayCounts, setDisplayCounts] = useState({
    total: 0,
    teachers: 0,
    students: 0,
    admins: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student" as "admin" | "teacher" | "student",
    password: "",
    class: "",
    subjects: [] as string[],
    guardian: {
      name: "",
      relation: "",
      primaryContact: "",
    },
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>("http://localhost:8000/api/users");
        setUsers(response.data);
        animateCounts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.role === "student" &&
          user.class?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.role === "teacher" &&
          user.subjects
            ?.join(", ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (user.role === "student" &&
          user.guardian?.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const animateCounts = (users: User[]) => {
    const counts = {
      teachers: users.filter((u) => u.role === "teacher").length,
      students: users.filter((u) => u.role === "student").length,
      admins: users.filter((u) => u.role === "admin").length,
      total: users.length,
    };
    const duration = 1000;
    const steps = 20;
    const increment = counts.total / steps;
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setDisplayCounts({
        total: Math.min(Math.round(increment * currentStep), counts.total),
        teachers: Math.min(
          Math.round(counts.teachers * (currentStep / steps)),
          counts.teachers
        ),
        students: Math.min(
          Math.round(counts.students * (currentStep / steps)),
          counts.students
        ),
        admins: Math.min(
          Math.round(counts.admins * (currentStep / steps)),
          counts.admins
        ),
      });
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      guardian: { ...prev.guardian, [name]: value },
    }));
  };

  const handleRoleChange = (value: "admin" | "teacher" | "student") => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const openCreateDialog = (role: "teacher" | "student") => {
    setFormData({
      name: "",
      email: "",
      role,
      password: role === "teacher" ? "teacher1234" : "student1234",
      class: "",
      subjects: [],
      guardian: { name: "", relation: "", primaryContact: "" },
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (user: User) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
      class: user.class || "",
      subjects: user.subjects || [],
      guardian: user.guardian || { name: "", relation: "", primaryContact: "" },
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        ...(formData.password ? {} : { password: undefined }),
      };
      if (currentUser) {
        const response = await axios.put<User>(
          `http://localhost:8000/api/users/${currentUser._id}`,
          payload
        );
        setUsers(
          users.map((u) => (u._id === currentUser._id ? response.data : u))
        );
        toast.success("User updated successfully");
      } else {
        const response = await axios.post<User>(`http://localhost:8000/api/users`, payload);
        setUsers([...users, response.data]);
        toast.success("User created successfully");
      }
      setIsDialogOpen(false);
      setCurrentPage(1);
    } catch (err) {
      toast.error("Failed to save user");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
      setCurrentPage(1);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (loading) return <div className="text-center py-8">Loading users...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <Input
            placeholder="Search users by name, email, class, etc..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(value: "all" | "admin" | "teacher" | "student") => {
            setRoleFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
            <SelectItem value="teacher">Teachers</SelectItem>
            <SelectItem value="student">Students</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-4 mb-6">
        <Button onClick={() => openCreateDialog("teacher")}>
          <FaPlus className="mr-2" /> Create Teacher
        </Button>
        <Button onClick={() => openCreateDialog("student")}>
          <FaPlus className="mr-2" /> Create Student
        </Button>
      </div>

      <UserCards
        displayCounts={displayCounts}
        filteredCount={filteredUsers.length}
        totalTeachers={users.filter((u) => u.role === "teacher").length}
        totalStudents={users.filter((u) => u.role === "student").length}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UserTable
            users={paginatedUsers}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />{" "}
        </CardContent>
      </Card>

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentUser ? "Edit User" : `Create New ${formData.role}`}
            </DialogTitle>
          </DialogHeader>

          <UserForm
            formData={formData}
            currentUser={currentUser}
            handleInputChange={handleInputChange}
            handleGuardianChange={handleGuardianChange}
            handleRoleChange={handleRoleChange}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
