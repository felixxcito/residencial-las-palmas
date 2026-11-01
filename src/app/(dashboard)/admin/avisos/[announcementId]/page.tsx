import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AnnouncementForm } from "@/components/announcements/announcement-form";
import { updateAnnouncementAction } from "@/actions/announcements.actions";
import { prisma } from "@/lib/prisma";

export default async function EditAnnouncementPage({
  params,
}: {
  params: Promise<{ announcementId: string }>;
}) {
  const { announcementId } = await params;
  const announcement = await prisma.announcement.findUnique({ where: { id: announcementId } });

  if (!announcement) notFound();

  return (
    <div>
      <PageHeader title="Editar aviso" />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <AnnouncementForm
            announcement={announcement}
            action={updateAnnouncementAction.bind(null, announcement.id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
