import { FaUsers, FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UserCardsProps {
  displayCounts: {
    total: number;
    teachers: number;
    students: number;
    admins: number;
  };
  filteredCount: number;
  totalTeachers: number;
  totalStudents: number;
}

export const UserCards = ({
  displayCounts,
  filteredCount,
  totalTeachers,
  totalStudents,
}: UserCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <FaUsers className="text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayCounts.total}</div>
          <p className="text-xs text-muted-foreground">
            {filteredCount} match current filters
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Teachers</CardTitle>
          <FaChalkboardTeacher className="text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayCounts.teachers}</div>
          <p className="text-xs text-muted-foreground">
            {totalTeachers} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students</CardTitle>
          <FaUserGraduate className="text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayCounts.students}</div>
          <p className="text-xs text-muted-foreground">
            {totalStudents} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Admins</CardTitle>
          <FaUserGraduate className="text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayCounts.admins}</div>
        </CardContent>
      </Card>
    </div>
  );
};