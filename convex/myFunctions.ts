import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

// Write your Convex functions in any file inside this directory (`convex`).
// See https://docs.convex.dev/functions for more.

// You can read data from the database via a query:
export const listNumbers = query({
  // Validators for arguments.
  args: {
    count: v.number(),
  },

  // Query implementation.
  handler: async (ctx, args) => {
    //// Read the database as many times as you need here.
    //// See https://docs.convex.dev/database/reading-data.
    const numbers = await ctx.db
      .query("numbers")
      // Ordered by _creationTime, return most recent
      .order("desc")
      .take(args.count);
    const userId = await getAuthUserId(ctx);
    const user = userId === null ? null : await ctx.db.get(userId);
    const email = (user as any)?.email as string | undefined;
    return {
      viewer: email ?? null,
      numbers: numbers.reverse().map((n) => n.value),
    };
  },
});

// You can write data to the database via a mutation:
export const addNumber = mutation({
  // Validators for arguments.
  args: {
    value: v.number(),
  },

  // Mutation implementation.
  handler: async (ctx, args) => {
    //// Insert or modify documents in the database here.
    //// Mutations can also read from the database like queries.
    //// See https://docs.convex.dev/database/writing-data.

    const id = await ctx.db.insert("numbers", { value: args.value });

    console.log("Added new document with id:", id);
    // Optionally, return a value from your mutation.
    // return id;
  },
});

// Ensure an organization exists for the authenticated user (on sign-up)
export const ensureUserOrganization = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    const existing = await ctx.db
      .query("organizations")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .first();
    if (existing) return existing._id;

    const email = (user as any)?.email as string | undefined;
    const nameFromEmail = email ? email.split("@")[0] : "Minha organização";

    const orgId = await ctx.db.insert("organizations", {
      name: nameFromEmail,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });

    return orgId;
  },
});

// Get the user's organization
export const getUserOrganization = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_createdBy", (q) => q.eq("createdBy", userId))
      .first();

    return organization;
  },
});

// Create a new team
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

// List teams by organization
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

// Create a new project
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

// List projects by organization
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

// Get a single project by id (auth: org owner)
export const getProjectById = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;
    // Only the organization owner can access for now
    const org = await ctx.db.get(project.organizationId);
    if (!org || org.createdBy !== userId) return null;
    return project;
  },
});

// Create a new release under a project
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

// List releases in a project (auth: org owner)
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

// Get team by ID with members
export const getTeamById = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const team = await ctx.db.get(args.teamId);
    if (!team) return null;

    // Check if user has access to this team
    const memberRecord = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();

    // If the user isn't a member, don't throw to avoid crashing the UI;
    // return null so the client can render a friendly message
    if (!memberRecord) return null;

    // Get all team members with user details
    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect();

    const membersWithDetails = await Promise.all(
      teamMembers.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        return {
          ...member,
          user: user ? {
            email: (user as any)?.email || "Email não disponível",
            name: (user as any)?.name || (user as any)?.email?.split('@')[0] || "Usuário"
          } : null
        };
      })
    );

    return {
      ...team,
      members: membersWithDetails,
      userRole: memberRecord.role
    };
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  // Action implementation.
  handler: async (ctx, args) => {
    //// Use the browser-like `fetch` API to send HTTP requests.
    //// See https://docs.convex.dev/functions/actions#calling-third-party-apis-and-using-npm-packages.
    // const response = await ctx.fetch("https://api.thirdpartyservice.com");
    // const data = await response.json();

    //// Query data by running Convex queries.
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    //// Write data by running Convex mutations.
    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});
