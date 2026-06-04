"use client";

import { useState, useEffect } from "react";
import { updateOrderStatus } from "@/app/actions/admin-orders";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
}

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrderStatusSelect({ orderId, currentStatus }: OrderStatusSelectProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
    setIsUpdating(true);
    const result = await updateOrderStatus(orderId, newStatus);
    setIsUpdating(false);

    if (result.success) {
      toast.success(result.message);
    } else {
      setStatus(currentStatus);
      toast.error(result.message || "Failed to update status");
    }
  };

  return (
    <Select
      value={status}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-[140px] h-8 text-xs bg-surface-container-lowest border-surface-container-high rounded-none">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent className="rounded-none bg-surface-container-lowest border-surface-container-high">
        {STATUSES.map((status) => (
          <SelectItem 
            key={status.value} 
            value={status.value}
            className="text-xs cursor-pointer focus:bg-surface-container"
          >
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
