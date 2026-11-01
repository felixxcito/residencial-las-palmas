import { Megaphone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { AnnouncementCard } from "@/components/announcements/announcement-card";

export default async function ResidentAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div>
      <PageHeader title="Avisos" description="Comunicados de la administración." />

      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="Sin avisos" description="No hay comunicados publicados." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </div>
      )}
    </div>
  );
}
