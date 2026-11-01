"use client";

import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Pin, PinOff, Pencil } from "lucide-react";
import type { Announcement } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDeleteButton } from "@/components/shared/confirm-delete-button";
import { togglePinAction, deleteAnnouncementAction } from "@/actions/announcements.actions";
import { formatDate } from "@/lib/utils";

export function AnnouncementCard({
  announcement,
  editable = false,
}: {
  announcement: Announcement;
  editable?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePinToggle() {
    startTransition(async () => {
      const result = await togglePinAction(announcement.id);
      if (result.success) toast.success(result.message);
      else toast.error(result.message);
    });
  }

  return (
    <Card className={announcement.isPinned ? "border-primary/40" : undefined}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="flex items-center gap-2">
            {announcement.isPinned && <Pin className="size-4 text-primary" />}
            {announcement.title}
          </CardTitle>
          {editable && (
            <div className="flex shrink-0 gap-1">
              <Button size="icon-sm" variant="ghost" disabled={isPending} onClick={handlePinToggle}>
                {announcement.isPinned ? <PinOff /> : <Pin />}
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                render={<Link href={`/admin/avisos/${announcement.id}`} />}
                nativeButton={false}
              >
                <Pencil />
              </Button>
              <ConfirmDeleteButton
                title="Eliminar aviso"
                description={`¿Eliminar el aviso "${announcement.title}"?`}
                action={deleteAnnouncementAction.bind(null, announcement.id)}
              />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">{announcement.body}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(announcement.publishedAt)}</span>
          {announcement.expiresAt && <Badge variant="outline">Expira {formatDate(announcement.expiresAt)}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
