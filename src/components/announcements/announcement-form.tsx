"use client";

import { useActionState } from "react";
import type { Announcement } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { SubmitButton } from "@/components/shared/submit-button";
import type { FormState } from "@/lib/action-types";

export function AnnouncementForm({
  announcement,
  action,
}: {
  announcement?: Announcement;
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(action, null);

  return (
    <form action={formAction} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" defaultValue={announcement?.title} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Contenido</Label>
        <Textarea id="body" name="body" rows={5} defaultValue={announcement?.body} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresAt">Fecha de expiración (opcional)</Label>
        <Input
          id="expiresAt"
          name="expiresAt"
          type="date"
          defaultValue={announcement?.expiresAt ? announcement.expiresAt.toISOString().slice(0, 10) : undefined}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="isPinned" name="isPinned" defaultChecked={announcement?.isPinned} />
        <Label htmlFor="isPinned" className="font-normal">
          Fijar en la parte superior
        </Label>
      </div>

      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton>{announcement ? "Guardar cambios" : "Publicar aviso"}</SubmitButton>
    </form>
  );
}
