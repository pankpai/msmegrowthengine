import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Blocks, Cloud } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserSubscriptionInfo } from "@/store/planSlice";
import { ServiceCard } from "@/components/ServiceCard";

interface Servicelist {
  title: string;
  description: string;
  path: string;
  serviceKey: string;
}
export const serviceList: Servicelist[] = [
  {
    title: "Builder Influencer",
    description: "AI Powered search influcer with some question",
    path: "/builder-influencer",
    serviceKey: "influencer",
  },
  {
    title: "Review Sentiment analyzer",
    description:
      "Analyze customer sentiment and review of a product and own business",
    path: "/review-sentiment",
    serviceKey: "review sentiment",
  },
];

export default function Services() {
  const dispatch = useDispatch<AppDispatch>();
  const { subscribtionInfo, loading } = useSelector(
    (state: RootState) => state.plan,
  );
  console.log(subscribtionInfo);
  useEffect(() => {
    const fetchUserInfo = async () => {
      await dispatch(getUserSubscriptionInfo());
    };
    fetchUserInfo();
  }, []);

  const subscriptedServices = useMemo(() => {
    const serviceKeyArr = subscribtionInfo?.services?.map((el) => el?.serviceKey);
    return serviceList?.filter((el) => {
      return serviceKeyArr?.includes(el.serviceKey);
    });
  }, [loading]);

  if (!subscribtionInfo)
    return (
      <div className="flex h-[80vh] items-center justify-center text-lg text-muted-foreground">
        Loading...
      </div>
    );
  return (
    <section className="bg-gradient-to-b from-background to-indigo-50/50 py-16">
      <div className="container">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Explore the capabilities available in your workspace.
          </p>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">
            Your current Plan
          </h1>
          {subscriptedServices.length <= 0 && (
            <p className="mb-4 max-w-2xl text-muted-foreground">
              Currently no active plan
            </p>
          )}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
              {subscriptedServices?.map((services, i) => (
                <div key={i}>
                  <ServiceCard
                    icon={<Cloud className="size-5" />}
                    title={services.title}
                    description={services.description}
                    to={services.path}
                    isSubscribed={true}
                    serviceKey={services.serviceKey}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-16">
          <h1 className="text-3xl font-bold tracking-tight mb-5">
            All Services
          </h1>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="grid gap-6 md:col-span-2 md:grid-cols-2">
              {serviceList?.map((services, i) => (
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
          </div>
        </div>
      </div>
    </section>
  );
}
