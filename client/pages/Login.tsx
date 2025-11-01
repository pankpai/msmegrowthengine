import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Github, Mail } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signIn } from "@/store/authSlice";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Values = z.infer<typeof schema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation() as any;
  const from = location.state?.from?.pathname || "/dashboard";

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: Values) => {
    try {
      const payload = { email: values.email, password: values.password };
      const res = await dispatch(signIn(payload));
      localStorage.setItem("refreshtoken", res?.payload?.refreshToken);
      localStorage.setItem("user",JSON.stringify(res?.payload?.user))
      if (
        res.meta?.requestStatus === "fulfilled" &&
        res?.payload?.success === true
      ) {
        navigate("/dashboard", { replace: true });
        form.reset();
      }
    } catch (e: any) {
      toast.error(e.message || "Login failed");
    }
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_0%,theme(colors.violet.200/.5),transparent_70%),linear-gradient(to_bottom_right,theme(colors.violet.100),theme(colors.indigo.100))]" />
      <div className="container grid min-h-[calc(100vh-8rem)] place-items-center py-16">
        <Card className="w-full max-w-md border-none bg-white/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Log in</CardTitle>
            <CardDescription>
              Welcome back. Enter your details to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email/Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com/yourusername"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
                >
                  Log in
                </Button>
              </form>
            </Form>
            <div className="my-6 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> OR{" "}
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 size-4" /> Google
              </Button>
              <Button variant="outline" className="w-full">
                <Github className="mr-2 size-4" /> GitHub
              </Button>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-foreground underline">
                Sign up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
