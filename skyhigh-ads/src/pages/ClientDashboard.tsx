import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

interface Campaign {
  id: number;
  name: string;
  budget: number;
  status: string;
  mediaFiles: string[];
}

export default function ClientDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/campaigns`)
      .then((res) => res.json())
      .then(setCampaigns)
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { title: "Active Campaigns", value: "5", trend: "+2" },
          { title: "Total Spend", value: "$32,400", trend: "+18%" },
          { title: "Billboards Booked", value: "18", trend: "+6" },
          { title: "Total Impressions", value: "45M", trend: "+22%" },
        ].map((item) => (
          <div
            key={item.title}
            className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between"
          >
            <p className="text-gray-600">{item.title}</p>
            <h2 className="text-2xl font-semibold">{item.value}</h2>
            <p className="text-green-500 text-sm">{item.trend}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">My Campaigns</h2>

      <div className="grid grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white rounded-2xl shadow-md p-5">
            <h3 className="text-lg font-semibold">{c.name}</h3>
            <p>Status: <span className="font-medium">{c.status}</span></p>
            <p>Budget: ${c.budget}</p>
            <p>Media Files: {c.mediaFiles.length}</p>
            <div className="flex justify-between mt-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Edit</button>
              <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
