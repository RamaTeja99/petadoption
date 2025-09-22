import React, { useContext, useEffect, useState } from "react";
import { ShelterContext } from "../../context/ShelterContext";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const ShelterProfile = () => {
  const { sToken, profileData, setProfileData, getProfileData } =
    useContext(ShelterContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available,
      };

      const { data } = await axios.post(
        backendUrl + "/api/pet/update-profile",
        updateData,
        { headers: { sToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
      setIsEdit(false);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (sToken) {
      getProfileData();
    }
  }, [sToken]);

  return (
    profileData && (
      <div className="max-w-lg mx-auto mt-5">
        <div className="flex flex-col gap-4 m-5">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>

          <div className="flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white">
            {/* ----- Pet Info: name, breed, age ----- */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {profileData.age} - {profileData.breed}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {profileData.gender}
              </button>
            </div>

            {/* ----- Pet About ----- */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">
                {isEdit ? (
                  <textarea
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        about: e.target.value,
                      }))
                    }
                    className="w-full outline-primary p-2"
                    value={profileData.about}
                    rows={5}
                  />
                ) : (
                  profileData.about
                )}
              </p>
            </div>

            <p className="text-gray-500 font-medium mt-4">
              Adoption fee:{" "}
              <span className="text-gray-800">
                {currency}{" "}
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                    type="number"
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>

            <div className="flex gap-2 py-2">
              <p>Address:</p>
              <p className="text-sm">
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value },
                      }))
                    }
                    value={profileData.address.line1}
                    type="text"
                  />
                ) : (
                  profileData.address.line1
                )}
                <br />
                {isEdit ? (
                  <input
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value },
                      }))
                    }
                    value={profileData.address.line2}
                    type="text"
                  />
                ) : (
                  profileData.address.line2
                )}
              </p>
            </div>

            <div className="flex gap-1 pt-2">
              <input
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
                checked={profileData.available}
                type="checkbox"
              />
              <label htmlFor="">Available</label>
            </div>

            {isEdit ? (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={updateProfile}
                  className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEdit(false)}
                  className="px-4 py-1 border border-gray-500 text-sm rounded-full hover:bg-gray-500 hover:text-white transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-5">
                <button
                  onClick={() => setIsEdit(true)}
                  className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ShelterProfile;
