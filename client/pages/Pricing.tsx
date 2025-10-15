import React, { useEffect, useState } from "react";
import { Check, CircleCheck, Info, MoveRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import api from "@/api/axios";
import { Link } from "react-router-dom";
import { getPlanByserviceKey } from "@/store/planSlice";
import { useLocation } from "react-router-dom";

interface Plan {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
}

type BillingCycle = "monthly" | "yearly";

const PricingPlans: React.FC = () => {
  const { search } = useLocation(); 
  const queryParams = new URLSearchParams(search);
  const q = queryParams.get("q");
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const { plan } = useSelector((state: RootState) => state.plan);
  const dispatch = useDispatch<AppDispatch>();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const getPrice = (plan: Plan): number => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  useEffect(() => {
    const fetchData = () => {
      if (q) {
        dispatch(getPlanByserviceKey(q));
      }
    };
    fetchData();
  }, []);

  const handlePayment = async (planId: string) => {
    const res = await api.post("/plan/create-order", { planId });
    const order = res.data.order;
    const options = {
      key: import.meta.env.VITE_RAZOR_PAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Influecer Builder",
      description: "Plan Purchase",
      order_id: order.id,
      handler: async function (response: any) {
        await api.post("/plan/verify-payment", { ...response, planId });
        alert("Payment successful!");
      },
    };
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      {/* <Header /> */}
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-blue-500 text-sm font-medium mb-4 uppercase tracking-wide">
              FLEXIBLE PRICING PLANS
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find the Perfect Plan for Your Influencer
              <br />
              Marketing Needs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent pricing with all the features you need to
              discover influencers and manage successful campaigns.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {
                            Array.isArray(plan) && plan?.map((plan, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`bg-white rounded-2xl shadow-sm border-2 relative overflow-hidden ${plan.populer
                                            ? 'border-blue-500 transform scale-105'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        {plan.populer && (
                                            <div className="bg-blue-500 text-white text-center py-2 font-medium text-sm">
                                                Most popular plan
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan?.planName?.charAt(0).toUpperCase()+plan?.planName.slice(1)}</h3>
                                            <p className="text-gray-600 mb-2">{plan.description}</p>

                                            <div className="mb-4">
                                                <div className="flex items-baseline">
                                                    <span className="text-3xl font-bold text-gray-900">
                                                        {plan.currency === "USD" ? "$" : "₹"}{plan.priceCents}
                                                    </span>
                                                    <span className="text-gray-600 ml-2">/{billingCycle === 'monthly' ? 'month' : 'month'}</span>
                                                </div>
                                                {billingCycle === 'yearly' && (
                                                    <p className="text-sm text-green-600 mt-2">
                                                        Billed annually (${getPrice(plan) * 12}/year)
                                                    </p>
                                                )}
                                            </div>

                                            <div className="mb-8">
                                                <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                                                <ul className="space-y-3">
                                                    {plan?.feature?.map((feature: string, index: number) => (
                                                        <li key={index} className="flex items-start">
                                                            {accessToken?<CircleCheck className='h-5 w-5 text-green-500  mr-3 flex-shrink-0' />:<Check className="h-5 w-5 text-green-500  mr-3 flex-shrink-0" />}
                                                            <span className="text-gray-700 text-sm">{feature}</span>
                                                            {(feature.includes('Analytics') || feature.includes('Search Results')) && (
                                                                <Info className="h-4 w-4 text-gray-400 ml-2  flex-shrink-0" />
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {accessToken ? <button
                                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${plan.populer
                                                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                                    }`}
                                                onClick={() => handlePayment(plan?._id)}
                                            >
                                                Get Started
                                            </button> : <Link
                                                to={accessToken ? "/" : "/login"}
                                                className="flex items-center justify-center gap-2 text-white bg-primary py-3 px-6 rounded-lg font-semibold transition-colors duration-300 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                            >
                                                Get Started
                                                <MoveRight className="w-5 h-5" />
                                            </Link>
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-500">
              <span>✓ Cancel anytime</span>
              <span>✓ 24/7 customer support</span>
              <span>✓ No setup fees</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
