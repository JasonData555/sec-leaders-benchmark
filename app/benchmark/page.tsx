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
      <div className="app-shell">
        <ToolHeader />

        <div className="app-body">
          {/* Left panel — sidebar on desktop, sticky top bar on small screens */}
          <aside className="peer-panel">
            <PeerGroupPanel />
          </aside>

          {/* Right content */}
          <div className="app-main">
            <ZoneStack />
          </div>
        </div>

        <ToolFooter />
      </div>
    </FilterProvider>
  );
}
