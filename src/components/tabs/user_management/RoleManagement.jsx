import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const RoleManagement = () => {
  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
    delete: false,
  });

  const handlePermissionChange = (permission) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  const atLeastOneSelected = Object.values(permissions).some(Boolean);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="roleName">Role Name</Label>
              <Input type="text" id="roleName" placeholder="Enter role name" />
            </div>
            <div>
              <Label htmlFor="roleDescription">Role Description</Label>
              <Textarea
                id="roleDescription"
                placeholder="Enter role description"
              />
            </div>
            <div>
              <Label>Permissions</Label>
              <div className=" flex items-center gap-4 mt-2 border w-fit p-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="read"
                    checked={permissions.read}
                    onCheckedChange={() => handlePermissionChange("read")}
                  />
                  <Label htmlFor="read">Read</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="write"
                    checked={permissions.write}
                    onCheckedChange={() => handlePermissionChange("write")}
                  />
                  <Label htmlFor="write">Write</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="delete"
                    checked={permissions.delete}
                    onCheckedChange={() => handlePermissionChange("delete")}
                  />
                  <Label htmlFor="delete">Delete</Label>
                </div>
              </div>
              {!atLeastOneSelected && (
                <p className="text-sm text-red-500 mt-1">
                  At least one permission must be selected.
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={!atLeastOneSelected}
            >
              Create Role
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Existing Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="min-w-full mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Admin</TableCell>
                <TableCell>Full access to all features</TableCell>
                <TableCell>
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive" className="ml-2">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Limited access to features</TableCell>
                <TableCell>
                  <Button variant="outline">Edit</Button>
                  <Button variant="destructive" className="ml-2">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default RoleManagement;
