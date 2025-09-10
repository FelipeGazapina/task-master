import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function InviteLinkCreator() {
  const createInvite = useMutation((api as any).teamInvites.createInvite);
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  const generateInvite = async () => {
    const token = await createInvite({ teamId: teamId as any, role });
    const link = `${window.location.origin}?invite=${token}`;
    setInviteLink(link);
    void navigator.clipboard.writeText(link).catch(() => {});
  };

  return (
    <div className="flex flex-col gap-2 border p-4 rounded-md">
      <p className="font-bold">Create team invite link</p>
      <input
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        value={teamId}
        onChange={(e) => setTeamId(e.target.value)}
        placeholder="Team ID"
      />
      <select
        className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
        value={role}
        onChange={(e) => setRole(e.target.value as "member" | "admin")}
      >
        <option value="member">member</option>
        <option value="admin">admin</option>
      </select>
      <button
        className="bg-dark dark:bg-light text-light dark:text-dark rounded-md px-2 py-1"
        onClick={() => void generateInvite()}
      >
        Generate link
      </button>
      {inviteLink && (
        <div className="flex flex-col gap-1">
          <input
            className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
            value={inviteLink}
            readOnly
          />
          <button
            className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
            onClick={() =>
              void navigator.clipboard.writeText(inviteLink).catch(() => {})
            }
          >
            Copy link
          </button>
        </div>
      )}
    </div>
  );
}

