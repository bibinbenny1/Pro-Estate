import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CalendarClock, LineChart, Phone, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pro-Estate — Real Estate CRM for Brokers" },
      { name: "description", content: "Capture leads, track follow-ups, and close more property deals. The simplest CRM built for real estate brokers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="absolute top-0 right-0 left-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-card/15 backdrop-blur-md ring-1 ring-white/20">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">Pro-Estate</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-white text-primary hover:bg-white/90">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,oklch(0.78_0.08_195/.4),transparent_45%),radial-gradient(circle_at_80%_60%,oklch(0.62_0.10_215/.5),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              Built for real estate brokers
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
              Close more property deals,
              <span className="block bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                lose fewer leads.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-white/80 md:text-lg">
              A focused CRM for real estate teams. Capture leads, track follow-ups, schedule
              site visits, and never let a hot prospect go cold.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-primary shadow-elegant hover:bg-white/90">
                <Link to="/signup">
                  Start free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
          </div>

          {/* Floating mock card */}
          <div className="relative mx-auto mt-20 max-w-4xl">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-2 shadow-elegant backdrop-blur-xl">
              <div className="grid gap-3 rounded-xl bg-card p-6 sm:grid-cols-3">
                {[
                  { label: "Total leads", value: "248", icon: Building2 },
                  { label: "Site visits this week", value: "12", icon: CalendarClock },
                  { label: "Closed deals", value: "₹4.2 Cr", icon: LineChart },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border bg-gradient-card p-4">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-xs font-medium uppercase tracking-wider">{s.label}</span>
                      <s.icon className="h-4 w-4" />
                    </div>
                    <div className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Everything a broker actually needs</h2>
          <p className="mt-4 text-muted-foreground">No bloat. No 50-tab dashboards. Just the tools to manage leads and close deals.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            { icon: Phone, title: "Lead capture", desc: "Add prospects in seconds: name, requirement, budget, location." },
            { icon: CalendarClock, title: "Follow-up reminders", desc: "Today's follow-ups front and center. Never miss a call." },
            { icon: LineChart, title: "Pipeline visibility", desc: "See leads by status: New → Interested → Site Visit → Closed." },
            { icon: ShieldCheck, title: "Team-wide access", desc: "Everyone on the team sees every lead — no silos." },
            { icon: Building2, title: "Real estate fit", desc: "Designed around property requirements, budgets and locations." },
            { icon: Sparkles, title: "Mobile-friendly", desc: "Update leads on the go, between site visits." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-gradient-card p-6 shadow-soft">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 md:px-6">
        <div className="overflow-hidden rounded-2xl bg-gradient-hero p-10 text-center text-white shadow-elegant md:p-16">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to organize your pipeline?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">Set up your CRM in under a minute. Free to start, no credit card.</p>
          <Button asChild size="lg" className="mt-8 bg-white text-primary hover:bg-white/90">
            <Link to="/signup">Create your account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Pro-Estate · Built for brokers
      </footer>
    </div>
  );
}
