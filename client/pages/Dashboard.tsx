import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Blocks, Cloud } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import PlanDashboard from "./Plandashboard/Index";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserSubscriptionInfo } from "@/store/planSlice";

export default function Dashboard() {

  const { user, accessToken, authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) <div>loading....</div>;
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);


  return (
    <section className="bg-gradient-to-b from-background to-indigo-50/50 py-8 md:py-12">
      <div className="container space-y-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your personalized dashboard. Jump into services or review your
              profile details below.
            </p>
          </div>
        </div>
        <PlanDashboard />

        <div className="grid gap-6 md:grid-cols-3">
          {/* <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile summary</CardTitle>
              <CardDescription>Quick snapshot of your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Name</span><span>{user?.name || "—"}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Email</span><span>{user?.email}</span></div>
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Plan</span><span>See Profile</span></div>
              <div className="pt-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/profile">View full profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card> */}
          {/* <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
            <ServiceCard
              icon={<Cloud className="size-5" />}
              title="Review Sentiment analyzer"
              description="Analyze customer sentiment and review of a product and own business"
              to="/review-sentiment"
            />
            <ServiceCard
              icon={<Cloud className="size-5" />}
              title="Builder Influencer"
              description="AI Powered search influcer with some question"
              to="/builder-influencer"
            />
          </div> */}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}) {
  return (
    <Card className="group relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-violet-100/60 to-indigo-100/60 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="flex items-center gap-2 text-violet-600">
          {icon}
          <span className="text-xs font-medium">Service</span>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          asChild
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
        >
          <Link to={to} target="_blank">
            Go to Service <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
