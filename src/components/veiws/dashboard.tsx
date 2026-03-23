"use client";

import { User } from "@/lib/auth";

interface ProfileInformationProps {
  user: User;
}

const DashboardView = ({ user }: ProfileInformationProps) => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white  ">
      <h1>Control Panel</h1>
      <h1>Helo{user.name}</h1>
    </div>
  );
};

export default DashboardView;
