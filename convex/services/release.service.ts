import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createRelease = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    const org = await ctx.db.get(project.organizationId);
    if (!org || org.createdBy !== userId) throw new Error("Not authorized");

    const releaseId = await ctx.db.insert("releases", {
      projectId: args.projectId,
      title: args.title,
      description: args.description ?? "",
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    return releaseId;
  },
});

export const listReleasesByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");
    const org = await ctx.db.get(project.organizationId);
    if (!org || org.createdBy !== userId) return [];

    const releases = await ctx.db
      .query("releases")
      .withIndex("by_projectId", (q) => q.eq("projectId", args.projectId))
      .collect();
    return releases;
  },
});

