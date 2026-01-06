import React, { useState, useEffect, useMemo, useContext } from "react";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { PackagePlus, X } from "lucide-react";
import Table from "../../components/table";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { ConfirmModal } from "../../components/AllComponents";
import { toast } from "react-toastify";

function PricingPlanPage(props) {
  const [plans, setPlans] = useState([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useContext(userContext);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    itemsPerPage: 4,
  });

  const [formData, setFormData] = useState({
    name: "",
    projectLimit: "",
    priceMonthly: "",
    priceYearly: "",
    currency: "USD",
  });

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (user?._id) {
        getAllPlan(currentPage, 10);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [user, currentPage]);

  const getAllPlan = async () => {
    props.loader(true);
    let url = `price-plan/getAllPlan`;
    Api("get", url, router).then(
      (res) => {
        props.loader(false);
        setPlans(res.data?.data);
      },
      (err) => {
        props.loader(false);
        toast.error(err?.message);
      }
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.projectLimit ||
      !formData.priceMonthly ||
      !formData.priceYearly
    ) {
      toast.info("Please fill all required fields");
      return;
    }
    const data = {
      name: formData.name,
      projectLimit: formData?.projectLimit,
      priceMonthly: formData?.priceMonthly,
      priceYearly: formData?.priceYearly,
      currency: formData?.currency,
    };

    const url = editId
      ? `price-plan/updatePlan/${editId}`
      : "price-plan/createPlan";
    Api("post", url, data, router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(res?.data?.message);
          getAllPlan();
          resetForm();
        } else {
          toast.error(res?.data?.message || "Failed to saved");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.data?.message || "An error occurred");
      });
  };

  const handleDeleteConfirm = async () => {
    const planId = editId;
    props.loader(true);
    Api("delete", `price-plan/deleteplan/${planId}`, "", router)
      .then((res) => {
        props.loader(false);
        if (res?.status === true) {
          toast.success(res?.data?.message || "Project deleted successfully");
          getAllPlan();
          setEditId("");
          setIsConfirmOpen(false);
        } else {
          toast.error(res?.data?.message || "Failed to deleted a project");
        }
      })
      .catch((err) => {
        props.loader(false);
        toast.error(err?.data?.message || "An error occurred");
      });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      projectLimit: "",
      priceMonthly: "",
      priceYearly: "",
      currency: "USD",
    });
    setOpen(false);
    setEditMode(false);
    setSelectedPlan(null);
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setEditId(plan._id);
    setFormData({
      name: plan.name,
      projectLimit: plan?.projectLimit?.toString(),
      priceMonthly: plan?.priceMonthly?.toString(),
      priceYearly: plan?.priceYearly?.toString(),
      currency: plan?.currency,
    });
    setEditMode(true);
    setOpen(true);
  };

  const handleDelete = (id) => {
    setEditId(id);
    setIsConfirmOpen(true);
  };

  const PlanName = ({ value }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <p className="text-black text-base font-semibold">{value}</p>
      </div>
    );
  };

  const ProjectLimit = ({ value }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <p className="text-black text-base font-normal">{value} projects</p>
      </div>
    );
  };

  const PriceMonthly = ({ value }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <p className="text-black text-base font-normal">${value}/mo</p>
      </div>
    );
  };

  const PriceYearly = ({ value }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <p className="text-black text-base font-normal">${value}/yr</p>
      </div>
    );
  };

  const Currency = ({ value }) => {
    return (
      <div className="p-4 flex items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const ActionHandler = ({ row }) => {
    return (
      <div className="flex items-center justify-center gap-2">
        <button
          className="p-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          onClick={() => handleEdit(row.original)}
        >
          <FiEdit className="text-[20px] text-blue-600" />
        </button>
        <button
          className="p-2 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          onClick={() => handleDelete(row.original._id)}
        >
          <RiDeleteBinLine className="text-[20px] text-red-600" />
        </button>
      </div>
    );
  };

  const columns1 = useMemo(
    () => [
      {
        Header: "PlanName",
        accessor: "name",
        Cell: PlanName,
      },
      {
        Header: "Project Limit",
        accessor: "projectLimit",
        Cell: ProjectLimit,
      },
      {
        Header: "Price Monthly",
        accessor: "priceMonthly",
        Cell: PriceMonthly,
      },
      {
        Header: "Price Yearly",
        accessor: "priceYearly",
        Cell: PriceYearly,
      },
      {
        Header: "Currency",
        accessor: "currency",
        Cell: Currency,
      },

      {
        Header: "ACTION",
        Cell: ActionHandler,
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Pricing Plans</h1>
          <button
            onClick={() => setOpen(true)}
            className="px-6 py-3 bg-custom-yellow cursor-pointer text-black rounded-lg font-medium  transition-colors"
          >
            Add New Plan
          </button>
        </div>

        <div className="bg-custom-black rounded-lg shadow-md overflow-hidden">
          {/* <p className="text-white text-lg px-4 mt-4">All Plan Details </p> */}
          <div>
            {plans.length === 0 ? (
              <div>
                <div className="bg-custom-black flex flex-col items-center justify-center min-h-[580px] p-8 text-center border rounded-xl bg-gray-50">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
                    <PackagePlus className="w-8 h-8 text-gray-500" />
                  </div>

                  {/* Big Message */}
                  <h2 className="text-xl font-semibold text-gray-300">
                    No Pricing Plans Found
                  </h2>

                  {/* Small Message */}
                  <p className="mt-2 text-sm text-gray-500 max-w-md">
                    You haven’t added any pricing plans yet. Create your first
                    plan to start offering your product with flexible pricing.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table
                  columns={columns1}
                  data={plans}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                  currentPage={currentPage}
                  itemsPerPage={pagination.itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-custom-black rounded-2xl p-6 w-full max-w-lg mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-100">
                  {editMode ? "Edit Plan" : "Add New Plan"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-white"
                    placeholder="e.g., Starter, Team, Pro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">
                    Project Limit *
                  </label>
                  <input
                    type="number"
                    name="projectLimit"
                    value={formData.projectLimit}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-white"
                    placeholder="e.g., 5, 20, 100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">
                    Monthly Price *
                  </label>
                  <input
                    type="number"
                    name="priceMonthly"
                    value={formData.priceMonthly}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-white"
                    placeholder="e.g., 9.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">
                    Yearly Price *
                  </label>
                  <input
                    type="number"
                    name="priceYearly"
                    value={formData.priceYearly}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-white"
                    placeholder="e.g., 99.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-100 mb-1">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-white"
                  >
                    <option value="USD">USD</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-200 rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-custom-yellow text-black rounded-lg font-medium transition-colors cursor-pointer"
                  >
                    {editMode ? "Update Plan" : "Create Plan"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={isConfirmOpen}
          setIsOpen={setIsConfirmOpen}
          title="Delete Project"
          message={`Are you sure you want to delete this Project"?`}
          onConfirm={handleDeleteConfirm}
          yesText="Yes, Delete"
          noText="Cancel"
        />
      </div>
    </div>
  );
}

export default PricingPlanPage;
