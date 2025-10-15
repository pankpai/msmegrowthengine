import { AGENTS } from "@/data/agents";
import AgentCard from "./AgentCard";
import { serviceList } from "@/pages/Services";
import { ServiceCard } from "./ServiceCard";
import { Cloud } from "lucide-react";

export default function AgentGrid() {
  return (
    <section id="agents" className="container py-12 md:py-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Agents
          </h2>
          <p className="mt-1 text-muted-foreground">
            Operational agents ready to run across your funnel.
          </p>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {serviceList.map((services, i) => (
          <div key={i}>
            <ServiceCard
              icon={<Cloud className="size-5" />}
              title={services.title}
              description={services.description}
              to={services.path}
              isSubscribed={false}
              serviceKey={services.serviceKey}
            />
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-5">
          Comming Services
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => (
            <div key={i}>
              <AgentCard agent={agent} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
