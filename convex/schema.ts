import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  organizations: defineTable({
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }).index("by_createdBy", ["createdBy"]),
  teams: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }).index("by_organizationId", ["organizationId"]),
  teamMembers: defineTable({
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: v.union(v.literal("invited"), v.literal("member"), v.literal("admin")),
  }).index("by_teamId", ["teamId"]).index("by_userId", ["userId"]),
  projects: defineTable({
    organizationId: v.id("organizations"),
    name: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }),
  releases: defineTable({
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }),
  boards: defineTable({
    projectId: v.id("projects"),
    name: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }),
  boardColumns: defineTable({
    boardId: v.id("boards"),
    name: v.string(),
    position: v.number(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }),
  demands: defineTable({
    releaseId: v.id("releases"),
    columnId: v.id("boardColumns"),
    title: v.string(),
    description: v.string(),
    createdBy: v.id("users"),
    createdAt: v.string(),
  }),
  efforts: defineTable({
    demandId: v.id("demands"),
    type: v.union(v.literal("development"), v.literal("design"), v.literal("analysis"), v.literal("blocked")),
    startAt: v.string(),
    endAt: v.string(),
  })
});
