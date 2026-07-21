import { useState } from "react";
import { Users, UserCheck, UserMinus, DollarSign } from "lucide-react";
import { cn } from "@lib/utils";

const Dashboard = () => {
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", contact: "123-456-7890", gender: "Male", checkIn: "08:30 AM", feeStatus: "paid" },
    { id: 2, name: "Jane Smith", contact: "987-654-3210", gender: "Female", checkIn: "09:15 AM", feeStatus: "unpaid" },
    { id: 3, name: "Mike Johnson", contact: "555-555-5555", gender: "Male", checkIn: "10:00 AM", feeStatus: "paid" },
  ]);

  const stats = [
    { label: "Total Members", value: "150", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Today's Attendees", value: "45", icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Today's Absents", value: "105", icon: UserMinus, color: "text-red-600", bg: "bg-red-100" },
    { label: "Total Revenue", value: "PKR 4,500", icon: DollarSign, color: "text-primary", bg: "bg-primary/10" },
  ];

  const toggleFeeStatus = (id) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, feeStatus: m.feeStatus === "paid" ? "unpaid" : "paid" } : m
      )
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="mt-1 text-2xl font-bold text-foreground">{stat.value}</h3>
              </div>
              <div className={cn("rounded-xl p-3", stat.bg)}>
                <stat.icon className={cn("h-6 w-6", stat.color)} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Check-ins table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Today's Check-ins</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-3 font-medium">Member Name</th>
                <th className="px-6 py-3 font-medium">Contact</th>
                <th className="px-6 py-3 font-medium">Gender</th>
                <th className="px-6 py-3 font-medium">Check-in Time</th>
                <th className="px-6 py-3 font-medium text-center">Fee Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {members.map((member) => (
                <tr key={member.id} className="transition-colors hover:bg-muted/20">
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-foreground">{member.name}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.contact}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.gender}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">{member.checkIn}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <button
                      onClick={() => toggleFeeStatus(member.id)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-semibold uppercase transition-all",
                        member.feeStatus === "paid"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      )}
                    >
                      {member.feeStatus}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
