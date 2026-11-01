"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTicketAction } from "@/actions/tickets.actions";
import { TICKET_STATUS_LABELS, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import type { TicketStatus, TicketPriority } from "@prisma/client";

export function TicketStatusControls({
  ticketId,
  status,
  priority,
}: {
  ticketId: string;
  status: TicketStatus;
  priority: TicketPriority;
}) {
  const [isPending, startTransition] = useTransition();

  function handleStatusChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      const result = await updateTicketAction(ticketId, { status: value as TicketStatus });
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  function handlePriorityChange(value: string | null) {
    if (!value) return;
    startTransition(async () => {
      const result = await updateTicketAction(ticketId, { priority: value as TicketPriority });
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select value={status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="w-44">
          <SelectValue>{(value: TicketStatus) => TICKET_STATUS_LABELS[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={priority} onValueChange={handlePriorityChange} disabled={isPending}>
        <SelectTrigger className="w-40">
          <SelectValue>{(value: TicketPriority) => TICKET_PRIORITY_LABELS[value]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(TICKET_PRIORITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
