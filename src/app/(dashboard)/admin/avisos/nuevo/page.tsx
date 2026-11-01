import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { AnnouncementForm } from "@/components/announcements/announcement-form";
import { createAnnouncementAction } from "@/actions/announcements.actions";

export default function NewAnnouncementPage() {
  return (
    <div>
      <PageHeader title="Nuevo aviso" description="Publica un comunicado para los residentes." />
      <Card className="max-w-xl">
        <CardContent className="pt-6">
          <AnnouncementForm action={createAnnouncementAction} />
        </CardContent>
      </Card>
    </div>
  );
}
