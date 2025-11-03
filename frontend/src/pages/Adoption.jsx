import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedPets from "../components/RelatedPets";
import axios from "axios";
import { toast } from "react-toastify";

const Adoption = () => {
  const { petId } = useParams();
  const { pets, currencySymbol, backendUrl, token, getPetsData, api } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [petInfo, setPetInfo] = useState(false);
  const [petSlots, setPetSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchPetInfo = async () => {
    const petInfo = pets.find((pet) => pet._id === petId || pet.id === petId);
    setPetInfo(petInfo);
  };

  const getAvailableSlots = async () => {
    setPetSlots([]);
    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(24, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        // Check if slot is available (handle both string and object formats)
        const slotsBooked = petInfo.slots_booked || {};
        const isSlotAvailable =
          slotsBooked[slotDate] && slotsBooked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setPetSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAdoption = async () => {
    if (!token) {
      toast.warn("Login to book visit");
      return navigate("/login");
    }

    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    const date = petSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = day + "_" + month + "_" + year;

    try {
      const { data } = await api.post("/api/user/book-adoption", {
        petId: parseInt(petId), // Convert to number as Spring Boot expects Long
        slotDate,
        slotTime,
      });

      if (data.success) {
        toast.success(data.message);
        getPetsData();
        navigate("/my-adoptions");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to book adoption");
    }
  };

  useEffect(() => {
    if (pets.length > 0) {
      fetchPetInfo();
    }
  }, [pets, petId]);

  useEffect(() => {
    if (petInfo) {
      getAvailableSlots();
    }
  }, [petInfo]);

  return petInfo ? (
    <div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
<<<<<<< HEAD
          <p>{console.log(petInfo)}</p>
=======
          {/* FIXED: Display image correctly */}
>>>>>>> 29bb20e86dc194e7d6430264a9d88d88f08a97bd
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg"
            src={
              petInfo.image
                ? `${backendUrl}${petInfo.image}`
                : assets.upload_area
            }
            alt={petInfo.name || "Pet"}
            onError={(e) => {
              e.target.src = assets.upload_area; // Fallback image
            }}
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
            {petInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="" />
          </p>

          <div className="flex items-center gap-2 mt-1 text-gray-600">
            <p>
              {petInfo.age} - {petInfo.breed}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {petInfo.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
              About{" "}
              <img
                src={assets.info_icon}
                alt=""
                className="w-4 h-4 inline-block align-middle"
              />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1">
              {petInfo.about}
            </p>
          </div>

          <p className="text-gray-600 font-medium mt-4">
            Adoption fee:{" "}
            <span className="text-gray-800">
              {currencySymbol} {petInfo.fees}
            </span>
          </p>
        </div>
      </div>

      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p>Visit Booking slots</p>
        <div className="flex gap-3 items-center w-full mt-4">
          {petSlots.length &&
            petSlots.map((item, index) => (
              <div
                onClick={() => setSlotIndex(index)}
                className={`text-center py-6 min-w-16 rounded-t-lg cursor-pointer ${
                  slotIndex === index
                    ? "bg-primary text-white"
                    : "border border-[#DDDDDD]"
                }`}
                key={index}
              >
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))}
        </div>

        <div className="flex items-center gap-3 w-full mt-4 overflow-x-scroll">
          {petSlots.length &&
            petSlots[slotIndex].map((item, index) => (
              <p
                onClick={() => setSlotTime(item.time)}
                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                  item.time === slotTime
                    ? "bg-primary text-white"
                    : "text-[#949494] border border-[#B4B4B4]"
                }`}
                key={index}
              >
                {item.time.toLowerCase()}
              </p>
            ))}
        </div>

        <button
          onClick={bookAdoption}
          className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book a visit
        </button>
      </div>

      <RelatedPets petId={petId} speciality={petInfo.speciality} />
    </div>
  ) : null;
};

export default Adoption;
