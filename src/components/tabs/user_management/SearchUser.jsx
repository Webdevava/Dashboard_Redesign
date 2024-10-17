"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apmapis.webdevava.live/api";

const SearchUser = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filters, setFilters] = useState({
    email: "",
    role: "",
    department: "",
    employeeId: "",
    designation: "",
    company: "",
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        Object.entries(filters).every(
          ([key, value]) =>
            value === "" ||
            user[key]?.toLowerCase().includes(value.toLowerCase())
        )
    );
    setUsers(filteredUsers);
  };

  const handleReset = () => {
    setSearchName("");
    setFilters({
      email: "",
      role: "",
      department: "",
      employeeId: "",
      designation: "",
      company: "",
    });
    fetchUsers();
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/users/${userToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to delete user");
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting the user.");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleEditUserRole = async () => {
    if (!userToEdit || !newRole) return;

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${API_URL}/users/${userToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) throw new Error("Failed to update user role");
      toast.success("User role updated successfully");
      fetchUsers();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("An error occurred while updating the user role.");
    } finally {
      setUserToEdit(null);
      setNewRole("");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-gray-400 border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search User</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search by name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleSearch}>Search</Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Search className="mr-2 h-4 w-4" /> Advanced Search
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Filters</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the filters for the user search.
                  </p>
                </div>
                <div className="grid gap-2">
                  {Object.entries(filters).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-3 items-center gap-4"
                    >
                      <Label htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Label>
                      <Input
                        id={key}
                        value={value}
                        onChange={(e) =>
                          setFilters({ ...filters, [key]: e.target.value })
                        }
                        className="col-span-2 h-8"
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSearch}>Search</Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
        {users.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.employeeId}</TableCell>
                  <TableCell>
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            setUserToEdit(user);
                            setNewRole(user.role);
                          }}
                        >
                          Edit Role
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User Role</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="role">Select new role</Label>
                          <Select
                            value={newRole}
                            onValueChange={(value) => setNewRole(value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Admin">Admin</SelectItem>
                              <SelectItem value="Moderator">
                                Moderator
                              </SelectItem>
                              <SelectItem value="Visitor">Visitor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleEditUserRole}>
                          Update Role
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setUserToDelete(user)}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the user account and remove their data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setUserToDelete(null)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeleteUser}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">No users found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchUser;
