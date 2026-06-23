import ToolHeader from "@/components/layout/ToolHeader";
import ToolFooter from "@/components/layout/ToolFooter";
import PeerGroupPanel from "@/components/layout/PeerGroupPanel";
import ZoneStack from "@/components/layout/ZoneStack";
import { FilterProvider } from "@/app/benchmark/FilterContext";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function BenchmarkPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  return (
    <FilterProvider>
      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "var(--ink)",
        }}
      >
      <ToolHeader />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Left panel */}
        <aside
          style={{
            width: 236,
            flexShrink: 0,
            background: "var(--ink-deep)",
            borderRight: "1px solid var(--border)",
            overflowY: "auto",
          }}
        >
          <PeerGroupPanel />
        </aside>

        {/* Right content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <ZoneStack />
        </div>
      </div>

        <ToolFooter />
      </div>
    </FilterProvider>
  );
}
