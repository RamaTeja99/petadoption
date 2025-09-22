import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "₹";
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/api";

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
      console.log("API Request:", config.method.toUpperCase(), config.url);
      console.log("Full URL:", config.baseURL + config.url);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => {
      console.log("API Response success:", response.config.url);
      return response;
    },
    (error) => {
      console.log(
        "API Response error:",
        error.config?.url,
        error.response?.status
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
        setUserData(false);
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  // Getting Pets using API - Use the api instance with correct path
  const getPetsData = async () => {
    try {
      console.log("Calling getPetsData with baseURL:", backendUrl);
      // Use api instance which already has baseURL set to http://localhost:8080/api
      const { data } = await api.get("api/pet/list");
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
        console.log("Pets loaded:", transformedPets);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error fetching pets:", error);
      console.log(
        "Error details:",
        error.response?.status,
        error.response?.data
      );
      toast.error("Failed to load pets data");
      // If API fails, use sample data for development
      setSamplePets();
    }
  };

  // Sample pets data for development/testing
  const setSamplePets = () => {
    const samplePets = [
      {
        _id: "1",
        name: "Buddy",
        image: "/pet1.jpg",
        breed: "Dogs",
        age: "2 Years",
        gender: "Male",
        fees: 500,
        about: "Friendly Golden Retriever looking for a loving home.",
        available: true,
        address: { line1: "123 Pet St", line2: "Pet City" },
        slots_booked: {},
      },
      {
        _id: "2",
        name: "Whiskers",
        image: "/pet2.jpg",
        breed: "Cats",
        age: "1 Year",
        gender: "Female",
        fees: 300,
        about: "Gentle Persian cat who loves to cuddle.",
        available: true,
        address: { line1: "456 Cat Ave", line2: "Cat Town" },
        slots_booked: {},
      },
      {
        _id: "3",
        name: "Tweety",
        image: "/pet3.jpg",
        breed: "Birds",
        age: "6 Months",
        gender: "Male",
        fees: 200,
        about: "Beautiful canary with a lovely singing voice.",
        available: true,
        address: { line1: "789 Bird Ln", line2: "Bird Village" },
        slots_booked: {},
      },
    ];
    setPets(samplePets);
    console.log("Sample pets loaded:", samplePets);
  };

  // Getting User Profile using API
  const loadUserProfileData = async () => {
    try {
      const { data } = await api.get("api/user/get-profile");
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
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        toast.error("Failed to load profile data");
      }
    }
  };

  useEffect(() => {
    getPetsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
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
