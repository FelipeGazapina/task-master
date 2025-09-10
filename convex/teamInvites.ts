import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v4 as uuidv4 } from "uuid";

export const createInvite = mutation({
  args: {
    teamId: v.id("teams"),
    role: v.union(v.literal("member"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const membership = await ctx.db
      .query("teamMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("teamId"), args.teamId))
      .first();
    if (!membership || membership.role !== "admin") {
      throw new Error("Not authorized");
    }

    const token = uuidv4();
    await ctx.db.insert("teamInvites", {
      token,
      teamId: args.teamId,
      role: args.role,
      createdBy: userId,
      createdAt: new Date().toISOString(),
    });
    return token;
  },
});

export const acceptInvite = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const invite = await ctx.db
      .query("teamInvites")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!invite) throw new Error("Invalid invite token");
    if (invite.usedBy) throw new Error("Invite already used");

    const existing = await ctx.db
      .query("teamMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("teamId"), invite.teamId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { role: invite.role });
    } else {
      await ctx.db.insert("teamMembers", {
        teamId: invite.teamId,
        userId,
        role: invite.role,
      });
    }

    await ctx.db.patch(invite._id, {
      usedBy: userId,
      usedAt: new Date().toISOString(),
    });
    return invite.teamId;
  },
});
