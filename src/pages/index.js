import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  FolderPlus,
  DollarSign,
  Dock,
  PiggyBank,
  Clock,
  MessageSquare,
  StickyNote,
  SquareCheckBig,
} from "lucide-react";
import { Api } from "@/services/service";
import isAuth from "../../components/isAuth";
import { userContext } from "./_app";
import { toast } from "react-toastify";

import {
  ActionPoints,
  AllGrievances,
  AllIncident,
  ProjectBehind,
} from "../../components/AllComponents";

function Home(props) {
  const router = useRouter();
  const [user, setUser] = useContext(userContext);
  const [isOpen, setIsOpen] = useState(false);
  const [allProjectData, setAllProjectData] = useState([]);
  const [dashboardData, setDashboardData] = useState({});
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [projectBehind, setProjectBehind] = useState(false);
  const [grievancesOpen, setGrievancesOpen] = useState(false);

  useEffect(() => {
    getAllProject();
  }, []);

  const getAllProject = async () => {
    props?.loader(true);
    Api("get", `project/getAllProjects?OrganizationId=${user?._id}`, "", router)
      .then((res) => {
        props?.loader(false);
        if (res?.status === true) {
          setAllProjectData(res?.data?.data || []);
        } else {
          toast.error(res?.message || "Failed to fetch projects");
        }
      })
      .catch((err) => {
        props?.loader(false);
        toast.error(err?.message || "An error occurred");
      });
  };

  return (
    <section className=" bg-[#000000] md:p-6 p-3 text-white h-screen">
      <div className="max-w-7xl mx-auto h-full space-y-3 md:space-y-4 overflow-y-scroll scrollbar-hide overflow-scroll pb-28 ">
        <div className="bg-custom-black md:py-6 py-4 md:px-6 px-3 flex flex-col md:flex-row gap-4 md:items-center justify-between rounded-2xl mb-4">
          <div>
            <h1 className="text-3xl font-bold text-custom-yellow">Dashboard</h1>
            <p className="md:text-[16px] text-[14px] text-white ">
              Key financial and project metrics overview.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}

export default isAuth(Home, ["Admin"]);

