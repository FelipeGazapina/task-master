import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ArrowLeft, Mail, Settings, Crown, User, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import InviteUserModal from "@/components/InviteUserModal";
import { Loader2 } from "lucide-react";

interface TeamDetailsPageProps {
  teamId: string;
}

export default function TeamDetailsPage({ teamId }: TeamDetailsPageProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { navigate } = useNavigation();
  
  const teamDetails = useQuery(api.myFunctions.getTeamById, { 
    teamId: teamId as any 
  });

  if (teamDetails === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando detalhes do time...</span>
      </div>
    );
  }

  if (teamDetails === null) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Users className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                  Time não encontrado
                </h3>
                <p className="text-red-800 dark:text-red-200 text-sm">
                  O time solicitado não existe ou você não tem acesso a ele.
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate("/app/teams")}
                className="border-red-600 text-red-600 hover:bg-red-50 dark:border-red-400 dark:text-red-400"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Times
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isAdmin = teamDetails.userRole === "admin";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/app/teams")}
          className="hover:glass-subtle"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{teamDetails.name}</h1>
              <p className="text-muted-foreground mt-1">
                Criado em {new Date(teamDetails.createdAt).toLocaleDateString('pt-BR')} • 
                {teamDetails.members.length} {teamDetails.members.length === 1 ? 'membro' : 'membros'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <Button onClick={() => setShowInviteModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Convidar Membro
            </Button>
          )}
          {isAdmin && (
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informações do Time */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Membros do Time
              </CardTitle>
              <CardDescription>
                Gerencie os membros e suas permissões neste time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamDetails.members.map((member) => (
                  <div key={member._id} className="flex items-center justify-between p-4 glass-subtle rounded-xl border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{member.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{member.user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        member.role === 'admin' 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' 
                          : 'bg-muted/50 text-muted-foreground'
                      }`}>
                        {member.role === 'admin' ? (
                          <>
                            <Crown className="h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          <>
                            <User className="h-3 w-3" />
                            Membro
                          </>
                        )}
                      </div>
                      {isAdmin && member.role !== 'admin' && (
                        <Button variant="outline" size="sm">
                          Gerenciar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {teamDetails.members.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-50 mb-3" />
                    <p className="text-muted-foreground">Nenhum membro encontrado.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projetos do Time (placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle>Projetos</CardTitle>
              <CardDescription>
                Projetos associados a este time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-muted/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl">📁</div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Funcionalidade de projetos em breve...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar de Informações */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total de Membros</span>
                <span className="font-medium">{teamDetails.members.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Sua Função</span>
                <span className={`font-medium ${
                  isAdmin ? 'text-amber-600 dark:text-amber-400' : 'text-foreground'
                }`}>
                  {isAdmin ? 'Administrador' : 'Membro'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Criado em</span>
                <span className="font-medium">
                  {new Date(teamDetails.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowInviteModal(true)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Convidar Membro
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de Convite específico para este time */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        organizationId={""} // Não usado quando specificTeamId é fornecido
        specificTeamId={teamId}
        specificTeamName={teamDetails.name}
      />
    </div>
  );
}