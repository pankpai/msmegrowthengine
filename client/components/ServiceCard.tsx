import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function ServiceCard({
  icon,
  title,
  description,
  to,
  isSubscribed,
  serviceKey,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
  isSubscribed: boolean;
  serviceKey: string;
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
          {isSubscribed ? (
            <Link to={to}>Open</Link>
          ) : (
            <Link to={`/pricing?q=${serviceKey}`}>Subscribe</Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}