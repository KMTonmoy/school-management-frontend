export interface Guardian {
  name: string;
  relation: string;
  primaryContact: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  class?: string; // For students
  subjects?: string[]; // For teachers
  guardian?: Guardian; // For students
}

// For form handling
export interface UserFormData {
  name: string;
  email: string;
  role: "admin" | "teacher" | "student";
  password: string;
  class: string;
  subjects: string[];
  guardian: Guardian;
}

// For API responses
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// For pagination
export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// For the guardian relation dropdown
export const relationOptions = [
  { value: "father", label: "Father" },
  { value: "mother", label: "Mother" },
  { value: "sister", label: "Sister" },
  { value: "brother", label: "Brother" },
  { value: "uncle", label: "Uncle" },
  { value: "aunt", label: "Aunt" },
  { value: "grandfather", label: "Grandfather" },
  { value: "grandmother", label: "Grandmother" },
  { value: "guardian", label: "Guardian" },
  { value: "other", label: "Other" },
] as const;

export type RelationType = (typeof relationOptions)[number]["value"];
