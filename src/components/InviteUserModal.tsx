import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Loader2, CheckCircle, AlertCircle, Copy, Users } from "lucide-react";
import Modal from "./Modal";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onInviteSent?: () => void;
  specificTeamId?: string;
  specificTeamName?: string;
}

export default function InviteUserModal({ 
  isOpen, 
  onClose, 
  organizationId, 
  onInviteSent,
  specificTeamId,
  specificTeamName
}: InviteUserModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"member" | "admin">("member");
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string, inviteLink?: string} | null>(null);
  
  const teams = specificTeamId ? undefined : useQuery(api.myFunctions.listTeamsByOrganization, { 
    organizationId: organizationId as any
  });
  const createInvite = useMutation((api as any).teamInvites.createInvite);

  // Set the team ID automatically if specificTeamId is provided
  useEffect(() => {
    if (specificTeamId && selectedTeamId !== specificTeamId) {
      setSelectedTeamId(specificTeamId);
    }
  }, [specificTeamId, selectedTeamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) return;

    setIsCreating(true);
    setFeedback(null);
    
    try {
      const result = await createInvite({
        teamId: selectedTeamId,
        role: selectedRole,
      });
      
      const inviteLink = `${window.location.origin}/?invite=${result.token}`;
      
      setFeedback({ 
        type: 'success', 
        message: 'Convite criado com sucesso! Compartilhe o link abaixo:',
        inviteLink
      });
    } catch (error) {
      console.error("Erro ao criar convite:", error);
      setFeedback({ 
        type: 'error', 
        message: `Erro ao criar convite: ${(error as Error).message}` 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Feedback temporário de cópia seria bom, mas vamos manter simples
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      if (!specificTeamId) {
        setSelectedTeamId("");
      }
      setSelectedRole("member");
      setFeedback(null);
      onClose();
    }
  };

  // Loading state when fetching teams for the general (non-specific) modal
  if (!specificTeamId && !teams) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title="Convidar Usuário"
        description="Convide pessoas para participar dos seus times."
      >
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Carregando times...</span>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Convidar Usuário"
      description="Convide pessoas para participar dos seus times."
    >
      {!specificTeamId && (teams?.length ?? 0) === 0 ? (
        <div className="text-center space-y-4">
          <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-50" />
          <div>
            <h3 className="font-semibold mb-2">Nenhum time disponível</h3>
            <p className="text-sm text-muted-foreground">
              Você precisa criar um time antes de convidar usuários.
            </p>
          </div>
          <Button onClick={handleClose}>
            Entendido
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              {specificTeamId ? 'Time' : 'Selecionar Time'}
            </label>
            {specificTeamId ? (
              <div className="p-3 glass-subtle rounded-xl border border-border/30 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">{specificTeamName}</span>
              </div>
            ) : (
              <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                <SelectTrigger className="glass-subtle border-border/30">
                  <SelectValue placeholder="Escolha um time..." />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem key={team._id} value={team._id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Função no Time
            </label>
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as "member" | "admin")}>
              <SelectTrigger className="glass-subtle border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Membro</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 glass-subtle rounded-xl border border-border/30">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Como funciona</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Um link de convite será gerado. A pessoa convidada poderá usar este link 
                  para criar uma conta e ser automaticamente adicionada ao time selecionado.
                </p>
              </div>
            </div>
          </div>

          {feedback && (
            <div className={`p-4 rounded-xl border ${
              feedback.type === 'success' 
                ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                : 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
            }`}>
              <div className="flex items-start gap-3">
                {feedback.type === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 space-y-3">
                  <p className={`text-sm leading-relaxed ${
                    feedback.type === 'success' 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {feedback.message}
                  </p>
                  {feedback.inviteLink && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={feedback.inviteLink}
                          readOnly
                          className="text-xs font-mono"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(feedback.inviteLink!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!(specificTeamId ? specificTeamId : selectedTeamId) || isCreating}
              className="flex-1"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando Convite...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Gerar Convite
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              {feedback?.type === 'success' ? 'Fechar' : 'Cancelar'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
