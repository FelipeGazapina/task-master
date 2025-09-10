import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function InvitePage() {
  const createInvite = useMutation((api as any).teamInvites.createInvite);
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const sendEmailInvite = () => {
    if (!email.trim() || !inviteLink) return;
    
    const subject = "Convite para participar da equipe";
    const body = `Você foi convidado(a) para participar de uma equipe.\n\nClique no link para aceitar: ${inviteLink}`;
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    window.open(mailtoLink);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Convidar Usuário</h1>
      
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">ID do Time</label>
          <input
            className="w-full bg-light dark:bg-dark text-dark dark:text-light rounded-md p-3 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="Digite o ID do time"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Função</label>
          <select
            className="w-full bg-light dark:bg-dark text-dark dark:text-light rounded-md p-3 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value as "member" | "admin")}
          >
            <option value="member">Membro</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <button
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400 text-white rounded-md py-3 px-6 font-medium transition-colors disabled:cursor-not-allowed"
          onClick={() => void generateInvite()}
          disabled={isLoading}
        >
          {isLoading ? "Gerando..." : "Gerar Link de Convite"}
        </button>

        {inviteLink && (
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="font-medium">Link de Convite Gerado</h3>
            
            <div className="flex gap-2">
              <input
                className="flex-1 bg-light dark:bg-dark text-dark dark:text-light rounded-md p-3 border-2 border-slate-200 dark:border-slate-800"
                value={inviteLink}
                readOnly
              />
              <button
                className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-4 py-3 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                onClick={() => void navigator.clipboard.writeText(inviteLink)}
              >
                Copiar
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Enviar por Email</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-light dark:bg-dark text-dark dark:text-light rounded-md p-3 border-2 border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:outline-none"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
                <button
                  className="bg-green-500 hover:bg-green-600 text-white rounded-md px-4 py-3 font-medium transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                  onClick={sendEmailInvite}
                  disabled={!email.trim()}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}