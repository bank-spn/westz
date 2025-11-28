/**
 * Get status color based on status description
 * 
 * Color mapping:
 * 🔴 Red - Perform Customs Clearance
 * 🟢 Green - Final delivery
 * 🔵 Blue - In transit
 * ⚪️ White/Gray - Hand over to carrier
 * 🟡 Yellow - Arrival at Outward/Inward/post office of exchange
 * ⚫️ Black/Gray - Other
 */
export function getStatusColor(status: string | null): {
  border: string;
  badge: string;
  text: string;
} {
  if (!status) {
    return {
      border: "border-l-gray-400",
      badge: "bg-gray-100 text-gray-800",
      text: "text-gray-800"
    };
  }

  const statusLower = status.toLowerCase();

  // 🔴 Red - Customs Clearance
  if (statusLower.includes("customs") || statusLower.includes("clearance")) {
    return {
      border: "border-l-red-500",
      badge: "bg-red-500 text-white",
      text: "text-red-700"
    };
  }

  // 🟢 Green - Final delivery / Delivered
  if (statusLower.includes("deliver") || statusLower.includes("final")) {
    return {
      border: "border-l-green-500",
      badge: "bg-green-500 text-white",
      text: "text-green-700"
    };
  }

  // 🔵 Blue - In transit
  if (statusLower.includes("transit") || statusLower.includes("transport")) {
    return {
      border: "border-l-blue-500",
      badge: "bg-blue-500 text-white",
      text: "text-blue-700"
    };
  }

  // ⚪️ Gray - Hand over to carrier
  if (statusLower.includes("hand over") || statusLower.includes("carrier")) {
    return {
      border: "border-l-gray-300",
      badge: "bg-gray-200 text-gray-800",
      text: "text-gray-700"
    };
  }

  // 🟡 Yellow - Arrival at post office
  if (
    statusLower.includes("arrival") ||
    statusLower.includes("post office") ||
    statusLower.includes("exchange")
  ) {
    return {
      border: "border-l-yellow-400",
      badge: "bg-yellow-400 text-black",
      text: "text-yellow-700"
    };
  }

  // ⚫️ Default - Other
  return {
    border: "border-l-gray-500",
    badge: "bg-gray-500 text-white",
    text: "text-gray-700"
  };
}
