import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "@/hooks/useNavigation";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const { navigate } = useNavigation();
  
  const organization = useQuery(api.myFunctions.getUserOrganization);
  const createTeam = useMutation(api.myFunctions.createTeam);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !organization) return;

    setIsCreating(true);
    setFeedback(null);
    
    try {
      await createTeam({
        organizationId: organization._id,
        name: teamName.trim(),
      });
      setFeedback({ 
        type: 'success', 
        message: `Team "${teamName}" criado com sucesso!` 
      });
      setTeamName("");
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/app");
      }, 2000);
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

  if (organization === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="space-y-8">
        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Organização necessária
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  Para criar um team, você precisa primeiro ter uma organização. 
                  Volte à página inicial para criar sua organização.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/app")}
                className="border-amber-600 text-amber-600 hover:bg-amber-50 dark:border-amber-400 dark:text-amber-400 dark:hover:bg-amber-950/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app")}
          className="hover:glass-subtle"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Criar Team</h1>
          <p className="text-muted-foreground mt-2">
            Crie um novo team para organizar seus projetos e tarefas.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Novo Team
            </CardTitle>
            <CardDescription>
              O team será criado na organização "{organization.name}".
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="teamName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Nome do Team
                </label>
                <Input
                  id="teamName"
                  type="text"
                  placeholder="Digite o nome do team..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={isCreating}
                  className="glass-subtle border-border/30 focus:glass focus:border-primary/50"
                  required
                />
              </div>

              <div className="p-4 glass-subtle rounded-xl border border-border/30">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Sobre teams</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Teams são grupos de colaboradores que trabalham juntos em projetos. 
                      Você será automaticamente adicionado como administrador do team criado.
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
                      Team Criado!
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Criar Team
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app")}
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}