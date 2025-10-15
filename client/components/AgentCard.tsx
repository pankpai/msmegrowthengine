import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Agent } from "@/data/agents";

export default function AgentCard({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  return (
    <Card className="group h-full transition hover:shadow-lg">
      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant={agent.status === "existing" ? "secondary" : "default"}>
            {agent.status === "existing" ? "Live" : "New"}
          </Badge>
        </div>
        <CardTitle className="text-xl">{agent.name}</CardTitle>
        <CardDescription>{agent.short}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground pr-4 line-clamp-2">{agent.description}</p>
        <Link to={``} className="shrink-0">
          <Button size="sm">Comming soon</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
