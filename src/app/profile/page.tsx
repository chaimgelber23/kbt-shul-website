import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | Kahal Beis Tefilla",
  description: "Manage your account and view your learning stats.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
