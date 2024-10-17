"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Brush, Eye, EyeOff, Paintbrush, RefreshCw } from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apmapis.webdevava.live/api";

export default function CreateUser({ onUserCreated }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    department: "",
    company: "",
    phoneNumber: "",
    designation: "",
    employeeId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const createUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error("Failed to create user");
      toast.success("User created successfully!");
      setNewUser({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        department: "",
        company: "",
        phoneNumber: "",
        designation: "",
        employeeId: "",
      });
      onUserCreated();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      newUser.name &&
      newUser.userName &&
      newUser.email &&
      newUser.password &&
      newUser.confirmPassword &&
      newUser.password === newUser.confirmPassword &&
      newUser.role
    );
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      department: "",
      company: "",
      phoneNumber: "",
      designation: "",
      employeeId: "",
    });
  };

  return (
    <Card className="w-full  mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={createUser} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Name"
                value={newUser.name}
                onChange={handleInputChange}
                required
                className="bg-background rounded-full border-0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="userName" className="text-sm font-medium">
                User Name *
              </label>
              <Input
                id="userName"
                name="userName"
                placeholder="Enter User Name"
                value={newUser.userName}
                onChange={handleInputChange}
                required
                className="bg-background rounded-full border-0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email ID *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter Email ID"
                value={newUser.email}
                onChange={handleInputChange}
                required
                className="bg-background rounded-full border-0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role *
              </label>
              <Select
                name="role"
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser((prev) => ({ ...prev, role: value }))
                }
              >
                <SelectTrigger className="bg-background rounded-full border-0">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visitor">Visitor</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                  className="bg-background rounded-full border-0 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password *
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter Password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="bg-background rounded-full border-0 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-0"
                  onClick={() => {
                    setNewUser((prev) => ({
                      ...prev,
                      password: "",
                      confirmPassword: "",
                    }));
                  }}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium">
                Contact No
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter contact no"
                value={newUser.phoneNumber}
                onChange={handleInputChange}
                className="bg-background rounded-full border-0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">
                Company
              </label>
              <Select
                name="company"
                value={newUser.company}
                onValueChange={(value) =>
                  setNewUser((prev) => ({ ...prev, company: value }))
                }
              >
                <SelectTrigger className="bg-background rounded-full border-0">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Company A">Company A</SelectItem>
                  <SelectItem value="Company B">Company B</SelectItem>
                  <SelectItem value="Company C">Company C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="department" className="text-sm font-medium">
                Department
              </label>
              <Select
                name="department"
                value={newUser.department}
                onValueChange={(value) =>
                  setNewUser((prev) => ({ ...prev, department: value }))
                }
              >
                <SelectTrigger className="bg-background rounded-full border-0">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Field Executive">
                    Field Executive
                  </SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="designation" className="text-sm font-medium">
                Designation
              </label>
              <Input
                id="designation"
                name="designation"
                placeholder="Enter Designation"
                value={newUser.designation}
                onChange={handleInputChange}
                className="bg-background rounded-full border-0"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="employeeId" className="text-sm font-medium">
                Employee ID
              </label>
              <Input
                id="employeeId"
                name="employeeId"
                placeholder="Enter Employee ID"
                value={newUser.employeeId}
                onChange={handleInputChange}
                className="bg-background rounded-full border-0"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 items-center pt-4">
            <Button type="button" variant="ghost" onClick={resetForm} className=" bg-background rounded-full">
              <Paintbrush/>
              Clear Selection
            </Button>
            <Button type="submit" disabled={loading || !isFormValid()} className="rounded-full">
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
