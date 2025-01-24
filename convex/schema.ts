import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    username: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    email: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  conversations: defineTable({
    participants: v.array(v.string()), 
    createdAt: v.number(), 
  })
  .index("by_participants", ["participants"])
  ,

  messages: defineTable({
    conversationId: v.id("conversations"), 
    senderId: v.string(), 
    text: v.string(), 
    sentAt: v.number(), 
    content: v.array(v.string()) 
  })
    .index("by_conversation", ["conversationId"])
});
