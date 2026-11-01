import type { CommonArea, Reservation } from "@prisma/client";

export type Slot = { start: Date; end: Date; startLabel: string; endLabel: string };

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Builds the day's slots for an area and filters out any that overlap an existing active reservation. */
export function getAvailableSlots(
  area: Pick<CommonArea, "openTime" | "closeTime" | "slotMinutes">,
  dateStr: string,
  existingReservations: Pick<Reservation, "startTime" | "endTime">[]
): Slot[] {
  const openMin = timeToMinutes(area.openTime);
  const closeMin = timeToMinutes(area.closeTime);
  const slots: Slot[] = [];

  for (let start = openMin; start + area.slotMinutes <= closeMin; start += area.slotMinutes) {
    const end = start + area.slotMinutes;
    const startDate = new Date(`${dateStr}T${minutesToLabel(start)}:00`);
    const endDate = new Date(`${dateStr}T${minutesToLabel(end)}:00`);

    const overlaps = existingReservations.some(
      (r) => startDate < r.endTime && endDate > r.startTime
    );

    if (!overlaps && startDate.getTime() > Date.now()) {
      slots.push({ start: startDate, end: endDate, startLabel: minutesToLabel(start), endLabel: minutesToLabel(end) });
    }
  }

  return slots;
}
