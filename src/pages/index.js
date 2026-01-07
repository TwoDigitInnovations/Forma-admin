import { Api } from "@/services/service";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function AdminDashboard(props) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [weeklyData, setWeeklyData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    props.loader(true);
    try {
      const [statsRes, weeklyRes, paymentsRes, revenueRes, recentRes] =
        await Promise.all([
          Api("get", "user/dashboard/stats", {}, router),
          Api("get", "user/dashboard/weekly-registrations", {}, router),
          Api("get", "user/dashboard/payments", {}, router),
          Api("get", "user/dashboard/monthly-revenue", {}, router),
          Api("get", "user/dashboard/recent-payments", {}, router),
        ]);

      if (statsRes?.data?.status) {
        setStats(statsRes.data.data);
      }

      if (weeklyRes?.data?.status) {
        setWeeklyData(weeklyRes.data.data);
      }

      if (paymentsRes?.data?.status) {
        setPaymentData(paymentsRes.data.data);
      }

      if (revenueRes?.data?.status) {
        setRevenueData(revenueRes.data.data);
      }

      if (recentRes?.data?.status) {
        setRecentPayments(recentRes.data.data);
      }
      
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      props.loader(false);
    }
  };

  const COLORS = ["#FFD700", "#FFA500", "#FF8C00"];

  // if (loading) {
  //   return (
  //     <section className="bg-[#000000] min-h-screen flex items-center justify-center">
  //       <div className="text-custom-yellow text-2xl">Loading...</div>
  //     </section>
  //   );
  // }

  return (
    <section className="bg-[#000000] md:p-6 p-3 text-white ">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="bg-[#1a1a1a] md:py-6 py-4 md:px-6 px-3 rounded-2xl">
          <h1 className="text-3xl font-bold text-custom-yellow">Admin Dashboard</h1>
          <p className="md:text-[16px] text-[14px] text-gray-300 mt-1">
            Monitor registrations, payments, and platform analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-custom-green p-5 rounded-xl shadow-lg">
            <p className="text-gray-200 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold text-white mt-2">
              {stats?.totalUsers?.toLocaleString()}
            </h2>
            <p className="text-custom-yellow text-sm mt-2">
              +{stats?.weeklyGrowth}% this week
            </p>
          </div>

          <div className="bg-custom-green p-5 rounded-xl shadow-lg">
            <p className="text-gray-200 text-sm">Organizations</p>
            <h2 className="text-3xl font-bold text-white mt-2">
              {stats?.totalOrganizations?.toLocaleString()}
            </h2>
            <p className="text-custom-yellow text-sm mt-2">Active accounts</p>
          </div>

          <div className="bg-custom-green p-5 rounded-xl shadow-lg">
            <p className="text-gray-200 text-sm">Total Revenue</p>
            <h2 className="text-3xl font-bold text-white mt-2">
              ${stats?.totalRevenue?.toLocaleString()}
            </h2>
            <p className="text-custom-yellow text-sm mt-2">All time</p>
          </div>

          <div className="bg-custom-green p-5 rounded-xl shadow-lg">
            <p className="text-gray-200 text-sm">Active Subscriptions</p>
            <h2 className="text-3xl font-bold text-white mt-2">
              {stats?.activeSubscriptions?.toLocaleString()}
            </h2>
            <p className="text-custom-yellow text-sm mt-2">Current plans</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <h3 className="text-xl font-bold text-custom-yellow mb-4">
              Weekly Registrations
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #FFD700",
                  }}
                  labelStyle={{ color: "#FFD700" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="#FFD700"
                  strokeWidth={2}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="organizations"
                  stroke="#1a4d2e"
                  strokeWidth={2}
                  name="Organizations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Plans Distribution */}
          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <h3 className="text-xl font-bold text-custom-yellow mb-4">
              Plan Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #FFD700",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl">
          <h3 className="text-xl font-bold text-custom-yellow mb-4">
            Monthly Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #FFD700",
                }}
                labelStyle={{ color: "#FFD700" }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#FFD700" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-custom-yellow">
              Recent Payments
            </h3>
            <button
              className=" cursor-pointer text-custom-yellow hover:underline text-sm"
              onClick={() => router.push("/billingPage")}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">
                    User/Organization
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">Plan</th>
                  <th className="text-left py-3 px-4 text-gray-300">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-gray-800 hover:bg-[#222]"
                  >
                    <td className="py-3 px-4">{payment.user}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#1a4d2e] px-3 py-1 rounded-full text-sm">
                        {payment.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-custom-yellow font-semibold">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-400">{payment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
