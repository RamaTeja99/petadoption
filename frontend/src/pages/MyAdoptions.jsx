import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const RAZORPAY_KEY_ID = "rzp_test_RYsjZGpaSI78sz"; // Replace with your Razorpay test key

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

  // Format slot date
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[2]
    );
  };

  // Get user adoptions
  const getUserAdoptions = async () => {
    try {
      const { data } = await api.get("/api/user/adoptions");
      if (data.success) {
        const transformedAdoptions = data.adoptions.map((adoption) => {
          let petData = adoption.petData;
          if (typeof petData === "string") {
            try {
              petData = JSON.parse(petData);
            } catch (e) {
              petData = {};
            }
          }
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
      toast.error(error.response?.data?.message || "Failed to load adoptions");
    }
  };

  // Cancel adoption
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
      toast.error(error.response?.data?.message || "Failed to cancel adoption");
    }
  };

  // Razorpay payment handler for an adoption
  const adoptionRazorpay = async (adoptionId) => {
    const adoption = adoptions.find((item) => item._id === adoptionId);
    if (!adoption) {
      toast.error("Adoption not found.");
      return;
    }
    try {
      // Step 1. Request backend to create an order
      const orderResponse = await axios.post(
        "http://localhost:8081/api/payment/create-order",
        {
          userId: adoption.userData?.id,
          adoptionId: parseInt(adoptionId),
          amount: adoption.amount,
        }
      );
      if (!orderResponse.data.success) {
        toast.error(orderResponse.data.message || "Order creation failed");
        return;
      }
      const { orderId, amount, currency } = orderResponse.data;

      // Step 2. Create Razorpay Checkout options
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "Adoption Payment",
        description: "Adoption Payment",
        order_id: orderId,
        prefill: {
          name: adoption.userData?.name,
          email: adoption.userData?.email,
          contact: adoption.userData?.phone,
        },
        theme: { color: "#3399cc" },
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyResponse = await axios.post(
              "http://localhost:8081/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );
            if (verifyResponse.data.success) {
              toast.success("Payment successful!");
              getUserAdoptions();
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {},
        },
      };
      // Step 3. Open Razorpay Checkout
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error("Payment gateway not available");
      }
    } catch (error) {
      toast.error("Payment initiation failed");
    }
  };

  useEffect(() => {
    if (token) getUserAdoptions();
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
              <p className="text-xs">{item.petData.address?.line1}</p>
              <p className="text-xs">{item.petData.address?.line2}</p>
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
