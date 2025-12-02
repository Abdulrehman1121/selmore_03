import { useEffect, useState } from "react";
import { DollarSign, Home, Calendar, Eye, Plus, Edit, MoreVertical, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface Billboard {
  id: number;
  title: string;
  location: string;
  city: string;
  price: number;
  priceType: string;
  bookingType: string;
  type: string;
  image: string | null;
  bookings: any[];
  bids: any[];
}

interface DashboardStats {
  totalRevenue: number;
  activeBillboards: number;
  totalBookings: number;
  totalImpressions: number;
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("billboards");
  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    activeBillboards: 0,
    totalBookings: 0,
    totalImpressions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBillboard, setNewBillboard] = useState({
    title: "",
    location: "",
    city: "",
    price: "",
    priceType: "per_day",
    bookingType: "direct",
    type: "digital",
  });

  useEffect(() => {
    fetchBillboards();
  }, []);

  const fetchBillboards = () => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/billboards`)
      .then((res) => res.json())
      .then((data) => {
        setBillboards(data);
        calculateStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching billboards:", err);
        setLoading(false);
      });
  };

  const calculateStats = (billboardData: Billboard[]) => {
    const totalRevenue = billboardData.reduce((sum, b) => {
      const bookingRevenue = b.bookings.reduce((bSum, booking) => bSum + (booking.totalPrice || 0), 0);
      return sum + bookingRevenue;
    }, 0);

    const activeBillboards = billboardData.length;

    const totalBookings = billboardData.reduce((sum, b) => sum + b.bookings.length, 0);

    const totalImpressions = totalBookings * 100000;

    setStats({
      totalRevenue,
      activeBillboards,
      totalBookings,
      totalImpressions,
    });
  };

  const handleAddBillboard = async () => {
    if (!newBillboard.title || !newBillboard.location || !newBillboard.city || !newBillboard.price) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/billboards`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newBillboard,
          price: parseFloat(newBillboard.price),
        }),
      });

      if (response.ok) {
        fetchBillboards();
        setShowAddModal(false);
        setNewBillboard({
          title: "",
          location: "",
          city: "",
          price: "",
          priceType: "per_day",
          bookingType: "direct",
          type: "digital",
        });
        alert("Billboard added successfully!");
      } else {
        const error = await response.json();
        alert(`Failed to add billboard: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error adding billboard:", error);
      alert("Error adding billboard. Make sure you're logged in.");
    }
  };

  const formatImpressions = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-yellow-400" />
        </div>
        <span className="text-xs text-zinc-500 border border-zinc-700 px-2 py-1 rounded">
          +12.5%
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-sm text-zinc-400">{title}</p>
    </div>
  );

  const BillboardCard = ({ billboard }: { billboard: Billboard }) => {
    const hasActiveBooking = billboard.bookings.some(b => b.status === 'confirmed');

    return (
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {billboard.image && (
          <img
            src={`${API_BASE_URL}${billboard.image}`}
            alt={billboard.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">{billboard.title}</h3>
              <p className="text-sm text-zinc-400 flex items-center gap-1">
                <span>📍</span> {billboard.location}, {billboard.city}
              </p>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded ${hasActiveBooking
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-zinc-700 text-zinc-400"
                }`}
            >
              {hasActiveBooking ? "Active" : "Available"}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Price:</span>
              <span className="text-white font-medium">
                ${billboard.price.toLocaleString()}/{billboard.priceType}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Bookings:</span>
              <span className="text-white font-medium">{billboard.bookings.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Bids:</span>
              <span className="text-white font-medium">{billboard.bids.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Type:</span>
              <span className="text-white font-medium capitalize">{billboard.type}</span>
            </div>
          </div>

          {hasActiveBooking && (
            <div className="bg-zinc-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">✅ Current Booking</span>
              </div>
              <p className="text-sm text-white font-medium mb-1">
                Active booking
              </p>
              <p className="text-xs text-zinc-400">
                {billboard.bookings[0]?.startDate || "N/A"} - {billboard.bookings[0]?.endDate || "N/A"}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex-1 bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition">
              Edit
            </button>
            <button className="flex-1 bg-zinc-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-700 transition border border-zinc-700">
              View Details
            </button>
            <button className="bg-zinc-800 text-white p-2 rounded-lg hover:bg-zinc-700 transition border border-zinc-700">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Add Billboard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-zinc-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Add New Billboard</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Billboard Title *</label>
                <input
                  type="text"
                  value={newBillboard.title}
                  onChange={(e) => setNewBillboard({ ...newBillboard, title: e.target.value })}
                  placeholder="e.g., Times Square Digital"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={newBillboard.location}
                    onChange={(e) => setNewBillboard({ ...newBillboard, location: e.target.value })}
                    placeholder="e.g., Manhattan"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    value={newBillboard.city}
                    onChange={(e) => setNewBillboard({ ...newBillboard, city: e.target.value })}
                    placeholder="e.g., New York"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($) *</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newBillboard.price}
                    onChange={(e) => setNewBillboard({ ...newBillboard, price: e.target.value })}
                    placeholder="e.g., 5000"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price Type</label>
                  <select
                    value={newBillboard.priceType}
                    onChange={(e) => setNewBillboard({ ...newBillboard, priceType: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="per_day">Per Day</option>
                    <option value="per_week">Per Week</option>
                    <option value="per_month">Per Month</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Billboard Type</label>
                  <select
                    value={newBillboard.type}
                    onChange={(e) => setNewBillboard({ ...newBillboard, type: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="digital">Digital</option>
                    <option value="static">Static</option>
                    <option value="led">LED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Booking Type</label>
                  <select
                    value={newBillboard.bookingType}
                    onChange={(e) => setNewBillboard({ ...newBillboard, bookingType: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-400"
                  >
                    <option value="direct">Direct Booking</option>
                    <option value="bidding">Bidding</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-zinc-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-zinc-700 transition border border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBillboard}
                  className="flex-1 bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
                >
                  Add Billboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
              <p className="text-zinc-400">Manage your billboards and bookings</p>
            </div>
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-5 h-5" />
              Add Billboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            color="bg-yellow-500/20"
          />
          <StatCard
            icon={Home}
            title="Active Billboards"
            value={stats.activeBillboards}
            color="bg-yellow-500/20"
          />
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={stats.totalBookings}
            color="bg-yellow-500/20"
          />
          <StatCard
            icon={Eye}
            title="Total Impressions"
            value={formatImpressions(stats.totalImpressions)}
            color="bg-yellow-500/20"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-zinc-800">
          {["My Billboards", "Bookings", "Bids", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(" ", ""))}
              className={`pb-3 text-sm font-medium transition ${activeTab === tab.toLowerCase().replace(" ", "")
                ? "text-white border-b-2 border-yellow-400"
                : "text-zinc-400 hover:text-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Billboards Grid */}
        {loading ? (
          <div className="text-center py-12 text-zinc-400">Loading billboards...</div>
        ) : billboards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-zinc-400 mb-4">No billboards found</div>
            <button
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
              onClick={() => setShowAddModal(true)}
            >
              Add Your First Billboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {billboards.map((billboard) => (
              <BillboardCard key={billboard.id} billboard={billboard} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}