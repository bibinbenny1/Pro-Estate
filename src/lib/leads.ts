import type { Database } from "@/integrations/supabase/types";

export type LeadStatus = Database["public"]["Enums"]["lead_status"];
export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  interested: "Interested",
  site_visit_scheduled: "Site Visit Scheduled",
  closed: "Closed",
};

export const STATUS_ORDER: LeadStatus[] = ["new", "interested", "site_visit_scheduled", "closed"];

export const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-secondary text-secondary-foreground border-border",
  interested: "bg-accent/30 text-accent-foreground border-accent/40",
  site_visit_scheduled: "bg-warning/20 text-warning-foreground border-warning/40",
  closed: "bg-success/20 text-success-foreground border-success/40",
};
