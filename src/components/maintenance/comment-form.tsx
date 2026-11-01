"use client";

import { useActionState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/shared/submit-button";
import { addTicketCommentAction } from "@/actions/tickets.actions";
import type { FormState } from "@/lib/action-types";

export function CommentForm({ ticketId }: { ticketId: string }) {
  const action = addTicketCommentAction.bind(null, ticketId);
  const [state, formAction] = useActionState<FormState, FormData>(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <Textarea name="body" rows={3} placeholder="Escribe un comentario o actualización..." required />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton size="sm">Comentar</SubmitButton>
    </form>
  );
}
