import React from "react";
import LoginForm from "./forms/LoginForm";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-screen-md p-6">
        <div className="mb-8">
          <LoginForm />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        </div>
      </div>
    </div>
  );
};

export default Login;
