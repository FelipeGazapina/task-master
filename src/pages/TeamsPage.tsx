import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Mail, Loader2, Crown, Calendar } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import CreateTeamModal from "@/components/CreateTeamModal";
import InviteUserModal from "@/components/InviteUserModal";

export default function TeamsPage() {
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTeamForInvite, setSelectedTeamForInvite] = useState<{id: string, name: string} | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { navigate } = useNavigation();

  const organization = useQuery(api.myFunctions.getUserOrganization);
  const teams = organization ? useQuery(api.myFunctions.listTeamsByOrganization, { 
    organizationId: organization._id 
  }) : undefined;

  const handleTeamCreated = () => {
    setRefreshKey(prev => prev + 1); // Force refresh of teams query
  };

  const handleViewDetails = (teamId: string) => {
    navigate(`/app/teams/${teamId}`);
  };

  const handleInviteToTeam = (teamId: string, teamName: string) => {
    setSelectedTeamForInvite({ id: teamId, name: teamName });
    setShowInviteModal(true);
  };

  const handleCloseInviteModal = () => {
    setShowInviteModal(false);
    setSelectedTeamForInvite(null);
  };

  if (organization === undefined || teams === undefined) {
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
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Gerenciar Times</h1>
          <p className="text-muted-foreground mt-2">
            Organize e gerencie suas equipes de trabalho.
          </p>
        </div>

        <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 text-amber-600 dark:text-amber-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Organização necessária
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm">
                  Para gerenciar times, você precisa primeiro ter uma organização. 
                  Volte à página inicial para criar sua organização.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Gerenciar Times</h1>
          <p className="text-muted-foreground mt-2">
            Organize e gerencie suas equipes de trabalho na organização "{organization.name}".
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowCreateTeamModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Criar Time
          </Button>
          <Button variant="outline" onClick={() => setShowInviteModal(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Convidar Usuário
          </Button>
        </div>
      </div>

      {(teams?.length ?? 0) === 0 ? (
        <Card className="glass-subtle border-border/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Nenhum time criado</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Comece criando seu primeiro time para organizar projetos e colaborar com sua equipe.
                </p>
              </div>
              <Button onClick={() => setShowCreateTeamModal(true)} size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Criar Primeiro Time
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(teams ?? []).map((team) => (
            <Card key={team._id} className="glass-subtle border-border/30 hover:glass hover:border-border/50 transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                    <Crown className="h-3 w-3" />
                    Admin
                  </div>
                </div>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  Criado em {new Date(team.createdAt).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Membros</span>
                    <span className="font-medium">1</span> {/* TODO: Contar membros reais */}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleInviteToTeam(team._id, team.name)}
                    >
                      <Mail className="mr-2 h-3 w-3" />
                      Convidar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(team._id)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {organization && (
        <>
          <CreateTeamModal
            isOpen={showCreateTeamModal}
            onClose={() => setShowCreateTeamModal(false)}
            organizationId={organization._id}
            onTeamCreated={handleTeamCreated}
          />
          
          <InviteUserModal
            isOpen={showInviteModal}
            onClose={handleCloseInviteModal}
            organizationId={organization._id}
            specificTeamId={selectedTeamForInvite?.id}
            specificTeamName={selectedTeamForInvite?.name}
          />
        </>
      )}
    </div>
  );
}
