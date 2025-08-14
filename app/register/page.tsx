"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Mail,
  Lock,
  User,
  BookOpen,
  Hash,
  Home,
  Phone,
  UserCog,
} from "lucide-react";
import axios from "axios";
import { Label } from "@/components/label";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    class: "",
    rollNumber: "",
    guardian: {
      name: "",
      relation: "Father",
      primaryContact: "",
      secondaryContact: "",
    },
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes("guardian.")) {
      const guardianField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        guardian: {
          ...prev.guardian,
          [guardianField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register/student",
        formData
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      toast.success("Account created successfully!");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Registration failed. Please check your details"
        );
      } else {
        toast.error("An error occurred. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-2xl">Create Your Account</CardTitle>
              <CardDescription className="text-indigo-100">
                Join us to get started with your learning journey
              </CardDescription>
            </motion.div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="class"
                      name="class"
                      type="text"
                      value={formData.class}
                      onChange={handleChange}
                      placeholder="e.g., 10th Grade"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rollNumber">Roll Number</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="rollNumber"
                      name="rollNumber"
                      type="text"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g., 25"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address (Optional)</Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Your address"
                      className="pl-10"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="md:col-span-2 space-y-4 pt-4 border-t"
              >
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <UserCog className="h-5 w-5 text-indigo-600" />
                  Guardian Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="guardian.name">Guardian Name</Label>
                    <Input
                      id="guardian.name"
                      name="guardian.name"
                      type="text"
                      value={formData.guardian.name}
                      onChange={handleChange}
                      placeholder="Guardian's full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardian.relation">Relation</Label>
                    <select
                      id="guardian.relation"
                      name="guardian.relation"
                      value={formData.guardian.relation}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardian.primaryContact">
                      Primary Contact
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="guardian.primaryContact"
                        name="guardian.primaryContact"
                        type="tel"
                        value={formData.guardian.primaryContact}
                        onChange={handleChange}
                        placeholder="Primary phone number"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardian.secondaryContact">
                      Secondary Contact (Optional)
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="guardian.secondaryContact"
                        name="guardian.secondaryContact"
                        type="tel"
                        value={formData.guardian.secondaryContact}
                        onChange={handleChange}
                        placeholder="Secondary phone number"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 p-6 bg-gray-50 border-t">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </motion.div>

              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-indigo-600 p-0 h-auto"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;