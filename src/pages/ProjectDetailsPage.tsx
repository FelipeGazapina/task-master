import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Folder, Plus } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { Loader2 } from "lucide-react";
import CreateReleaseModal from "@/components/CreateReleaseModal";

interface ProjectDetailsPageProps {
  projectId: string;
}

export default function ProjectDetailsPage({ projectId }: ProjectDetailsPageProps) {
  const { navigate } = useNavigation();
  const [openRelease, setOpenRelease] = useState(false);

  const project = useQuery((api as any).myFunctions.getProjectById, { projectId: projectId as any });
  const releases = useQuery((api as any).myFunctions.listReleasesByProject, { projectId: projectId as any });

  if (project === undefined || releases === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando projeto...</span>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="space-y-8">
        <Card className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Folder className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">Projeto não encontrado</h3>
                <p className="text-red-800 dark:text-red-200 text-sm">O projeto solicitado não existe ou você não tem acesso a ele.</p>
              </div>
              <Button variant="outline" onClick={() => navigate("/app/projects")}> 
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Projetos
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
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/projects")} className="hover:glass-subtle">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Folder className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{project.name}</h1>
              <p className="text-muted-foreground mt-1">
                Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setOpenRelease(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Release
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Releases</CardTitle>
              <CardDescription>Gerencie as releases deste projeto.</CardDescription>
            </CardHeader>
            <CardContent>
              {(releases?.length ?? 0) === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma release criada ainda.
                </div>
              ) : (
                <div className="space-y-3">
                  {(releases ?? []).map((r) => (
                    <div key={r._id} className="flex items-center justify-between p-4 glass-subtle rounded-xl border border-border/30">
                      <div>
                        <p className="font-medium">{r.title}</p>
                        <p className="text-sm text-muted-foreground">{r.description || 'Sem descrição'}</p>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(r.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total de Releases</span>
                <span className="font-medium">{releases?.length ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateReleaseModal isOpen={openRelease} onClose={() => setOpenRelease(false)} projectId={projectId} />
    </div>
  );
}
