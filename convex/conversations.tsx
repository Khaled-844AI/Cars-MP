import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getConvMessages } from "./messages";

export const createConversation = mutation({
  args: {
    participants: v.array(v.string()), 
  },
  handler: async (ctx, args) => {
    const { participants } = args;

    const sortedParticipants = [...participants].sort();

    const existingConversation = await ctx.db
      .query("conversations").filter((q)=>q.eq(q.field("participants") , sortedParticipants)).first();

    if (existingConversation) {
      return existingConversation; 
    }

    const newConversation = await ctx.db.insert("conversations", {
      participants: sortedParticipants, 
      createdAt: Date.now(), 
    });

    return {_id : newConversation};
  },
});


export const getConversation = mutation({
    args: {
        id: v.id("conversations"), 
    },
    handler: async (ctx, args) => {
      const { id } = args;
  
      const conversation = await ctx.db.get(id);
  
      if (!conversation) {
        throw new Error("Conversation not found.");
      }
  
      return conversation;
    },
  });

export const getConversations = mutation({
    args:{
        userId: v.string(), 
    },
    handler: async (ctx , args) => {
        const {userId} = args;
        const result = [];

        for await (const conversation of ctx.db.query("conversations")){
            if(conversation.participants.includes(userId)){
                const messages = await getConvMessages(ctx, {conversationId: conversation._id});
                result.push({ conversation, messages});
            }
        }
        return result;
    }
});  


export const deleteConversation = mutation({
  args: {
    conversationId: v.id("conversations"), 
  },
  handler: async (ctx, { conversationId }) => {
    
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", conversationId)
      )
      .collect();


    await ctx.db.delete(conversationId);

    await Promise.all(
        messages.map(async (message) => {
          await ctx.db.delete(message._id);
        })
    );

    return { success: true };
  },
});
  
  