import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  User2,
  X,
  Users,
  Calendar,
  CreditCard,
  Receipt,
  Search,
  Projector,
  MapPin,
  CalendarClock,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const mockBillingHistory = [
  {
    _id: "1",
    amount: 98,
    currency: "USD",
    billingType: "monthly",
    paymentStatus: "success",
    transactionId: "TXN123456789",
    paidAt: "2026-01-05T04:59:47.254+00:00",
  },
  {
    _id: "2",
    amount: 98,
    currency: "USD",
    billingType: "monthly",
    paymentStatus: "success",
    transactionId: "TXN987654321",
    paidAt: "2025-12-05T04:59:47.254+00:00",
  },
];

function Organization(props) {
  const [allOrganization, setAllOrganization] = useState();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [allTeamMember, setAllTeamMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDetails, setBillingDetails] = useState([]);
  const [lastPayment, setLastPayment] = useState({});
  const [allProject, setAllProject] = useState([]);
  const router = useRouter();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateDaysLeft = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    getAllUsers();
  }, [searchQuery]);

  const getAllUsers = async () => {
    props.loader(true);

    let url = `auth/getAllUser?role=Organization`;

    if (searchQuery?.trim()) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    Api("get", url, "", router).then(
      (res) => {
        props.loader(false);
        setAllOrganization(res.data?.data);
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message);
      }
    );
  };

  const getAllmember = async (id) => {
    props.loader(true);

    let url = `auth/getAllTeamMembersAdmin?id=${id}`;

    Api("get", url, "", router).then(
      (res) => {
        props.loader(false);
        setAllTeamMember(res.data?.data);
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message);
      }
    );
  };

  const Card = ({ title, icon: Icon, children }) => (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-all">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-blue-400" />
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
      </div>
      {children}
    </div>
  );

  const fetchPaymentHistory = async (id) => {
    props.loader(true);
    try {
      const res = await Api(
        "get",
        `auth/paymenthistory?userId=${id}`,
        {},
        router
      );
      setBillingDetails(res?.data.payments || []);
      setLastPayment(res?.data.payments[0] || {});
      props.loader(false);
    } catch (err) {
      toast.error(err.message || "Failed to load billing history");
    }
  };

  const fetchAllPRoject = async (id) => {
    props.loader(true);
    try {
      const res = await Api(
        "get",
        `project/getAllProjectforAdmin?userId=${id}`,
        {},
        router
      );
      setAllProject(res?.data.data || []);
      props.loader(false);
    } catch (err) {
      toast.error(err.message || "Failed to load billing history");
    }
  };
  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "Planning":
        return `${baseClasses} text-[#e0f349] bg-[#e0f349]/20`;
      case "In Progress":
        return `${baseClasses} text-[#00bcd4] bg-[#00bcd4]/20`;
      case "Completed":
        return `${baseClasses} text-[#4caf50] bg-[#4caf50]/20`;
      default:
        return `${baseClasses} text-gray-400 bg-gray-700`;
    }
  };
  const handleViewDetails = (org) => {
    setSelectedOrg(org);
    fetchPaymentHistory(org._id);
    fetchAllPRoject(org._id);
    // setBillingDetails(mockBillingHistory);
  };

  const handleViewMember = (org) => {
    getAllmember(org._id);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Organizations</h1>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-custom-black border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-custom-black rounded-lg shadow-md overflow-hidden">
          {allOrganization?.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[580px] p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-800">
                <User2 className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-300">
                {searchQuery ? "No Results Found" : "No Organizations Found"}
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "You haven't added any organizations yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-custom-yellow border-b border-gray-700">
                  <tr>
                    <th className="min-w-44 px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Name
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Email
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Phone
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Plan
                    </th>
                    <th className="min-w-44 px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Team Size
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Billing
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Status
                    </th>
                    <th className="px-6 py-2.5 text-center text-sm font-semibold text-black">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 overflow-x-auto">
                  {allOrganization?.map((org) => (
                    <tr
                      key={org._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-2.5">
                        <p className="text-white font-medium">{org.name}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300">{org.email}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300">{org.phone}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                          {org.subscription?.planName}
                        </span>
                      </td>
                      <td
                        className="px-6 py-2.5"
                        onClick={() => handleViewMember(org)}
                      >
                        <p className="text-gray-300 hover:underline cursor-pointer hover:text-[#e0f349]">
                          {org.subscription?.teamSize} members
                        </p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300 capitalize">
                          {org.subscription?.billingType}
                        </p>
                      </td>
                      <td className="px-6 py-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            org.subscription?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {org.subscription?.status}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-center min-w-50">
                        <button
                          onClick={() => handleViewDetails(org)}
                          className="inline-flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-blue-400 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedOrg && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-custom-black rounded-2xl p-3 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  Organization Details
                </h2>
                <button
                  onClick={() => {
                    setSelectedOrg(null);
                    setAllProject([]);
                    setLastPayment({});
                    setBillingDetails([]);
                  }}
                  className="p-2 hover:bg-gray-800 cursor-pointer rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white font-medium">{selectedOrg.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">
                      {selectedOrg.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium">
                      {selectedOrg.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Role</p>
                    <p className="text-white font-medium">{selectedOrg.role}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card title="Team Size" icon={Users}>
                  <div className="flex items-center gap-2 text-2xl font-bold text-white">
                    {selectedOrg.subscription?.teamSize}{" "}
                    {selectedOrg.subscription?.teamSize === 1
                      ? "Member"
                      : "Members"}
                  </div>
                </Card>

                <Card title="Billing Cycle" icon={Calendar}>
                  <p className="text-xl font-bold text-white capitalize mb-1">
                    {lastPayment?.billingType}
                  </p>
                  <p className="text-sm text-gray-400">
                    $
                    {lastPayment?.billingType === "monthly"
                      ? lastPayment.planId?.priceMonthly
                      : lastPayment.planId?.priceYearly}{" "}
                    per{" "}
                    {selectedOrg.subscription?.billingType === "monthly"
                      ? "month"
                      : "year"}
                  </p>
                </Card>

                <Card title="Total Amount" icon={CreditCard}>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${lastPayment?.amount}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    per{" "}
                    {lastPayment?.billingType === "monthly" ? "month" : "year"}
                  </p>
                </Card>

                <Card title="Next Billing" icon={Calendar}>
                  <p className="text-lg font-semibold text-white mb-2">
                    {formatDate(selectedOrg.subscription?.planEndDate)}
                  </p>
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30 font-medium">
                    {calculateDaysLeft(selectedOrg.subscription?.planEndDate)}{" "}
                    {calculateDaysLeft(
                      selectedOrg.subscription?.planEndDate
                    ) === 1
                      ? "day"
                      : "days"}{" "}
                    left
                  </span>
                </Card>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Receipt className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    Billing History
                  </h3>
                </div>

                {billingDetails.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No billing history found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {billingDetails.map((item, index) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 bg-gradient-to-r from-gray-800/30 to-gray-700/20"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 mt-1">
                            <CreditCard className="w-5 h-5 text-purple-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-white capitalize">
                                {item.billingType} Subscription
                              </p>
                              {index === 0 && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  Latest
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Paid on {formatDate(item.paidAt)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-mono">
                              Txn: {item.transactionId}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xl font-bold text-white mb-2">
                            ${item.amount}{" "}
                            <span className="text-sm text-gray-400">
                              {item.currency}
                            </span>
                          </p>
                          <span className="inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30 capitalize font-medium">
                            {item.paymentStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                    <Projector className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">
                    All Projects
                  </h3>
                </div>

                {allProject.length === 0 ? (
                  <div className="text-center py-12">
                    <Projector className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No project found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allProject.map((project, key) => (
                      <div
                        key={key}
                        className="flex justify-between items-center border border-gray-700/50 rounded-xl p-5 hover:border-gray-600/50 transition-all duration-300 bg-gradient-to-r from-gray-800/30 to-gray-700/20"
                      >
                        <div className="flex flex-col gap-4">
                          {/* Top Section */}
                          <div className="flex flex-col md:flex-row md:justify-between gap-4">
                            {/* Left Content */}
                            <div className="flex flex-col gap-2">
                              <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-lg font-semibold text-white">
                                  {project?.projectName}
                                </h3>
                                <span
                                  className={getStatusBadge(project?.status)}
                                >
                                  {project?.status}
                                </span>
                              </div>

                              <div className="flex flex-col gap-2 text-sm text-white">
                                <div className="flex items-center gap-1">
                                  <MapPin size={18} />
                                  <span>{project?.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CalendarClock size={18} />
                                  <span>
                                    Last Updated:{" "}
                                    {new Date(
                                      project?.updatedAt
                                    ).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {allTeamMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-custom-black rounded-2xl p-6 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white ">
                Team Members
              </h2>
              <button
                onClick={() => setAllTeamMember(null)}
                className="p-2 hover:bg-gray-800 cursor-pointer rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            {allTeamMember.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H1v-2a4 4 0 014-4h1m8-4a4 4 0 11-8 0 4 4 0 018 0zm6 4a3 3 0 10-6 0 3 3 0 006 0z"
                    />
                  </svg>
                </div>

                <p className="text-white text-lg font-medium">
                  No team members found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allTeamMember.map((member, key) => (
                  <div
                    key={key}
                    className="bg-[#1e1e1e] rounded-xl p-5 border border-white/10 hover:border-white/20 transition"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {member?.name || "N/A"}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-400">Email:</span>{" "}
                        {member?.email || "N/A"}
                      </p>
                      <p>
                        <span className="text-gray-400">Phone:</span>{" "}
                        {member?.phone || "N/A"}
                      </p>
                      <p>
                        <span className="text-gray-400">Role:</span>{" "}
                        {member?.role || "N/A"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                    ${
                      member?.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                      >
                        {member?.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Organization;
