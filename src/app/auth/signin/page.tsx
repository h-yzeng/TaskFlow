"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Loader2, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  return (
    <div className="container max-w-md mx-auto flex min-h-[80vh] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="overflow-hidden">
          <CardHeader className="space-y-4 bg-primary px-6 py-8 text-primary-foreground">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-foreground/20">
                <CheckSquare className="h-8 w-8" />
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome to TaskFlow</h1>
              <p className="mt-2 text-primary-foreground/80">
                Sign in to manage your tasks
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
                <p className="font-medium">Authentication error</p>
                <p>
                  {error === "CredentialsSignin"
                    ? "Invalid credentials"
                    : error}
                </p>
              </div>
            )}

            <Button
              onClick={() => {
                setIsLoading(true);
                signIn("github", { callbackUrl });
              }}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Github className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Signing in..." : "Continue with GitHub"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}