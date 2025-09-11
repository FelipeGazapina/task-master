import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  onProjectCreated?: (projectId: string) => void;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  organizationId,
  onProjectCreated,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [totalHours, setTotalHours] = useState<string>("");
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);

  const createProject = useMutation(api.myFunctions.createProject);

  const reset = () => {
    setName("");
    setDescription("");
    setTotalHours("");
    setHourlyRate("");
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !totalHours) return;
    const total = Number(totalHours);
    const rate = hourlyRate ? Number(hourlyRate) : undefined;
    if (Number.isNaN(total) || total <= 0) return;
    if (rate !== undefined && (Number.isNaN(rate) || rate < 0)) return;

    setIsCreating(true);
    try {
      const id = await createProject({
        organizationId: organizationId as any,
        name,
        description,
        totalHoursBudgeted: total,
        hourlyRate: rate,
      });
      onProjectCreated?.(id);
      handleClose();
    } catch (err) {
      console.error("Erro ao criar projeto:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Projeto"
      description="Defina um novo projeto com horas orçadas e valor hora."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nome</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Site ACME" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Horas Orçadas</label>
            <Input
              type="number"
              min="0"
              step="0.5"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="Ex.: 120"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Valor Hora (opcional)</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="Ex.: 150"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!name || !totalHours || isCreating}>
            {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando...</> : "Criar Projeto"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

