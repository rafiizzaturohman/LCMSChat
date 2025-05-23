"use client";

import { logoutUser } from "@/lib/utils/api";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();

      router.push("/auth");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="">
      <h1>Ini Admin</h1>

      <button
        className="cursor-pointer text-white bg-blue-800 font-semibold tracking-wider"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  );
};

export default AdminPage;
