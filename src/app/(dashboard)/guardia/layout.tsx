import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function GuardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (session?.user.role !== "GUARD") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
