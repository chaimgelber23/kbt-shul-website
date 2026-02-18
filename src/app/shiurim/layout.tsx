import { AudioPlayerProvider } from "@/components/shiurim/AudioPlayerProvider";
import AudioPlayerBar from "@/components/shiurim/AudioPlayerBar";

export default function ShiurimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AudioPlayerProvider>
      {children}
      <AudioPlayerBar />
    </AudioPlayerProvider>
  );
}
