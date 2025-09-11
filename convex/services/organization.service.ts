import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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

