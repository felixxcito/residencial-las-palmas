import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { TICKET_STATUS_LABELS, TICKET_STATUS_VARIANT, TICKET_PRIORITY_LABELS } from "@/lib/constants";
import { formatDateTime, initials } from "@/lib/utils";

export default async function ResidentTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;
  const user = await getCurrentUser();

  const ticket = await prisma.maintenanceTicket.findUnique({
    where: { id: ticketId },
    include: { unit: true, comments: { include: { author: true }, orderBy: { createdAt: "asc" } } },
  });

  if (!ticket || ticket.createdById !== user!.id) notFound();

  return (
    <div>
      <PageHeader
        title={ticket.title}
        description={`${ticket.unit?.code ?? "Área común"} · ${formatDateTime(ticket.createdAt)}`}
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-muted-foreground">Descripción</CardTitle>
              <div className="flex gap-2">
                <Badge variant="outline">{TICKET_PRIORITY_LABELS[ticket.priority]}</Badge>
                <Badge variant={TICKET_STATUS_VARIANT[ticket.status]}>{TICKET_STATUS_LABELS[ticket.status]}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Comentarios de administración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ticket.comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin comentarios todavía.</p>
            ) : (
              ticket.comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="size-8">
                    <AvatarFallback>{initials(c.author.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{c.author.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">{formatDateTime(c.createdAt)}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">{c.body}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
