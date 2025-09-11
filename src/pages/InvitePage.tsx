import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Link2, Loader2, Mail, Send, UserPlus } from "lucide-react";

export default function InvitePage() {
  const createInvite = useMutation((api as any).teamInvites.createInvite);
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const generateInvite = async () => {
    if (!teamId.trim()) {
      alert("Por favor, insira o ID do time.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await createInvite({ teamId: teamId as any, role });
      const link = `${window.location.origin}?invite=${token}`;
      setInviteLink(link);
      void navigator.clipboard.writeText(link).catch(() => {});
    } catch (error) {
      alert("Erro ao criar convite: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const sendEmailInvite = () => {
    if (!email.trim() || !inviteLink) return;
    
    const subject = "Convite para participar da equipe";
    const body = `Você foi convidado(a) para participar de uma equipe.\n\nClique no link para aceitar: ${inviteLink}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 glass-subtle rounded-2xl border border-border/30 mb-4">
          <UserPlus className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Convidar Usuário
        </h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Crie um link de convite para adicionar novos membros à sua equipe.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Criar Convite
          </CardTitle>
          <CardDescription>
            Preencha as informações abaixo para gerar um link de convite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">ID do Time</label>
            <Input
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="Digite o ID do time"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Função</label>
            <Select value={role} onValueChange={(value: "member" | "admin") => setRole(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => void generateInvite()}
            disabled={isLoading || !teamId.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Gerar Link de Convite
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {inviteLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Link de Convite Gerado
            </CardTitle>
            <CardDescription>
              Compartilhe este link ou envie por email para convidar novos membros.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => void copyToClipboard()}
              >
                <Copy className="h-4 w-4" />
                {copySuccess ? "Copiado!" : "Copiar"}
              </Button>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Enviar por Email</label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                  className="flex-1"
                />
                <Button
                  onClick={sendEmailInvite}
                  disabled={!email.trim()}
                  variant="default"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}