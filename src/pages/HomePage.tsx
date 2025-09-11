import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, Plus } from "lucide-react";

export default function HomePage() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, { count: 10 }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-muted-foreground">Carregando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Bem-vindo, {viewer ?? "Usuário"}!</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie suas tarefas e convide membros para sua equipe.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Demo: Números Aleatórios
            </CardTitle>
            <CardDescription>
              Demonstração da sincronização em tempo real do Convex.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => {
                void addNumber({ value: Math.floor(Math.random() * 10) });
              }}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Número Aleatório
            </Button>
            <div className="p-4 glass-subtle rounded-xl border border-border/30">
              <p className="text-sm font-medium mb-2">Números:</p>
              <p className="text-sm text-muted-foreground font-mono">
                {numbers?.length === 0
                  ? "Clique no botão para começar!"
                  : numbers?.join(", ") ?? "..."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recursos Úteis</CardTitle>
            <CardDescription>
              Links importantes para desenvolvimento com Convex.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ResourceLink
              title="Documentação do Convex"
              description="Documentação completa de todas as funcionalidades."
              href="https://docs.convex.dev/home"
            />
            <ResourceLink
              title="Templates"
              description="Coleção de templates para começar rapidamente."
              href="https://www.convex.dev/templates"
            />
            <ResourceLink
              title="Discord"
              description="Comunidade de desenvolvedores para tirar dúvidas."
              href="https://www.convex.dev/community"
            />
          </CardContent>
        </Card>
      </div>

      <Card className="glass-subtle border-border/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Dica:</strong> Use a sidebar para navegar entre as páginas da aplicação.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ResourceLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-start justify-between p-4 glass-subtle rounded-xl border border-border/20 hover:glass hover:border-border/40 transition-all duration-200 hover:scale-[1.02]">
      <div className="flex-1">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:text-primary transition-colors inline-flex items-center gap-2"
        >
          {title}
          <ExternalLink className="h-3 w-3" />
        </a>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}