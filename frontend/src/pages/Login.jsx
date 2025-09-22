import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const Login = () => {
  const [mode, setMode] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { backendUrl, token, setToken, api } = useContext(AppContext);

  const isInputValid = () => {
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address");
      return false;
    }
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be ≥8 characters and include letters, numbers and symbols"
      );
      return false;
    }
    return true;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!isInputValid()) return;

    try {
      if (mode === "Sign Up") {
        // Use api instance for registration
        const { data } = await api.post("api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Registration successful!");
        } else {
          toast.error(data.message);
        }
      } else {
        // Use api instance for login
        const { data } = await api.post("api/user/login", { email, password });

        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("Login successful!");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>Please {mode === "Sign Up" ? "sign up" : "log in"} to book visit</p>
        {mode === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}
        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base"
        >
          {mode === "Sign Up" ? "Create account" : "Login"}
        </button>
        {mode === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => setMode("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => setMode("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
