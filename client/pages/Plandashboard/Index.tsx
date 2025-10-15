import React, { useEffect, useMemo, useState } from "react";
import { Rocket, Eye, Copy, Clock, Plus, MessageCircle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getUserSubscriptionInfo, getUsesCredit } from "@/store/planSlice";

// Type definitions
interface ChartData {
  date: string;
  credits: number;
}

interface Project {
  title: string;
  description: string;
  tags: string[];
}
  export const yourServices = [
    {
      services: "Builder Influencer",
      serviceKey: "influencer",
    },
    {
      services: "Review Sentiment",
      serviceKey: "review sentiment",
    },
  ];
const PlanDashboard: React.FC = () => {
  const [apiKeyVisible, setApiKeyVisible] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const { user, accessToken, authLoading } = useAuth();
  const { subscribtionInfo, credit } = useSelector(
    (state: RootState) => state.plan,
  );
  const dispatch = useDispatch<AppDispatch>();



  const exampleProjects: Project[] = [
    {
      title: "Generate Leads",
      description: "Scrape Google Maps Data using Python.",
      tags: ["Python", "Google Sheets"],
    },
    {
      title: "Markdown Generator",
      description: "How to Convert HTML to Markdown",
      tags: ["Python"],
    },
    {
      title: "Footfall Data",
      description: "Analysing Footfall near British Museum",
      tags: ["Python", "Seaborn", "Matplotlib"],
    },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText("68e3••••••••••••••••03a8");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    const fetchSubsInfo = () => {
      dispatch(getUserSubscriptionInfo());
      dispatch(getUsesCredit());
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

  const handleFindPercent = (subscribtionInfo) => {
    return (
      ((subscribtionInfo?.creditsTotal - subscribtionInfo?.creditsRemaining) /
        subscribtionInfo?.creditsTotal) *
      100
    );
  };

  if (!subscribtionInfo)
    return (
      <div className="flex h-[80vh] items-center justify-center text-lg text-muted-foreground">
        Loading...
      </div>
    );
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Upgrade Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 mb-6 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">
              Upgrade and go faster
            </h2>
            <p className="text-indigo-100">
              Plans start at $40/month. Cancel anytime — no strings attached.
            </p>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
          See plans
        </button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Usage</h2>
        <p className="text-gray-600 mb-4">
          Track your credit consumption and current concurrency.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Usage */}
          {Array.isArray(trakCreditArray) &&
            trakCreditArray.map((el, i) => (
              <div
                className="bg-white rounded-xl shadow-md border-t-4 border-indigo-500 p-6"
                key={i}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium  tracking-wide">
                    {el?.serviceName}
                  </h3>
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Credit Usage
                  </h3>
                  <span className="text-2xl font-bold text-gray-800">
                    {handleFindPercent(el)}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full"
                    style={{ width: `${handleFindPercent(el)}%` }}
                  ></div>
                </div>

                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Credits used</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {el?.creditsRemaining}
                      <span className="text-gray-400">
                        /{el?.creditsTotal}{" "}
                      </span>
                    </p>
                    <div className="flex items-center justify-between gap-6 text-sm text-gray-700">
                      <p>
                        Remaining:{" "}
                        <span className="font-semibold text-gray-900">
                          {el?.creditsRemaining}
                        </span>
                      </p>

                      <p>
                        Ends In{" "}
                        <span className="font-bold text-lg text-blue-600">
                          {el.remainingDays}
                        </span>{" "}
                        days
                      </p>
                    </div>
                  </div>
                  {/* <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Top Up with PAYG
              </button> */}
                </div>
              </div>
            ))}
          <div className="bg-white rounded-xl shadow-md border-t-4 border-indigo-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                Credit Usage
              </h3>
              <span className="text-2xl font-bold text-gray-800">
                {handleFindPercent({
                  creditsTotal: subscribtionInfo?.totalCredits,
                  creditsRemaining: subscribtionInfo?.totalRemaining,
                })}
                %
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full"
                style={{
                  width: `${handleFindPercent({ creditsTotal: subscribtionInfo?.totalCredits, creditsRemaining: subscribtionInfo?.totalRemaining })}%`,
                }}
              ></div>
            </div>

            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Credits used</p>
                <p className="text-2xl font-bold text-gray-800">
                  {subscribtionInfo?.totalRemaining}
                  <span className="text-gray-400">
                    /{subscribtionInfo?.totalCredits}{" "}
                  </span>
                </p>
                <div className="flex items-center justify-between gap-6 text-sm text-gray-700">
                  <p>
                    Remaining:{" "}
                    <span className="font-semibold text-gray-900">
                      {subscribtionInfo?.totalRemaining}
                    </span>
                  </p>
                </div>
              </div>
              <button className="bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Top Up with PAYG
              </button>
            </div>
          </div>
          {/* Concurrency Usage */}
          <div className="bg-white rounded-xl shadow-md border-t-4 border-indigo-500 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                Concurrency Usage
              </h3>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                idle
              </span>
            </div>

            <div className="flex items-center justify-center h-32">
              <div className="text-center">
                <p className="text-6xl font-bold text-gray-800">0</p>
                <p className="text-sm text-gray-600 mt-2">
                  Active concurrent requests right now.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Statistics</h2>
          <p className="text-gray-600 mb-6">
            Daily credits used (last 30 days).
          </p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={credit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="totalcredit"
                stroke="#3d5ce9ff"
                strokeWidth={3}
                dot={{ fill: "#3d5ce9ff", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Example Projects */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-indigo-600 text-sm font-bold uppercase tracking-wide mb-4">
            Example Projects
          </h3>

          <div className="space-y-6">
            {exampleProjects.map((project, idx) => (
              <div
                key={idx}
                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
              >
                <h4 className="font-bold text-gray-800 mb-1">
                  {project.title}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button className="fixed bottom-8 right-8 bg-indigo-500 text-white p-4 rounded-full shadow-lg hover:bg-indigo-600 transition-all hover:scale-110">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
};

export default PlanDashboard;
