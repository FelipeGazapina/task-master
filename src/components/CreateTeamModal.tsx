import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import Modal from "./Modal";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onTeamCreated?: () => void;
}

export default function CreateTeamModal({ 
  isOpen, 
  onClose, 
  organizationId, 
  onTeamCreated 
}: CreateTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  const createTeam = useMutation(api.myFunctions.createTeam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    setIsCreating(true);
    setFeedback(null);
    
    try {
      await createTeam({
        organizationId: organizationId as any,
        name: teamName.trim(),
      });
      
      setFeedback({ 
        type: 'success', 
        message: `Team "${teamName}" criado com sucesso!` 
      });
      setTeamName("");
      
      // Fechar modal e chamar callback após 1.5 segundos
      setTimeout(() => {
        onClose();
        onTeamCreated?.();
        setFeedback(null);
      }, 1500);
    } catch (error) {
      console.error("Erro ao criar team:", error);
      setFeedback({ 
        type: 'error', 
        message: `Erro ao criar team: ${(error as Error).message}` 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setTeamName("");
      setFeedback(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Novo Time"
      description="Crie um time para organizar projetos e colaborar com sua equipe."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="teamName" className="text-sm font-medium leading-none">
            Nome do Time
          </label>
          <Input
            id="teamName"
            type="text"
            placeholder="Digite o nome do time..."
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={isCreating || feedback?.type === 'success'}
            className="glass-subtle border-border/30 focus:glass focus:border-primary/50"
            required
          />
        </div>

        <div className="p-4 glass-subtle rounded-xl border border-border/30">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Sobre times</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Times são grupos de colaboradores que trabalham juntos em projetos. 
                Você será automaticamente adicionado como administrador do time criado.
              </p>
            </div>
          </div>
        </div>

        {feedback && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            feedback.type === 'success' 
              ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
              : 'bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            )}
            <p className={`text-sm leading-relaxed ${
              feedback.type === 'success' 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {feedback.message}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={!teamName.trim() || isCreating || feedback?.type === 'success'}
            className="flex-1"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : feedback?.type === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Time Criado!
              </>
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                Criar Time
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isCreating}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}