import { createFileRoute } from "@tanstack/react-router";
import { WireRoot } from "@/components/wire/WireRoot";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <WireRoot />;
}
