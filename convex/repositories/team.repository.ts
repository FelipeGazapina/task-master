import { mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createTeam = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");
    if (org.createdBy !== userId) throw new Error("Not authorized");

    const teamId = await ctx.db.insert("teams", {
      organizationId: args.organizationId,
      name: args.name,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });

    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "admin",
    });

    return teamId;
  },
});

export const listTeamsByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    return teams;
  },
});

