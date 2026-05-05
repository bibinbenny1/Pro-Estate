import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/_app")({
  component: () => (
    <AuthProvider>
      <Guarded />
    </AuthProvider>
  ),
});

function Guarded() {
  const { loading, session } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // Use window.location to bounce — TanStack redirect() inside loader needs router context
        window.location.replace("/login");
      } else {
        setReady(true);
      }
    }
  }, [loading, session]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

