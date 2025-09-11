import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
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

export const getTeamById = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    const memberRecord = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    if (!memberRecord) return null;

    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect();

    const membersWithDetails = await Promise.all(
      teamMembers.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user
            ? {
                email: (user as any)?.email || "Email não disponível",
                name:
                  (user as any)?.name ||
                  (user as any)?.email?.split("@")[0] ||
                  "Usuário",
              }
            : null,
        };
      })
    );

    return {
      ...team,
      members: membersWithDetails,
      userRole: memberRecord.role,
    } as any;
  },
});

