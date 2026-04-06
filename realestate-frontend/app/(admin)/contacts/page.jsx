import { redirect } from "next/navigation";

export default function LegacyAdminContactsRedirectPage() {
  redirect("/admin/contacts");
}
