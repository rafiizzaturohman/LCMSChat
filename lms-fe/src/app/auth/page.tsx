"use client";

import { loginUser } from "@/app/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const loggedIn = await loginUser(email, password);
      const userRole = loggedIn.data.role;

      if (userRole === "ADMIN") {
        router.push("/dashboard/adminPage");
      } else if (userRole === "LECTURER") {
        router.push("/dashboard/lecturerPage");
      } else {
        router.push("/dashboard/studentPage");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 max-w-7xl flex items-center justify-center">
      <div className="bg-white  p-6 md:px-8 md:py-6 rounded-[2px] mx-10">
        <div className="flex md:flex-row flex-col w-full md:max-w-md items-center justify-center md:space-x-12 space-y-6 md:space-y-0">
          {/* Image container */}
          <div className="flex flex-col justify-center items-center w-full md:w-auto space-y-2">
            <img
              className="w-32 md:w-40"
              src="/image/mainLogo.png"
              alt="Picture of School Logo"
            />

            <p className="uppercase text-md md:text-xs text-center">
              <strong>
                Learning Management System
                <br />
                SMK Yadika Soreang
              </strong>
            </p>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleLogin} method="POST">
            <input
              className="w-full p-1 border-b-2 border-gray-200 focus:outline-none hover:border-gray-400 focus:border-b-2 focus:border-gray-700 transition ease-in-out text-sm"
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />

            <input
              className="w-full p-1 border-b-2 border-gray-200 focus:outline-none hover:border-gray-400 focus:border-b-2 focus:border-gray-700 transition ease-in-out text-sm"
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />

            <div className="flex justify-center items-center">
              <button
                className="w-full cursor-pointer text-white bg-blue-800 font-semibold tracking-wider"
                type="submit"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
