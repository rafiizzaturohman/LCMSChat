"use client";

import { loginUser } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const loggedIn = await loginUser(email, password);
      const userRole = loggedIn.user.role;

      console.log(userRole);

      console.log(loggedIn);

      if (userRole === "ADMIN") {
        router.push("/pages/dashboard/adminPage");
      } else if (userRole === "LECTURER") {
        router.push("/pages/dashboard/lecturerPage");
      } else {
        router.push("/pages/dashboard/studentPage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-md flex flex-col w-full max-w-sm">
        <div></div>

        <div className="flex flex-col space-y-3">
          <input
            className="p-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Email"
            id="email"
            name="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />

          <input
            className="p-2 rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            placeholder="Password"
            id="password"
            name="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />

          <button
            className="cursor-pointer text-white bg-blue-800 font-semibold tracking-wider"
            onClick={handleLogin}
            type="submit"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
