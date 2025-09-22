import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";
  const [pets, setPets] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  // Create axios instance with interceptors
  const api = axios.create({
    baseURL: backendUrl,
  });

  // Request interceptor to add token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.token = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Token expired or invalid, clearing session");
        localStorage.removeItem("token");
        setToken("");
        setUserData(false);
        toast.error("Session expired. Please login again.");
        // Only redirect if not already on login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  // Getting Pets using API
  const getPetsData = async () => {
    try {
      const { data } = await api.get("/api/pet/list");
      if (data.success) {
        // Transform Spring Boot response to match frontend expectations
        const transformedPets = data.pets.map((pet) => ({
          _id: pet.id.toString(),
          name: pet.name,
          image: pet.image,
          breed: pet.breed,
          age: pet.age,
          gender: pet.gender,
          fees: pet.fees,
          about: pet.about,
          available: pet.available,
          address:
            typeof pet.address === "string"
              ? JSON.parse(pet.address)
              : pet.address,
          slots_booked:
            typeof pet.slotsBooked === "string"
              ? JSON.parse(pet.slotsBooked)
              : pet.slotsBooked || {},
        }));
        setPets(transformedPets);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error loading pets:", error);
      toast.error("Failed to load pets data");
    }
  };

  // FIXED: Getting User Profile using API with better error handling
  const loadUserProfileData = async () => {
    // Don't attempt to load profile if no token
    if (!token) {
      console.log("No token available, skipping profile load");
      return;
    }

    try {
      console.log("Loading user profile data...");
      const { data } = await api.get("/api/user/get-profile");
      if (data.success) {
        // Transform Spring Boot response to match frontend expectations
        const transformedUserData = {
          ...data.userData,
          address:
            typeof data.userData.address === "string"
              ? JSON.parse(data.userData.address)
              : data.userData.address || { line1: "", line2: "" },
        };
        setUserData(transformedUserData);
        console.log("Profile loaded successfully");
      } else {
        console.log("Profile load failed:", data.message);
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error loading profile:", error);
      // Don't show error toast for auth errors (handled by interceptor)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        toast.error("Failed to load profile data");
      }
    }
  };

  // FIXED: Only call getPetsData on mount (pets are public)
  useEffect(() => {
    console.log("AppContext mounting, loading pets data");
    getPetsData();
  }, []);

  // FIXED: Better token validation before loading profile
  useEffect(() => {
    if (token && token.trim() !== "") {
      console.log("Token available, loading profile");
      loadUserProfileData();
    } else {
      console.log("No valid token, clearing user data");
      setUserData(false);
    }
  }, [token]);

  const value = {
    pets,
    setPets,
    getPetsData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    api, // Export the configured axios instance
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
