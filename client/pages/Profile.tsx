import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { renewPlan, upgradePlan, type AccountDetails } from "@/lib/auth";
import { format } from "date-fns";
import { BadgeCheck, CalendarDays, Clock, Crown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserSubscriptionInfo } from "@/store/planSlice";
import { yourServices } from "./Plandashboard/Index";

export default function Profile() {
  const { subscribtionInfo } = useSelector((state: RootState) => state.plan);
  const { user, authLoading, accessToken } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!accessToken) {
      navigate("/login", { replace: true });
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchSubsInfo = () => {
      dispatch(getUserSubscriptionInfo());
    };
    fetchSubsInfo();
  }, []);
  const trakCreditArray = useMemo(() => {
    const subsInfoModifyArr = subscribtionInfo?.services?.map((serviceInfo) => {
      const matchedService = yourServices.find(
        (s) => s.serviceKey === serviceInfo.serviceKey,
      );
      return {
        ...serviceInfo,
        serviceName: matchedService
          ? matchedService.services
          : "Unknown Service",
      };
    });

    return subsInfoModifyArr || [];
  }, [subscribtionInfo, yourServices]);

  const activeClass =
    status === "ACTIVE"
      ? "text-emerald-600 bg-emerald-50"
      : "text-rose-600 bg-rose-50";
  if (!subscribtionInfo)
    return (
      <div className="flex h-[80vh] items-center justify-center text-lg text-muted-foreground">
        Loading...
      </div>
    );
  return (
    <section className="py-12">
      <div className="container grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-lg font-semibold">
                {user.name?.split(" ")[0]?.charAt(0)?.toUpperCase() ||
                  user.email?.toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-medium">{user.name || "—"}</div>
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
              </div>
            </div>
            {/* <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`rounded px-2 py-0.5 text-xs ${activeClass}`}>
                  {subscribtionInfo.status === "ACTIVE" ? "Active" : "Expired"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Days left</span>
                <span>{remaingDay}</span>
              </div>
            </div> */}
            <div className="mt-6 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const d = renewPlan();
                  toast.success("Plan renewed for 30 days");
                }}
              >
                Renew
              </Button>
              <Button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                onClick={() => {
                  const d = upgradePlan("Pro", 12);
                  toast.success("Upgraded to Pro for 12 months");
                }}
              >
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-violet-700">
              <Crown className="size-5" />{" "}
              <span className="text-xs font-medium">Plan</span>
            </div>
            <CardTitle>{user?.plan}</CardTitle>
            <CardDescription>Purchase and expiration details</CardDescription>
          </CardHeader>
          {Array.isArray(trakCreditArray) &&
            trakCreditArray.map((el,i) => (
              <div key={i}>
                <h2 className="px-6 py-2">Servies you buy {el?.serviceName}</h2>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <CalendarDays className="size-4" /> Purchased
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {el?.startsAt.toLocaleString().split("T")[0]}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="size-4" /> Expires
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {el?.expiresAt?.toLocaleString().split("T")[0]}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 md:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <BadgeCheck className="size-4" /> Status
                    </div>
                    <div
                      className={`mt-2 inline-flex items-center rounded px-2 py-1 text-xs ${activeClass}`}
                    >
                      {el.status === "ACTIVE"
                        ? `${el?.remainingDays} days left`
                        : "Expired"}
                    </div>
                  </div>
                </CardContent>
              </div>
            ))}
        </Card>
      </div>
    </section>
  );
}
