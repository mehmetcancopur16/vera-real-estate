import { redirect } from "next/navigation";

export default function LegacyAdminNewslettersRedirectPage() {
  redirect("/admin/newsletters");
}
