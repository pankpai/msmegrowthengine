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
import { BadgeCheck, CalendarDays, Clock, Crown, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserSubscriptionInfo } from "@/store/planSlice";
import { yourServices } from "./Plandashboard/Index";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { updateUserServices } from "@/store/authSlice";

export default function Profile() {
  const { subscribtionInfo } = useSelector((state: RootState) => state.plan);
  const { user, authLoading, accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const services = watch("services");
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


  const onupdateSubmit = async(data: any) => {
    console.log(data)
    try {
     await dispatch(updateUserServices(data))
    } catch (error) {
      console.log("ERROR:",error)
    }
  }

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
    <>
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
                    setOpen(true)
                  }}
                >
                  Add More Services
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
              trakCreditArray.map((el, i) => (
                <div key={i}>
                  <h2 className="px-6 py-2">Servies you buy {el?.serviceName}</h2>
                  <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <CalendarDays className="size-4" /> Purchased
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {el?.startsAt?.toLocaleString()?.split("T")[0]}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="size-4" /> Expires
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {el?.expiresAt?.toLocaleString()?.split("T")[0]}
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

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Add Services"
        size="md"
      >
        <form onSubmit={handleSubmit(onupdateSubmit)} className="space-y-3 my-6">


          {/* Services Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Select Services
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              <select
                {...register("services", { required: "Service is required" })}
                className={`w-full pl-10 pr-4 py-2 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans appearance-none ${errors.role
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your Services
                </option>
                <option value="review-sentiment">Review Sentiment</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>

          </div>

          {services === 'influencer' && <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
              Select Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>

              <select
                {...register("role", { required: "Role is required" })}
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 font-sans appearance-none ${errors.role
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200 hover:border-purple-200 focus:bg-white"
                  }`}
                defaultValue=""
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="brand">Brand</option>
                <option value="influencer">Influencer</option>
              </select>
            </div>
          </div>}

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating Account...
              </span>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </Modal>

    </>
  );
}
