import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const ensureOrg = useMutation(api.myFunctions.ensureUserOrganization);
  const acceptInvite = useMutation((api as any).teamInvites.acceptInvite);
  const inviteToken = new URLSearchParams(window.location.search).get("invite");

  return (
    <main className="p-8 flex flex-col gap-16">
      <h1 className="text-4xl font-bold text-center">Convex + React + Convex Auth</h1>
      <div className="flex flex-col gap-8 w-96 mx-auto">
        <p>Log in to see the numbers</p>
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            if (inviteToken) {
              formData.set("flow", "signUp");
            }
            void signIn("password", formData)
              .then(async () => {
                if (inviteToken) {
                  try {
                    await ensureOrg({});
                    await acceptInvite({ token: inviteToken });
                  } catch {
                    // Swallow errors
                  }
                }
              })
              .catch((err) => {
                setError(err.message);
              });
          }}
        >
          <input
            className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
            type="email"
            name="email"
            placeholder="Email"
          />
          <input
            className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
            type="password"
            name="password"
            placeholder="Password"
          />
          <button
            className="bg-dark dark:bg-light text-light dark:text-dark rounded-md"
            type="submit"
          >
            Sign in
          </button>
          {error && (
            <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
              <p className="text-dark dark:text-light font-mono text-xs">
                Error signing in: {error}
              </p>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

