import { Metadata } from "next";
import MyLearningClient from "@/components/shiurim/MyLearningClient";

export const metadata: Metadata = {
  title: "My Learning | Shiurim | Kahal Beis Tefilla",
  description: "Track your Torah learning journey. Continue where you left off in your shiurim.",
};

export default function MyLearningPage() {
  return <MyLearningClient />;
}
