import { useState, useEffect } from "react";
import { getPendingActivations, activateUser, rejectUser, getAllUsers, deactivateUser } from "../../services/authService";
import { FaCheck, FaTimes, FaExclamationTriangle, FaUserSlash, FaFilter, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import DashSidebar from "../../components/DashSidebar";
import Footer from "../../components/Footer";

const UserManagement = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [filteredPendingUsers, setFilteredPendingUsers] = useState([]);
  const [filteredActiveUsers, setFilteredActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [userToReject, setUserToReject] = useState(null);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [tab, setTab] = useState("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilters, setRoleFilters] = useState({
    customer: true,
    admin: true,
    restaurant_admin: true,
    delivery_person: true,
  });
  const navigate = useNavigate();

  // Role to color mapping
  const roleColors = {
    customer: "bg-indigo-100 text-indigo-800 border-indigo-300",
    admin: "bg-rose-100 text-rose-800 border-rose-300",
    restaurant_admin: "bg-emerald-100 text-emerald-800 border-emerald-300",
    delivery_person: "bg-sky-100 text-sky-800 border-sky-300",
  };

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view this page");
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") {
        setError("You do not have permission to access this page");
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setError("Authentication error. Please login again.");
      setLoading(false);
      return;
    }

    fetchUsers();
  }, []);

  // Apply filters when roleFilters or users change
  useEffect(() => {
    applyFilters();
  }, [roleFilters, pendingUsers, activeUsers, searchTerm]);

  const applyFilters = () => {
    // Filter pending users based on selected roles and search term
    const filtered_pending = pendingUsers.filter(
      (user) =>
        roleFilters[user.role] &&
        (searchTerm === "" ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPendingUsers(filtered_pending);

    // Filter active users based on selected roles and search term
    const filtered_active = activeUsers.filter(
      (user) =>
        roleFilters[user.role] &&
        (searchTerm === "" ||
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredActiveUsers(filtered_active);
  };

  const toggleRoleFilter = (role) => {
    setRoleFilters((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const resetFilters = () => {
    setRoleFilters({
      customer: true,
      admin: true,
      restaurant_admin: true,
      delivery_person: true,
    });
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");

      // Use the new getAllUsers endpoint
      const users = await getAllUsers();
      console.log("Response data:", users);

      if (!Array.isArray(users)) {
        console.error(
          "Unexpected API response format - expected array:",
          users
        );
        setError("Unexpected data format received from server");
        setLoading(false);
        return;
      }

      // Categorize users based on status
      const pending = users.filter(
        (user) => !user.isActive && (!user.status || user.status === "pending")
      );

      const active = users.filter(
        (user) => user.isActive || user.status === "active"
      );

      console.log(
        "Categorized users - Pending:",
        pending.length,
        "Active:",
        active.length
      );

      setPendingUsers(pending);
      setActiveUsers(active);
      setFilteredPendingUsers(pending);
      setFilteredActiveUsers(active);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching users:", err);

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        setError(
          "You are not authorized to view this page. Please log in with an admin account."
        );
      } else {
        setError(
          `Failed to load users: ${err.response?.data?.message || err.message}`
        );
      }
      setLoading(false);
    }
  };

  const handleActivate = async (userId) => {
    try {
      setLoading(true);
      await activateUser(userId);
      await fetchUsers();
    } catch (err) {
      console.error("Error activating user:", err);
      setError(
        `Failed to activate user: ${err.response?.data?.message || err.message}`
      );
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!userToDeactivate) return;

    try {
      setLoading(true);
      await deactivateUser(userToDeactivate.id);
      setUserToDeactivate(null);
      await fetchUsers();
    } catch (err) {
      console.error("Error deactivating user:", err);
      setError(
        `Failed to deactivate user: ${
          err.response?.data?.message || err.message
        }`
      );
      setLoading(false);
    }
  };

  const openRejectModal = (user) => {
    setUserToReject(user);
  };

  const openDeactivateModal = (user) => {
    setUserToDeactivate(user);
  };

  const handleReject = async () => {
    if (!userToReject || !rejectionReason.trim()) return;

    try {
      setLoading(true);
      await rejectUser(userToReject.id, rejectionReason);
      setUserToReject(null);
      setRejectionReason("");
      await fetchUsers();
    } catch (err) {
      console.error("Error rejecting user:", err);
      setError(
        `Failed to reject user: ${err.response?.data?.message || err.message}`
      );
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-grow">
        <DashSidebar />
        <div className="flex-1 mt-16 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-green-500 to-emerald-600">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  User Management
                </h1>
                <p className="text-green-100 mt-1">
                  Manage user accounts and permissions
                </p>
              </div>

              {/* Filters */}
              <div className="bg-gray-50 p-4 border-b border-gray-200">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FaFilter className="mr-2 text-green-500" />
                    <span className="font-medium">Filter by role:</span>
                  </div>
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full pl-10 p-2.5"
                      placeholder="Search by name or email..."
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes className="text-sm" />
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleRoleFilter("customer")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        roleFilters.customer
                          ? roleColors.customer
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => toggleRoleFilter("admin")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        roleFilters.admin
                          ? roleColors.admin
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => toggleRoleFilter("restaurant_admin")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        roleFilters.restaurant_admin
                          ? roleColors.restaurant_admin
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      Restaurant Admin
                    </button>
                    <button
                      onClick={() => toggleRoleFilter("delivery_person")}
                      className={`px-3 py-2 text-xs font-medium rounded-full border transition duration-200 ${
                        roleFilters.delivery_person
                          ? roleColors.delivery_person
                          : "bg-gray-100 text-gray-500 border-gray-300"
                      }`}
                    >
                      Delivery Person
                    </button>
                    <button
                      onClick={resetFilters}
                      className="px-3 py-2 text-xs font-medium rounded-full bg-green-600 text-white hover:bg-green-700 transition duration-200"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mx-4 my-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="mr-2" />
                    <p>{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="mt-2 text-sm text-red-700 hover:text-red-900"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Tab Navigation */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex space-x-4">
                  <button
                    onClick={() => setTab("pending")}
                    className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                      tab === "pending"
                        ? "bg-white text-green-600 border-t-2 border-l border-r border-t-green-500 border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Pending Approval ({filteredPendingUsers?.length || 0})
                  </button>
                  <button
                    onClick={() => setTab("active")}
                    className={`py-2 px-4 text-sm font-medium rounded-t-lg transition-colors ${
                      tab === "active"
                        ? "bg-white text-green-600 border-t-2 border-l border-r border-t-green-500 border-gray-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    Active Users ({filteredActiveUsers?.length || 0})
                  </button>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <>
                    {tab === "pending" && (
                      <>
                        {!filteredPendingUsers ||
                        filteredPendingUsers.length === 0 ? (
                          <div className="text-center py-16 text-gray-500">
                            <p className="text-lg">
                              No pending users to approve
                            </p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Email
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Role
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                                  >
                                    Registered
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>

                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPendingUsers.map((user) => (
                                  <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="text-sm text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
                                        {user.email}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          roleColors[user.role] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {user.role.replace("_", " ")}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">
                                      {new Date(
                                        user.createdAt
                                      ).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">
                                      <div className="flex justify-end space-x-2">
                                        <button
                                          onClick={() =>
                                            handleActivate(user.id)
                                          }
                                          className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 py-1 px-2 rounded transition-colors"
                                        >
                                          <FaCheck className="inline mr-1" />{" "}
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => openRejectModal(user)}
                                          className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 py-1 px-2 rounded transition-colors"
                                        >
                                          <FaTimes className="inline mr-1" />{" "}
                                          Reject
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}

                    {tab === "active" && (
                      <>
                        {!filteredActiveUsers ||
                        filteredActiveUsers.length === 0 ? (
                          <div className="text-center py-16 text-gray-500">
                            <p className="text-lg">No active users found</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Name
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Email
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Role
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                                  >
                                    Status
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filteredActiveUsers.map((user) => (
                                  <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {user.name}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="text-sm text-gray-500 truncate max-w-[150px] md:max-w-[200px]">
                                        {user.email}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          roleColors[user.role] ||
                                          "bg-gray-100 text-gray-800"
                                        }`}
                                      >
                                        {user.role.replace("_", " ")}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                                        Active
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-medium">
                                      <button
                                        onClick={() =>
                                          openDeactivateModal(user)
                                        }
                                        className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 py-1 px-2 rounded transition-colors"
                                      >
                                        <FaUserSlash className="inline mr-1" />{" "}
                                        Deactivate
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Rejection Modal */}
      {userToReject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Reject User
            </h2>
            <p className="mb-4">
              Are you sure you want to reject{" "}
              <span className="font-semibold">{userToReject.name}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for rejection (will be emailed to user):
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                rows="3"
                placeholder="Please provide a reason for rejection"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setUserToReject(null);
                  setRejectionReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-colors ${
                  rejectionReason.trim()
                    ? "bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    : "bg-rose-300 cursor-not-allowed"
                }`}
              >
                Reject User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Modal */}
      {userToDeactivate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Deactivate User
            </h2>
            <p className="mb-4">
              Are you sure you want to deactivate{" "}
              <span className="font-semibold">{userToDeactivate.name}</span>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This will prevent the user from logging in until their account is
              reactivated.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDeactivate(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
              >
                Deactivate User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserManagement;
