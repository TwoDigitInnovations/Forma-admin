import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { userContext } from "@/pages/_app";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import {
  BadgePercent,
  BrickWall,
  Building,
  ChartNoAxesCombined,
  ChevronLeft,
  ClipboardList,
  CrossIcon,
  Dock,
  DockIcon,
  Handshake,
  LayoutDashboard,
  LoaderCircle,
  MoveLeft,
  NotebookPen,
  NotepadTextDashed,
  Puzzle,
  ReceiptIcon,
  ReceiptText,
  Settings,
  Shield,
  ShieldCheck,
  User2,
  Users,
  X,
} from "lucide-react";
import { MdCreditCard } from "react-icons/md";

const SidePannel = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null); // desktop submenu state
  const [mobileOpenMenu, setMobileOpenMenu] = useState(null); // mobile submenu state

  const logOut = () => {
    setUser({});
    localStorage.removeItem("userDetail");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const menuItems = [
    {
      href: "/",
      title: "Dashboard",
      img: <LayoutDashboard size={25} />,
      access: ["Admin"],
    },
    {
      href: "/user",
      title: "User",
      img: <Building size={25} />,
      access: ["Admin"],
    },

    {
      href: "/organization",
      title: "Organization",
      img: <Users size={25} />,
      access: ["Admin"],
    },
    {
      href: "/price-plan",
      title: "Price Plan",
      img: <NotepadTextDashed size={25} />,
      access: ["Admin"],
    },
    {
      href: "/billingPage",
      title: "Billing",
      img: <MdCreditCard size={25} />,
     access: ["Admin"],
    },
  ];

  const menuItemsProject = [
    {
      href: "/ProjectDetails/overview",
      title: "Overview",
      img: <LayoutDashboard className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/work-plan",
      title: "Work Plan",
      img: <NotebookPen className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/ProgressUpdate",
      title: "Progress",
      img: <LoaderCircle className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/Pre-construction",
      title: "Pre-construction",
      img: <BrickWall className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/teams",
      title: "Teams",
      img: <Users className="text-3xl" />,
      access: ["User", "Organization"],
    },
    {
      href: "/ProjectDetails/documents",
      title: "Documents",
      img: <Dock className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
    {
      href: "/ProjectDetails/siteLogs",
      title: "Site Logs",
      img: <Settings className="text-3xl" />,
      access: ["User", "Organization", "TeamsMember"],
    },
  ];

  const imageOnError = (event) => {
    // event.currentTarget.src = "/userprofile.png";
  };

  const isProjectDetailsRoute = router.pathname.includes("ProjectDetails");

  const currentMenuItems = isProjectDetailsRoute ? menuItemsProject : menuItems;

  return (
    <>
      <div className="xl:w-[280px] fixed top-0 left-0 z-20 md:w-[250px] sm:w-[200px] hidden sm:grid grid-rows-5 overflow-hidden">
        <div>
          <div className="bg-custom-black py-5 overflow-y-scroll h-screen scrollbar-hide">
            <div
              className="bg-custom-black pt-3 pb-5 row-span-1 flex items-center justify-center cursor-pointer mx-5 rounded"
              onClick={() => router.push("/")}
            >
              <p className="text-3xl text-custom-yellow font-bold"> Forma</p>
            </div>

            <div className="relative flex flex-col justify-between row-span-4 w-full">
              <ul className=" w-full flex flex-col text-left">
                {currentMenuItems.map((item, i) =>
                  item?.access?.includes(user?.role) ? (
                    <li key={i} className="w-full">
                      <div
                        className={`flex items-center justify-between mx-5 px-6 cursor-pointer group hover:bg-[#dff34940] m-1 ${
                          router.pathname === item.href
                            ? "bg-custom-green text-white rounded-[10px]"
                            : "text-white"
                        }`}
                        onClick={() =>
                          item.children
                            ? setOpenMenu(openMenu === i ? null : i)
                            : router.push(item.href)
                        }
                      >
                        <div className="py-3 font-semibold flex items-center gap-4">
                          <span className="text-custom-yellow">
                            {" "}
                            {item?.img}
                          </span>{" "}
                          {item?.title}
                        </div>
                        {item.children &&
                          (openMenu === i ? (
                            <IoIosArrowDown className="text-xl" />
                          ) : (
                            <IoIosArrowForward className="text-xl" />
                          ))}
                      </div>

                      {item.children && openMenu === i && (
                        <ul className="mx-4  rounded-lg">
                          {item.children.map((child, j) => (
                            <Link
                              href={child.href}
                              key={j}
                              className={`block py-3 px-10 m-1 font-semibold text-sm hover:bg-[#FF700099] rounded ${
                                router.pathname === child.href
                                  ? "bg-custom-orange text-black font-semibold"
                                  : "text-gray-700"
                              }`}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : null
                )}
              </ul>
              {isProjectDetailsRoute && (
                <div
                  className="absolute -bottom-60 left-5 w-[240px] mx-auto bg-custom-green flex gap-3 justify-center items-center rounded-[10px] cursor-pointer"
                  onClick={() => router.push("/project")}
                >
                  <MoveLeft />
                  <button className="text-white  py-3 cursor-pointer">
                    Back to Project
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`w-full absolute top-0 left-0 z-40 sm:hidden flex flex-col h-screen max-h-screen overflow-hidden bg-custom-black ${
          openTab ? "scale-x-100" : "scale-x-0"
        } transition-all duration-300 origin-left`}
      >
        <div className="row-span-1 w-full text-black relative">
          <X
            className="absolute text-white top-4 right-4 z-40 text-2xl"
            onClick={() => setOpenTab(!openTab)}
          />
          <div className="flex flex-col gap-3 w-full p-3">
            <div className="px-3 rounded overflow-hidden">
              <p className="text-3xl text-white font-bold"> Forma</p>
            </div>
            <div className="flex ms-2 justify-between">
              <div className="flex">
                <div className="w-12 h-12 rounded-full overflow-hidden border-white border">
                  <img
                    src="/office-man.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={imageOnError}
                  />
                </div>
                <p className="mt-3 ms-3 text-lg text-white font-bold">
                  {user?.name}
                </p>
              </div>
              <div>
                {user?._id ? (
                  <>
                    <button
                      onClick={() => router.push("/MyProfile")}
                      className="flex gap-2 mt-3 items-center cursor-pointer"
                    >
                      <User2 size={24} className="text-white" />
                      <span className="text-white font-bold">My Profile</span>
                    </button>
                    <div
                      className="flex gap-2 mt-3 items-center cursor-pointer"
                      onClick={() => {
                        Swal.fire({
                          text: "Are you sure you want to logout?",
                          showCancelButton: true,
                          confirmButtonText: "Yes",
                          cancelButtonText: "No",
                          confirmButtonColor: "#e0f349",
                          customClass: {
                            confirmButton: "px-12 rounded-xl text-black",
                            title: "text-[20px] text-black",
                            actions: "swal2-actions-no-hover",
                            popup: "rounded-[15px] shadow-custom-green",
                          },
                          buttonsStyling: true,
                          reverseButtons: true,
                          width: "320px",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            logOut();
                          }
                        });
                      }}
                    >
                      <div className="rounded-full">
                        <PiSignOutFill className="text-3xl text-white" />
                      </div>
                      <div className="text-white font-bold">Sign Out</div>
                    </div>
                  </>
                ) : (
                  <Link href="/login">
                    <div className="p-3 mt-3 items-center font-bold text-white">
                      LogIn
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-start row-span-2 h-full w-full">
          <ul className="w-full h-full flex flex-col text-left justify-start items-center border-t-1 border-white ">
            {currentMenuItems.map((item, i) =>
              item?.access?.includes(user?.role) ? (
                <li
                  key={i}
                  className="relative w-full text-white border-b-1 border-white"
                >
                  <div
                    className="flex justify-between items-center w-full px-6 py-3 cursor-pointer hover:bg-gray-100"
                    onClick={() =>
                      item.children
                        ? setMobileOpenMenu(mobileOpenMenu === i ? null : i)
                        : (setOpenTab(false), router.push(item.href))
                    }
                  >
                    <div className="flex items-center gap-4 font-semibold">
                      <span className="text-custom-yellow">{item?.img} </span>
                      {item?.title}
                    </div>
                    {item.children &&
                      (mobileOpenMenu === i ? (
                        <IoIosArrowDown className="text-xl" />
                      ) : (
                        <IoIosArrowForward className="text-xl" />
                      ))}
                  </div>

                  {item.children && mobileOpenMenu === i && (
                    <ul className="bg-[#f9f9f9]">
                      {item.children.map((child, j) => (
                        <Link
                          href={child.href}
                          key={j}
                          className={`block py-2 pl-14 text-sm hover:bg-[#FF700099] ${
                            router.pathname === child.href
                              ? "bg-custom-orange text-black"
                              : "text-gray-700"
                          }`}
                          onClick={() => setOpenTab(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </ul>
                  )}
                </li>
              ) : null
            )}
            {isProjectDetailsRoute && (
              <div
                className="absolute bottom-0 w-full mx-auto bg-custom-green flex gap-3 justify-start ps-10 items-center  cursor-pointer"
                onClick={() => {
                  setOpenTab(!openTab);
                  router.push("/project");
                }}
              >
                <MoveLeft />
                <button className="text-white  py-3 cursor-pointer">
                  Back to Project
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SidePannel;
