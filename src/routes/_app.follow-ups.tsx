import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format, isToday, isPast, isFuture, parseISO } from "date-fns";
import { CalendarClock, Phone, MapPin, AlertTriangle, CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { type Lead, type LeadStatus, STATUS_ORDER, STATUS_LABELS } from "@/lib/leads";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/follow-ups")({
  component: FollowUpsPage,
});

function FollowUpsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .not("follow_up_date", "is", null)
        .order("follow_up_date", { ascending: true });
      if (error) toast.error(error.message);
      setLeads(data ?? []);
      setLoading(false);
    })();
  }, []);

  const updateStatus = async (id: string, status: LeadStatus) => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success("Status updated");
  };

  const groups = {
    overdue: leads.filter((l) => l.follow_up_date && isPast(parseISO(l.follow_up_date)) && !isToday(parseISO(l.follow_up_date))),
    today: leads.filter((l) => l.follow_up_date && isToday(parseISO(l.follow_up_date))),
    upcoming: leads.filter((l) => l.follow_up_date && isFuture(parseISO(l.follow_up_date))),
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Follow-ups</h1>
        <p className="text-sm text-muted-foreground">Stay on top of every conversation.</p>
      </div>

      <Section
        title="Overdue"
        description="These follow-ups have passed without being closed."
        icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
        leads={groups.overdue}
        empty="No overdue follow-ups. Great job."
        loading={loading}
        onStatus={updateStatus}
      />
      <Section
        title="Today"
        description={format(new Date(), "EEEE, MMM d")}
        icon={<CalendarClock className="h-4 w-4 text-primary" />}
        leads={groups.today}
        empty="Nothing scheduled for today."
        loading={loading}
        onStatus={updateStatus}
        highlight
      />
      <Section
        title="Upcoming"
        description="Coming up next."
        icon={<CalendarCheck className="h-4 w-4 text-success" />}
        leads={groups.upcoming}
        empty="No upcoming follow-ups scheduled."
        loading={loading}
        onStatus={updateStatus}
      />
    </div>
  );
}

function Section({
  title, description, icon, leads, empty, loading, onStatus, highlight,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  leads: Lead[];
  empty: string;
  loading: boolean;
  onStatus: (id: string, s: LeadStatus) => void;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl border bg-card p-6 shadow-soft ${highlight ? "border-primary-glow/40 ring-1 ring-primary-glow/20" : "border-border"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{leads.length}</span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {loading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading...</p>
      ) : leads.length === 0 ? (
        <p className="mt-6 text-center text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {leads.map((l) => (
            <li key={l.id} className="flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{l.name}</p>
                  <StatusBadge status={l.status} />
                </div>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{l.phone}</span>
                  {l.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{l.location}</span>}
                  {l.follow_up_date && <span className="inline-flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" />{format(parseISO(l.follow_up_date), "PP")}</span>}
                </div>
              </div>
              <Select value={l.status} onValueChange={(v) => onStatus(l.id, v as LeadStatus)}>
                <SelectTrigger className="h-8 w-44 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
