import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePage() {
  const { viewer, numbers } =
    useQuery(api.myFunctions.listNumbers, { count: 10 }) ?? {};
  const addNumber = useMutation(api.myFunctions.addNumber);

  if (viewer === undefined || numbers === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-slate-600 dark:text-slate-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Bem-vindo, {viewer ?? "Usuário"}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Demo: Números Aleatórios</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Esta é uma demonstração da sincronização em tempo real do Convex.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md border-2 transition-colors mb-4"
            onClick={() => {
              void addNumber({ value: Math.floor(Math.random() * 10) });
            }}
          >
            Adicionar Número Aleatório
          </button>
          <p className="text-sm">
            <strong>Números:</strong>{" "}
            {numbers?.length === 0
              ? "Clique no botão para começar!"
              : numbers?.join(", ") ?? "..."}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Recursos Úteis</h2>
          <div className="space-y-3">
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
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Dica:</strong> Use a sidebar para navegar entre as páginas da aplicação.
        </p>
      </div>
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
    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-md">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-600 text-sm font-medium underline hover:no-underline"
      >
        {title}
      </a>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{description}</p>
    </div>
  );
}