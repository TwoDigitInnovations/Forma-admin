import { userContext } from "@/pages/_app";
import { Bell, User,Search, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiCalendarSlash, PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#e0f349",
      customClass: {
        confirmButton: 'px-12 rounded-xl',
        title: 'text-[20px] text-black',
        actions: 'swal2-actions-no-hover',
        popup: 'rounded-[15px] shadow-lg'
      },
      buttonsStyling: true,
      reverseButtons: true,
      width: '350px'
    }).then(function (result) {
      if (result.isConfirmed) {
        logOut();
      }
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
    // event.currentTarget.className = "error";
  };

  return (
    <nav className="w-full bg-custom-black z-20 sticky top-0 max-w-screen shadow-sm ">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between md:h-20 h-16">
          {/* Logo */}
          <div className=" flex items-center">
            {/* <img 
              className="h-10 w-auto object-contain" 
              src="/logo.png" 
              alt="Logo"
              onClick={()=> router.push("/")}
            /> */}
            <p className="text-2xl text-white font-bold md:hidden flex">Forma</p>
          </div>


          {user?._id && (
          <div className="hidden md:flex items-center justify-end space-x-4 flex-1">
            <div className="relative">
              <div
                className="flex items-center space-x-3  px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {/* <div className="Relative">
                  <input
                    className="ps-10 w-[20rem] bg-[#FFFFFF4A] border-black border text-white rounded-3xl px-4 py-2"
                    placeholder="Search"
                  />
                  <Search className='absolute top-6 left-8 text-gray-300' size={18} />
                </div> */}
                {/* <p className="p-2 bg-custom-lightgold rounded-full"><Bell className="text-custom-yellow" /> </p> */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#e0f349] flex-shrink-0 cursor-pointer"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={"/office-man.png"}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <div className="flex flex-col text-left">
                  <p className="text-custom-yellow text-md">{user?.role}</p>
                </div>

              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                  {/* <button
                    onClick={() => router.push("/myProfile")}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="text-black" />
                    <span>My Profile</span>
                  </button> */}
                   <button
                    onClick={()=> router.push("/MyProfile")}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <User2 size={16} className="text-black" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <PiSignOutFill size={16} className="text-black" />
                    <span>Sign Out</span>
                  </button>

                </div>
              )}
            </div>
          </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpenTab(!openTab)}
              className="p-2 rounded-md text-white hover:bg-gray-100 focus:outline-none"
            >
              <GiHamburgerMenu size={24} />
            </button>
          </div>
        </div>
      </div>

     
    </nav>
  );
};

export default Navbar;
