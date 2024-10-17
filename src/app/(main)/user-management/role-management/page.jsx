'use client'
import React from "react";
import { Card } from "@/components/ui/card";
import RoleManagement from "@/components/tabs/user_management/RoleManagement";

const page = () => {
  return <Card className=" h-full w-full min-h-[75vh]">
    <RoleManagement/>
  </Card>;
};

export default page;
