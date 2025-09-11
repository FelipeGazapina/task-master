import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { ThemeToggleCompact } from "@/components/ThemeToggle";

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const ensureOrg = useMutation(api.myFunctions.ensureUserOrganization);
  const acceptInvite = useMutation((api as any).teamInvites.acceptInvite);
  const inviteToken = new URLSearchParams(window.location.search).get("invite");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    // Definir o flow baseado no estado ou token de convite
    formData.set("flow", inviteToken ? "signUp" : (isSignUp ? "signUp" : "signIn"));

    try {
      await signIn("password", formData);
      if (inviteToken || isSignUp) {
        try {
          await ensureOrg({});
          if (inviteToken) {
            await acceptInvite({ token: inviteToken });
          }
        } catch {
          // Swallow errors
        }
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggleCompact />
      </div>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 glass-strong rounded-3xl border border-border/30 mb-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TM
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Task Master
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Faça login para acessar sua conta
          </p>
          {inviteToken && (
            <div className="mt-6 p-4 glass-subtle border border-primary/30 rounded-2xl">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-primary leading-relaxed">
                  Você foi convidado para participar de uma equipe! Faça login para aceitar o convite.
                </p>
              </div>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" />
              {inviteToken ? "Criar Conta" : (isSignUp ? "Criar Conta" : "Entrar")}
            </CardTitle>
            <CardDescription>
              {inviteToken 
                ? "Complete seu cadastro para aceitar o convite" 
                : (isSignUp 
                  ? "Crie sua conta para começar a usar o Task Master"
                  : "Digite suas credenciais para acessar sua conta"
                )
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    placeholder="seu@email.com"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Sua senha"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading 
                  ? (inviteToken || isSignUp ? "Criando conta..." : "Entrando...") 
                  : (inviteToken || isSignUp ? "Criar Conta" : "Entrar")
                }
              </Button>

              {!inviteToken && (
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:text-blue-600 underline"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                  >
                    {isSignUp ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
                  </button>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-3 p-4 glass-subtle border border-destructive/30 rounded-xl">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive leading-relaxed">
                    Erro ao fazer login: {error}
                  </p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">Convex</span> + <span className="font-medium">React</span> + <span className="font-medium">shadcn/ui</span>
          </p>
        </div>
      </div>
    </div>
  );
}

