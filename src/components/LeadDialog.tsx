import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { STATUS_LABELS, STATUS_ORDER, type Lead, type LeadStatus } from "@/lib/leads";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  phone: z.string().trim().min(4, "Phone is required").max(40),
  requirement: z.string().trim().max(500).optional().or(z.literal("")),
  budget: z.string().trim().max(20).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  lead?: Lead | null;
  onSaved: () => void;
}

export function LeadDialog({ open, onOpenChange, lead, onSaved }: Props) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [requirement, setRequirement] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState<LeadStatus>("new");
  const [followUp, setFollowUp] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(lead?.name ?? "");
      setPhone(lead?.phone ?? "");
      setRequirement(lead?.requirement ?? "");
      setBudget(lead?.budget != null ? String(lead.budget) : "");
      setLocation(lead?.location ?? "");
      setStatus(lead?.status ?? "new");
      setFollowUp(lead?.follow_up_date ? new Date(lead.follow_up_date) : undefined);
      setNotes(lead?.notes ?? "");
    }
  }, [open, lead]);

  const handleSave = async () => {
    const parsed = schema.safeParse({ name, phone, requirement, budget, location, notes });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (!user) return;
    setSaving(true);
    const payload = {
      name: parsed.data.name,
      phone: parsed.data.phone,
      requirement: parsed.data.requirement || null,
      budget: parsed.data.budget ? Number(parsed.data.budget) : null,
      location: parsed.data.location || null,
      notes: parsed.data.notes || null,
      status,
      follow_up_date: followUp ? format(followUp, "yyyy-MM-dd") : null,
    };

    if (lead) {
      const { error } = await supabase.from("leads").update(payload).eq("id", lead.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Lead updated");
    } else {
      const { error } = await supabase.from("leads").insert({ ...payload, owner_id: user.id });
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Lead added");
    }
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">{lead ? "Edit lead" : "New lead"}</DialogTitle>
          <DialogDescription>
            {lead ? "Update lead details and follow-up." : "Capture a new prospect in seconds."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98xxxxxxxx" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="requirement">Property requirement</Label>
            <Input
              id="requirement"
              value={requirement}
              onChange={(e) => setRequirement(e.target.value)}
              placeholder="3BHK apartment, sea-facing"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="8500000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bandra West" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as LeadStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Follow-up date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start font-normal", !followUp && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {followUp ? format(followUp, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={followUp}
                    onSelect={setFollowUp}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : lead ? "Save changes" : "Add lead"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
