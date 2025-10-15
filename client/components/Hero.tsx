import { Button } from "@/components/ui/button";

export default function Hero() {
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
