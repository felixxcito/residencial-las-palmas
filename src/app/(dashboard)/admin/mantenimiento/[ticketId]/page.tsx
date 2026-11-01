import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TicketStatusControls } from "@/components/maintenance/ticket-status-controls";
import { CommentForm } from "@/components/maintenance/comment-form";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/utils";
import { initials } from "@/lib/utils";

export default async function AdminTicketDetailPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const { ticketId } = await params;

  const ticket = await prisma.maintenanceTicket.findUnique({
    where: { id: ticketId },
    include: {
      unit: true,
      createdBy: true,
      comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
    },
  });

  if (!ticket) notFound();

  return (
    <div>
      <PageHeader
        title={ticket.title}
        description={`${ticket.unit?.code ?? "Área común"} · Creado por ${ticket.createdBy.name} el ${formatDateTime(ticket.createdAt)}`}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{ticket.description}</p>
              {ticket.category && <p className="mt-2 text-xs text-muted-foreground">Categoría: {ticket.category}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">Comentarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticket.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin comentarios todavía.</p>
              ) : (
                <div className="space-y-3">
                  {ticket.comments.map((c) => (
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
                  ))}
                </div>
              )}
              <CommentForm ticketId={ticket.id} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <TicketStatusControls ticketId={ticket.id} status={ticket.status} priority={ticket.priority} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
