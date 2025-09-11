import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const listNumbers = query({
  args: { count: v.number() },
  handler: async (ctx, args) => {
    const numbers = await ctx.db
      .query("numbers")
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

export const addNumber = mutation({
  args: { value: v.number() },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("numbers", { value: args.value });
    console.log("Added new document with id:", id);
  },
});

