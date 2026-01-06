"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  User,
  Mail,
  Phone,
  Lock,
  Edit2,
  Save,
  X,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

function MyProfile(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showCurrPass, setShowCurrPass] = useState(false);

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
  });

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [originalDetail, setOriginalDetail] = useState({});

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, []);

  const getProfile = async () => {
    try {
      const res = await Api("get", "auth/profile", "", router);
      if (res?.status) {
        const userData = res?.data;
        console.log(userData);

        setUserDetail({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
        setOriginalDetail({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
      return null;
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserDetail(originalDetail);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userDetail.name || !userDetail.email || !userDetail.phone) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetail.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!/^\d{10}$/.test(userDetail.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api(
        "post",
        "auth/updateProfile",
        { ...userDetail },
        router
      );

      if (res?.status) {
        const updatedUser = { ...user, ...userDetail };
        localStorage.setItem("userDetail", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setOriginalDetail(userDetail);
        setIsEditing(false);
        toast.success(res.data.message || "Profile updated successfully");
        getProfile();
      } else {
        toast.error(res?.data?.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  const handlePasswordEdit = () => {
    setIsEditingPassword(true);
    setSubmitted(false);
  };

  const handlePasswordCancel = () => {
    setPasswords({
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
    });
    setIsEditingPassword(false);
    setSubmitted(false);
  };

  const changePassword = async () => {
    setSubmitted(true);

    const { newPassword, confirmPassword, currentPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const data = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    try {
      setPasswordLoading(true);
      props.loader(true);

      const res = await Api(
        "post",
        "auth/changePasswordfromAdmin",
        data,
        router
      );

      if (res?.status) {
        toast.success(res.data.message || "Password changed successfully");
        setPasswords({
          newPassword: "",
          confirmPassword: "",
          currentPassword: "",
        });
        setIsEditingPassword(false);
        setSubmitted(false);
       
      } else {
        toast.error(res?.data?.message || "Failed to change password");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(223,243,73,0.15) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="w-full max-w-6xl mx-auto">
      
        <div className="space-y-6 ">
          <div className="min-h-[600px] bg-custom-black border border-green-500/20 rounded-3xl p-4 md:p-8">
            <p className="text-custom-yellow font-bold text-2xl text-center">My Profile</p>
            <p className="text-custom-yellow text-md text-center mb-4 ">
              Manage your account information
            </p>
            <div className="flex md:flex-row flex-col md:items-center gap-4 justify-between mb-6">
              <h2 className="text-xl font-bold text-custom-yellow flex items-center gap-2">
                <User className="h-6 w-6" />
                Personal Information
              </h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 w-fit cursor-pointer transition-transform"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl font-semibold cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-70 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-b-2 border-black rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green" />
                  <input
                    type="text"
                    value={userDetail.name}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, name: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : "opacity-70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green" />
                  <input
                    type="email"
                    value={userDetail.email}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : "opacity-70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green" />
                  <input
                    type="tel"
                    value={userDetail.phone}
                    onChange={(e) =>
                      setUserDetail({ ...userDetail, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none transition-all ${
                      isEditing
                        ? "focus:ring-2 focus:ring-custom-green"
                        : "opacity-70 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Account Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green" />
                  <input
                    type="text"
                    value={user?.role || "N/A"}
                    disabled
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border border-gray-700 opacity-70 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex md:flex-row flex-col md:items-center gap-4 justify-between mb-6">
              <h2 className="text-xl font-bold text-custom-yellow flex items-center gap-2">
                <Lock className="h-6 w-6" />
                Change Password
              </h2>
              {!isEditingPassword ? (
                <button
                  onClick={handlePasswordEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 w-fit cursor-pointer transition-transform"
                >
                  <Edit2 className="h-4 w-4" />
                  Change Password
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handlePasswordCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-xl font-semibold cursor-pointer hover:bg-gray-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={changePassword}
                    disabled={passwordLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-custom-yellow text-black rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-70 cursor-pointer"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-b-2 border-black rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Password
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type={showCurrPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        currentPassword: e.target.value,
                      })
                    }
                    disabled={!isEditingPassword}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border outline-none transition-all ${
                      !isEditingPassword
                        ? "opacity-70 cursor-not-allowed border-gray-700"
                        : submitted && !passwords.currentPassword
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 focus:ring-2 focus:ring-custom-green"
                    }`}
                  />
                  {isEditingPassword && (
                    <button
                      type="button"
                      onClick={() => setShowCurrPass(!showCurrPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrPass ? (
                        <EyeOff className="h-5 w-5 text-custom-yellow" />
                      ) : (
                        <Eye className="h-5 w-5 text-custom-yellow" />
                      )}
                    </button>
                  )}
                </div>
                {submitted && !passwords.currentPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Password is required
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type={showNewPass ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    disabled={!isEditingPassword}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border outline-none transition-all ${
                      !isEditingPassword
                        ? "opacity-70 cursor-not-allowed border-gray-700"
                        : submitted && !passwords.newPassword
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 focus:ring-2 focus:ring-custom-green"
                    }`}
                  />
                  {isEditingPassword && (
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showNewPass ? (
                        <EyeOff className="h-5 w-5 text-custom-yellow" />
                      ) : (
                        <Eye className="h-5 w-5 text-custom-yellow" />
                      )}
                    </button>
                  )}
                </div>
                {submitted && !passwords.newPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Password is required
                  </p>
                )}
                {submitted &&
                  passwords.newPassword &&
                  passwords.newPassword.length < 8 && (
                    <p className="text-red-400 text-xs mt-1">
                      Password must be at least 8 characters
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-custom-yellow mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && isEditingPassword && changePassword()
                    }
                    disabled={!isEditingPassword}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border outline-none transition-all ${
                      !isEditingPassword
                        ? "opacity-70 cursor-not-allowed border-gray-700"
                        : submitted && !passwords.confirmPassword
                        ? "border-red-500 bg-red-900/20"
                        : "border-gray-700 focus:ring-2 focus:ring-custom-green"
                    }`}
                  />
                  {isEditingPassword && (
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPass ? (
                        <EyeOff className="h-5 w-5 text-custom-yellow" />
                      ) : (
                        <Eye className="h-5 w-5 text-custom-yellow" />
                      )}
                    </button>
                  )}
                </div>
                {submitted && !passwords.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">
                    Confirm password is required
                  </p>
                )}
                {submitted &&
                  passwords.confirmPassword &&
                  passwords.newPassword !== passwords.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed -bottom-10 -right-10 w-32 h-32 rounded-full bg-custom-yellow blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
}

export default MyProfile;
