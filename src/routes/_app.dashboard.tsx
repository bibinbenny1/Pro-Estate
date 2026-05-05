import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Users, CalendarClock, TrendingUp, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_LABELS, STATUS_ORDER, type Lead, type LeadStatus } from "@/lib/leads";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      setLeads(data ?? []);
      setLoading(false);
    })();
  }, []);

  const today = format(new Date(), "yyyy-MM-dd");
  const todays = leads.filter((l) => l.follow_up_date === today);
  const byStatus: Record<LeadStatus, number> = {
    new: 0, interested: 0, site_visit_scheduled: 0, closed: 0,
  };
  leads.forEach((l) => { byStatus[l.status]++; });

  const stats = [
    { label: "Total leads", value: leads.length, icon: Users, accent: "from-primary to-primary-glow" },
    { label: "Today's follow-ups", value: todays.length, icon: CalendarClock, accent: "from-accent to-primary-glow" },
    { label: "Site visits scheduled", value: byStatus.site_visit_scheduled, icon: TrendingUp, accent: "from-warning to-accent" },
    { label: "Closed deals", value: byStatus.closed, icon: CheckCircle2, accent: "from-success to-accent" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Your pipeline at a glance.</p>
        </div>
        <Button asChild>
          <Link to="/leads"><Plus className="mr-2 h-4 w-4" />Add lead</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-xl border border-border bg-gradient-card p-5 shadow-soft">
            <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl`} />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="mt-2 font-display text-3xl font-bold">{loading ? "—" : s.value}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-display text-lg font-semibold">Leads by status</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_ORDER.map((s) => (
            <div key={s} className="rounded-lg border border-border bg-background p-4">
              <StatusBadge status={s} />
              <p className="mt-3 font-display text-2xl font-bold">{byStatus[s]}</p>
              <p className="text-xs text-muted-foreground">{STATUS_LABELS[s]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Today's follow-ups */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Today's follow-ups</h2>
          <Link to="/follow-ups" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
        {loading ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
        ) : todays.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-border bg-background py-10 text-center">
            <CalendarClock className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">Nothing scheduled for today. Enjoy the calm.</p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {todays.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{l.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {l.phone}{l.location ? ` · ${l.location}` : ""}
                  </p>
                </div>
                <StatusBadge status={l.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
