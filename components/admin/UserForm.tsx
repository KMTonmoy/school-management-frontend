"use client";
import { useState } from "react";
import { User } from "@/types/user";
import { Label } from "@/components/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface UserFormProps {
  formData: {
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    password: string;
    class: string;
    subjects: string[];
    guardian: {
      name: string;
      relation: string;
      primaryContact: string;
    };
  };
  currentUser: User | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleGuardianChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRoleChange: (value: 'admin' | 'teacher' | 'student') => void;
  handleSubmit: () => void;
}

const relationOptions = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'sister', label: 'Sister' },
  { value: 'brother', label: 'Brother' },
  { value: 'uncle', label: 'Uncle' },
  { value: 'aunt', label: 'Aunt' },
  { value: 'grandfather', label: 'Grandfather' },
  { value: 'grandmother', label: 'Grandmother' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'other', label: 'Other' },
];

export const UserForm = ({
  formData,
  currentUser,
  handleInputChange,
  handleGuardianChange,
  handleRoleChange,
  handleSubmit,
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          className="col-span-3"
        />
      </div>
      
      {!currentUser && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <div className="col-span-3 relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <Select 
          value={formData.role} 
          onValueChange={handleRoleChange}
          disabled={!!currentUser}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="teacher">Teacher</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {formData.role === 'student' && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="class" className="text-right">
              Class
            </Label>
            <Input
              id="class"
              name="class"
              value={formData.class}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guardian-name" className="text-right">
              Guardian Name
            </Label>
            <Input
              id="guardian-name"
              name="name"
              value={formData.guardian.name}
              onChange={handleGuardianChange}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guardian-relation" className="text-right">
              Relation
            </Label>
            <Select
              value={formData.guardian.relation}
              onValueChange={(value) => handleGuardianChange({
                target: { name: 'relation', value }
              } as React.ChangeEvent<HTMLInputElement>)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                {relationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="guardian-contact" className="text-right">
              Contact
            </Label>
            <Input
              id="guardian-contact"
              name="primaryContact"
              value={formData.guardian.primaryContact}
              onChange={handleGuardianChange}
              className="col-span-3"
            />
          </div>
        </>
      )}
      
      {formData.role === 'teacher' && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subjects" className="text-right">
            Subjects
          </Label>
          <Input
            id="subjects"
            name="subjects"
            value={formData.subjects.join(', ')}
            onChange={(e) => ({
              ...formData,
              subjects: e.target.value.split(',').map(s => s.trim())
            })}
            placeholder="Math, Science, English"
            className="col-span-3"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="button" onClick={handleSubmit}>
          {currentUser ? 'Update' : 'Create'} User
        </Button>
      </div>
    </div>
  );
};