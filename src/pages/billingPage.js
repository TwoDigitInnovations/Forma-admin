import React, { useState, useEffect, useMemo } from "react";
import {
  Eye,
  User2,
  X,
  users,
  Calendar,
  CreditCard,
  Receipt,
  Search,
} from "lucide-react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";

function billingPage(props) {
  const [allUser, setAllUser] = useState();
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [billingDetails, setBillingDetails] = useState([]);
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
    getAllPayments();
  }, [searchQuery]);

  const getAllPayments = async () => {
    props.loader(true);

    let url = `payment/getAllPayment`;
    Api("get", url, "", router).then(
      (res) => {
        props.loader(false);
        setAllUser(res.data?.data);
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

  const handleViewDetails = (org) => {
    setSelectedOrg(org);
    // fetchPaymentHistory(org._id);
    // setBillingDetails(org);
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Payments</h1>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or plan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="bg-custom-black rounded-lg shadow-md overflow-hidden">
          {allUser?.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[580px] p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-800">
                <User2 className="w-8 h-8 text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-300">
                {searchQuery ? "No Results Found" : "No Payments Found"}
              </h2>
              <p className="mt-2 text-sm text-gray-500 max-w-md">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "You haven't added any Payments yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-custom-yellow border-b border-gray-700">
                  <tr>
                    <th className="min-w-32 px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Name
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Payment Method
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Payment Status
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Billing Type
                    </th>
                    <th className="  px-6 py-2.5 text-left text-sm font-semibold text-black">
                      Amount
                    </th>
                    <th className=" px-6 py-2.5 text-left text-sm font-semibold text-black">
                      PaidAt
                    </th>
                    <th className="px-6 py-2.5 text-left text-sm font-semibold text-black">
                      PlanName
                    </th>
                    <th className="min-w-50 px-6 py-2.5 text-center text-sm font-semibold text-black">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {allUser?.map((org) => (
                    <tr
                      key={org._id}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="px-6 py-2.5">
                        <p className="text-white font-medium">
                          {org?.userId?.name}
                        </p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300">{org?.paymentMethod}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300">{org?.paymentStatus}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-sm font-medium">
                          {org.billingType}
                        </span>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300">${org.amount}</p>
                      </td>
                      <td className="px-6 py-2.5">
                        <p className="text-gray-300 capitalize">
                          {org?.paidAt
                            ? moment(org.paidAt).format("DD MMM YYYY, hh:mm A")
                            : "N/A"}
                        </p>
                      </td>
                      <td className="px-6 py-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium `}
                        >
                          {org.planId?.name}
                        </span>
                      </td>
                      <td className="px-6 py-2.5 text-center">
                        <button
                          onClick={() => handleViewDetails(org)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors text-blue-400 font-medium cursor-pointer"
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
            <div className="bg-custom-black rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-100">
                  Payment Details
                </h2>
                <button
                  onClick={() => setSelectedOrg(null)}
                  className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="text-white font-medium">
                      {selectedOrg.userId.name || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">
                      {selectedOrg.userId.email || "_"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium">
                      {selectedOrg.userId.phone || "_"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Ragister Date.</p>
                    <p className="text-white font-medium">
                      {new Date(selectedOrg.userId.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Customer Status</p>
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-400">
                      {selectedOrg.userId?.status}
                    </span>
                  </div>
                </div>
              </div>


              <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Payment Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Transaction ID</p>
                    <p className="text-white font-medium">
                      {selectedOrg.transactionId || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Currency</p>
                    <p className="text-white font-medium">
                      {selectedOrg.currency || "USD"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Payment Date</p>
                    <p className="text-white font-medium">
                      {new Date(selectedOrg.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Subscription Status</p>
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-500/20 text-green-400">
                      {selectedOrg.userId.subscription?.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Plan Name</p>
                    <p className="text-white font-medium">
                      {selectedOrg.planId?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Project Limit</p>
                    <p className="text-white font-medium">
                      {selectedOrg.planId?.projectLimit}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Monthly Price</p>
                    <p className="text-white font-medium">
                      ${selectedOrg.planId?.priceMonthly}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Yearly Price</p>
                    <p className="text-white font-medium">
                      ${selectedOrg.planId?.priceYearly}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Teams Used</p>
                    <p className="text-white font-medium">
                      {selectedOrg.userId.subscription?.usedTeamsSize}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default billingPage;
