import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FolderPlus, Calendar, Clock, DollarSign, Eye } from "lucide-react";
import CreateProjectModal from "@/components/CreateProjectModal";
import { useNavigation } from "@/hooks/useNavigation";

export default function ProjectsPage() {
  const [openCreate, setOpenCreate] = useState(false);
  const organization = useQuery(api.myFunctions.getUserOrganization);
  const projects = organization
    ? useQuery((api as any).myFunctions.listProjectsByOrganization, { organizationId: organization._id })
    : undefined;
  const { navigate } = useNavigation();

  if (organization === undefined || projects === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Projetos</h1>
          <p className="text-muted-foreground mt-2">
            Crie projetos com horas orçadas e valor hora.
          </p>
        </div>
        {organization && (
          <Button onClick={() => setOpenCreate(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            Criar Projeto
          </Button>
        )}
      </div>

      {(projects?.length ?? 0) === 0 ? (
        <Card className="glass-subtle border-border/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <FolderPlus className="h-16 w-16 text-muted-foreground mx-auto opacity-50" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Crie seu primeiro projeto para começar a cadastrar demandas.
                </p>
              </div>
              <Button onClick={() => setOpenCreate(true)} size="lg">
                <FolderPlus className="mr-2 h-5 w-5" />
                Criar Projeto
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(projects ?? []).map((p) => (
            <Card key={p._id} className="glass-subtle border-border/30">
              <CardHeader>
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  Criado em {new Date(p.createdAt).toLocaleDateString('pt-BR')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4" />Horas Orçadas</span>
                  <span className="font-medium">{p.totalHoursBudgeted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-4 w-4" />Valor Hora</span>
                  <span className="font-medium">{p.hourlyRate != null ? p.hourlyRate : '-'}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/app/projects/${p._id}`)}>
                    <Eye className="mr-2 h-3 w-3" /> Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {organization && (
        <CreateProjectModal
          isOpen={openCreate}
          onClose={() => setOpenCreate(false)}
          organizationId={organization._id}
          onProjectCreated={() => { /* Convex cache atualiza automaticamente; fechamos modal */ }}
        />
      )}
    </div>
  );
}
