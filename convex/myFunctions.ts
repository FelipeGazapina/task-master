import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Re-export domain functions organized by DDD folders
export { listNumbers, addNumber } from "./services/numbers.service";
export { ensureUserOrganization, getUserOrganization } from "./services/organization.service";
export { createTeam, listTeamsByOrganization, getTeamById } from "./services/team.service";
export { createProject, listProjectsByOrganization, getProjectById } from "./services/project.service";
export { createRelease, listReleasesByProject } from "./services/release.service";

// Keep demo action as example referencing re-exported functions
export const myAction = action({
  args: {
    first: v.number(),
    second: v.string(),
  },
  handler: async (ctx, args) => {
    const data = await ctx.runQuery(api.myFunctions.listNumbers, { count: 10 });
    console.log(data);
    await ctx.runMutation(api.myFunctions.addNumber, { value: args.first });
  },
});
