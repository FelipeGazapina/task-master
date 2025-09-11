import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProject = mutation({
  args: {
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.optional(v.string()),
    totalHoursBudgeted: v.number(),
    hourlyRate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const org = await ctx.db.get(args.organizationId);
    if (!org) throw new Error("Organization not found");
    if (org.createdBy !== userId) throw new Error("Not authorized");

    const projectId = await ctx.db.insert("projects", {
      organizationId: args.organizationId,
      name: args.name,
      description: args.description ?? "",
      totalHoursBudgeted: args.totalHoursBudgeted,
      hourlyRate: args.hourlyRate,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });

    return projectId;
  },
});

export const listProjectsByOrganization = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_organizationId", (q) => q.eq("organizationId", args.organizationId))
      .collect();
    return projects;
  },
});

export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    const org = await ctx.db.get(project.organizationId);
    if (!org || org.createdBy !== userId) return null;
    return project;
  },
});

