import { LucideIcon, Sparkles, Target, FileText, TrendingUp, Gauge, LineChart, Users } from "lucide-react";

export type AgentSlug =
  | "influencer"
  | "review-analyzer"
  | "prospecting"
  | "content-assistant"
  | "churn-predictor"
  | "lead-scoring"
  | "business-insights";

export interface Agent {
  slug: AgentSlug;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  status: "existing" | "new";
}

export const AGENTS: Agent[] = [
  // {
  //   slug: "influencer",
  //   name: "Influencer Agent",
  //   short: "Finds and engages the right creators",
  //   description:
  //     "Discovers high-fit influencers, analyzes audience authenticity, drafts outreach, and tracks replies to drive collaborations.",
  //   icon: Users,
  //   status: "existing",
  // },
  // {
  //   slug: "review-analyzer",
  //   name: "Review Analyzer",
  //   short: "Turns reviews into insights",
  //   description:
  //     "Aggregates reviews from multiple sources, detects sentiment/themes, and surfaces product and CX opportunities.",
  //   icon: Gauge,
  //   status: "existing",
  // },
  {
    slug: "prospecting",
    name: "Prospecting Agent",
    short: "Automated lead generation & outreach",
    description:
      "Enriches target accounts, finds contacts, crafts multi-touch emails, and schedules sends with A/B subject testing.",
    icon: Target,
    status: "new",
  },
  {
    slug: "content-assistant",
    name: "AI Content Assistant",
    short: "Generates engaging copy & visuals",
    description:
      "Creates on-brand campaign copy, social posts, and visual prompts; adapts tone by audience and channel.",
    icon: FileText,
    status: "new",
  },
  {
    slug: "churn-predictor",
    name: "Lead & Churn Predictor",
    short: "Identifies churn risks and next best actions",
    description:
      "Scores churn risk by usage signals and alerts CSMs with playbooks and recommended interventions.",
    icon: TrendingUp,
    status: "new",
  },
  {
    slug: "lead-scoring",
    name: "AI Lead Scoring",
    short: "Prioritizes high-potential leads",
    description:
      "Combines fit + intent + behavior to rank leads; pushes scores to your CRM for routing and SLAs.",
    icon: LineChart,
    status: "new",
  },
  {
    slug: "business-insights",
    name: "AI Business Insights",
    short: "Actionable insights from operational data",
    description:
      "Connects to your sources to answer questions, auto-build dashboards, and summarize performance by segment.",
    icon: Sparkles,
    status: "new",
  },
];

export const getAgentBySlug = (slug: string) =>
  AGENTS.find((a) => a.slug === (slug as AgentSlug));
