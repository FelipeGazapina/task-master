import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Modal from "./Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CreateReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export default function CreateReleaseModal({ isOpen, onClose, projectId }: CreateReleaseModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const createRelease = useMutation((api as any).myFunctions.createRelease);

  const reset = () => {
    setTitle("");
    setDescription("");
  };

  const handleClose = () => {
    if (!isCreating) {
      reset();
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setIsCreating(true);
    try {
      await createRelease({
        projectId: projectId as any,
        title,
        description,
      });
      handleClose();
    } catch (err) {
      console.error("Erro ao criar release:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Criar Release"
      description="Defina uma release para organizar demandas."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: v1.0, Sprint 1" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Descrição</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" />
        </div>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isCreating}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!title || isCreating}>
            {isCreating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Criando...</> : "Criar Release"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
