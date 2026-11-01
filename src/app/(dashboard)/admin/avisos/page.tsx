import Link from "next/link";
import { Megaphone, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcements/announcement-card";

export default async function AdminAnnouncementsPage() {
  const announcements = await prisma.announcement.findMany({
    orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="Avisos"
        description="Comunicados para todos los residentes."
        actions={
          <Button render={<Link href="/admin/avisos/nuevo" />} nativeButton={false}>
            <Plus /> Nuevo aviso
          </Button>
        }
      />

      {announcements.length === 0 ? (
        <EmptyState icon={Megaphone} title="Sin avisos" description="Publica el primer comunicado." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} editable />
          ))}
        </div>
      )}
    </div>
  );
}
