import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import AgentGrid from "@/components/AgentGrid";

export default function Index() {
  const { user,accessToken,authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if(authLoading) <div>loading....</div>
    if (accessToken) navigate("/dashboard", { replace: true });
  }, [accessToken, navigate]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <section id="platform" className="container py-8 md:py-12">
        <div className="grid gap-6 rounded-2xl border bg-card p-6 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold">Autonomous by design</h3>
            <p className="mt-1 text-sm text-muted-foreground">Agents coordinate tasks across your tools to deliver outcomes, not just insights.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">On-brand outputs</h3>
            <p className="mt-1 text-sm text-muted-foreground">Content stays on-tone. Outreach and copy reflect your voice and guardrails.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Secure & scalable</h3>
            <p className="mt-1 text-sm text-muted-foreground">Role-based access, audit logs, and safe execution built-in for teams.</p>
          </div>
        </div>
      </section>
      <AgentGrid />
    </div>
  );
}

function Hero() {
  return (
     <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,theme(colors.primary/20),transparent_40%),radial-gradient(ellipse_at_bottom_right,theme(colors.fuchsia.500/20),transparent_40%)]" />
      <div className="container relative mx-auto grid gap-8 py-16 md:py-24 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground">
            AI Agents Suite
          </p>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Grow faster with an AI-first go‑to‑market platform
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted-foreground">
            Prospect, create, score, and act—powered by autonomous agents. Influencer and Review Analyzer are live. Explore the rest today.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#agents"><Button size="lg">Explore Agents</Button></a>
            <a href="#platform"><Button size="lg" variant="secondary">How it works</Button></a>
          </div>
        </div>
        <div className="relative">
          <div className="mx-auto aspect-[4/3] w-full max-w-xl rounded-2xl border bg-gradient-to-br from-primary/10 via-fuchsia-500/10 to-emerald-500/10 p-2 shadow-sm backdrop-blur">
            <div className="flex h-full items-center justify-center rounded-xl bg-background">
              <div className="grid grid-cols-3 gap-3 p-6">
                <div className="h-28 w-28 rounded-xl bg-primary/10" />
                <div className="h-28 w-28 rounded-xl bg-fuchsia-500/10" />
                <div className="h-28 w-28 rounded-xl bg-emerald-500/10" />
                <div className="h-28 w-28 rounded-xl bg-primary/10" />
                <div className="h-28 w-28 rounded-xl bg-fuchsia-500/10" />
                <div className="h-28 w-28 rounded-xl bg-emerald-500/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    { title: "Authentication", description: "Email/password with validation, social buttons, and clear feedback.", },
    { title: "Dashboard", description: "Welcome message, profile summary, and attached services navigation.", },
    { title: "Responsive UI", description: "Beautiful on mobile and desktop with smooth transitions.", },
  ];
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
          <p className="mt-3 text-muted-foreground">A complete foundation to launch quickly and scale your experience.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-flex items-center gap-2 text-violet-700">
                <CheckCircle2 className="size-5" />
                <span className="text-xs font-medium">Feature</span>
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-violet-600 to-indigo-600 p-10 text-white shadow-xl">
          <div className="absolute -left-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid items-center gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-2xl font-bold">Ready to build?</h3>
              <p className="mt-2 max-w-prose text-white/80">Create an account to unlock the full dashboard and services experience.</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button asChild size="lg" variant="secondary" className="text-foreground">
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                <Link to="/signup">Sign up <ArrowRight className="ml-2 size-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
