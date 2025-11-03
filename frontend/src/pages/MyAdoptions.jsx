import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAdoptions = () => {
  const { backendUrl, token, api } = useContext(AppContext);
  const navigate = useNavigate();

  const [adoptions, setAdoptions] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    );
  };

  // Getting User Adoptions Data Using API
  const getUserAdoptions = async () => {
    try {
      const { data } = await api.get("/api/user/adoptions");
      console.log(data);
      if (data.success) {
        // Transform Spring Boot response to match frontend expectations
        const transformedAdoptions = data.adoptions.map((adoption) => {
          // Parse petData string to object if needed
          let petData = adoption.petData;
          if (typeof petData === "string") {
            try {
              petData = JSON.parse(petData);
            } catch (e) {
              petData = {};
            }
          }
          // Parse userData string to object if needed
          let userData = adoption.userData;
          if (typeof userData === "string") {
            try {
              userData = JSON.parse(userData);
            } catch (e) {
              userData = {};
            }
          }

          return {
            _id: adoption.id?.toString(),
            petId: petData.id?.toString(),
            slotDate: adoption.slotDate,
            slotTime: adoption.slotTime,
            amount: adoption.amount,
            date: adoption.date,
            cancelled: adoption.cancelled,
            payment: adoption.payment,
            isCompleted: adoption.isCompleted,
            petData: {
              name: petData.name,
              breed: petData.breed,
              image: petData.image,
              address:
                typeof petData.address === "string"
                  ? JSON.parse(petData.address)
                  : petData.address,
            },
            userData: userData,
          };
        });

        setAdoptions(transformedAdoptions.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to load adoptions");
    }
  };

  // Function to cancel adoption Using API
  const cancelAdoption = async (adoptionId) => {
    try {
      const { data } = await api.post("/api/user/cancel-adoption", {
        adoptionId: parseInt(adoptionId),
      });

      if (data.success) {
        toast.success(data.message);
        getUserAdoptions();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to cancel adoption");
    }
  };

  // Payment gateway integration (placeholder - implement as needed)
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Adoption Payment",
      description: "Adoption Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          toast.success("Payment successful!");
          getUserAdoptions();
        } catch (error) {
          console.log(error);
          toast.error("Payment verification failed");
        }
      },
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      toast.error("Payment gateway not available");
    }
  };

  const adoptionRazorpay = async (adoptionId) => {
    try {
      toast.info("Payment gateway integration needed in backend");
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  const adoptionStripe = async (adoptionId) => {
    try {
      toast.info("Payment gateway integration needed in backend");
    } catch (error) {
      console.log(error);
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAdoptions();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My adoptions
      </p>
      <div className="my-6">
        {adoptions.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            <div>
              <img
                className="w-36 bg-[#EAEFFF]"
                src={item.petData.image || assets.pet_icon}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.petData.name}
              </p>
              <p>{item.petData.breed}</p>
              <p className="text-[#464646] font-medium mt-1">Address:</p>
              <p className="text-xs">{item.petData.address.line1}</p>
              <p className="text-xs">{item.petData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-[#3C3C3C] font-medium">
                  Date & Time:{" "}
                </span>
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <>
                  <button
                    onClick={() => adoptionRazorpay(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                  <button
                    onClick={() => cancelAdoption(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                  >
                    Cancel adoption
                  </button>
                </>
              )}
              {item.cancelled && (
                <p className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Adoption cancelled
                </p>
              )}
              {item.isCompleted && (
                <p className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </p>
              )}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <p className="sm:min-w-48 py-2 border border-blue-500 rounded text-blue-500">
                  Paid
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAdoptions;
