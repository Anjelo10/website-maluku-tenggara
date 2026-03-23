"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/LoadingButton";

const signinSchema = z.object({
  email: z.email({ message: "Email tidak valid" }),
  password: z.string().min(8, { error: "Password minimal 8 karakter" }),
});
type SignUpValues = z.infer<typeof signinSchema>;

const SingIpPageView = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit({ email, password }: SignUpValues) {
    setError(null);
    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Terjadi Kesalahan");
    } else {
      toast.success("Signed In Succes");
      router.push("/");
    }
  }

  return (
    <section className="w-screen h-screen bg-gray-200">
      <div className="flex items-center justify-center w-full h-full">
        <Card className="bg-gray-200 w-1/4">
          <CardHeader>
            <CardTitle>SignUp Acount</CardTitle>
            <CardDescription>Enter Your Email and Password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Email Input */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        aria-invalid={fieldState.invalid}
                        placeholder="example@gmail.com"
                        autoComplete="off"
                      />
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-red-600"
                        />
                      )}
                    </Field>
                  )}
                />
                {/* Password Input */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          aria-invalid={fieldState.invalid}
                          placeholder="Password"
                          autoComplete="off"
                          type={showPassword ? "text" : "password"}
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide Password" : "Show Password"}
                          </span>
                        </Button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-red-600"
                        />
                      )}
                    </Field>
                  )}
                />

                {error && (
                  <div role="alert" className="text-sm text-red-600">
                    {error}
                  </div>
                )}
                <Field orientation="horizontal">
                  <LoadingButton
                    type="submit"
                    variant="default"
                    className=" cursor-pointer hover:bg-primary/70 w-full text-white"
                    loading={loading}
                  >
                    Sign In
                  </LoadingButton>
                </Field>
              </FieldGroup>
            </form>
            <CardDescription>
              <span className="flex items-center justify-center gap-1 pt-3">
                You don't hane an account?
                <Link
                  href={"/sign-up"}
                  className="hover:underlin text-blue-600 "
                >
                  Sign Up
                </Link>
              </span>
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default SingIpPageView;
