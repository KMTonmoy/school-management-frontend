"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./label";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["STUDENT", "TEACHER"]),
  firstName: z.string().min(2, "Minimum 2 characters"),
  lastName: z.string().min(2, "Minimum 2 characters"),
  phone: z.string().min(10, "Minimum 10 digits"),
  guardianPhone: z.string().optional(),
  address: z.string().optional(),
});

type UserFormValues = z.infer<typeof formSchema>;

interface UserFormProps {
  onSubmit: (values: UserFormValues) => void;
  initialData?: UserFormValues | null;
}

export function UserForm({ onSubmit, initialData }: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "STUDENT",
      firstName: "",
      lastName: "",
      phone: "",
      guardianPhone: "",
      address: "",
    },
  });

  const role = watch("role");

  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key as keyof UserFormValues, value);
      });
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <Label>Role</Label>
        <Select
          value={watch("role")}
          onValueChange={(value) =>
            setValue("role", value as "STUDENT" | "TEACHER")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...register("phone")} />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {role === "STUDENT" && (
        <div>
          <Label>Guardian Phone</Label>
          <Input {...register("guardianPhone")} />
          {errors.guardianPhone && (
            <p className="text-sm text-red-500">
              {errors.guardianPhone.message}
            </p>
          )}
        </div>
      )}

      <div>
        <Label>Address</Label>
        <Input {...register("address")} />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Reset
        </Button>
        <Button type="submit">
          {initialData ? "Update User" : "Create User"}
        </Button>
      </div>
    </form>
  );
}
