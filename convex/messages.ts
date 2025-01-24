import { v } from "convex/values";
import { mutation } from "./_generated/server";


export const createMessage = mutation({
    args: {
            conversationId: v.id("conversations"), 
            senderId: v.string(), 
            text: v.string(), 
    },
    handler : async (ctx , {conversationId, senderId, text}) => {

        const message = await ctx.db.insert("messages",{
            conversationId: conversationId, 
            senderId: senderId, 
            text: text, 
            sentAt: new Date().getTime(), 
            content:[], 
        })

        return message;
    }
})


export const getConvMessages = mutation({
    args: {
        conversationId : v.id("conversations"),
    },
    handler : async(ctx , {conversationId}) =>{

        const messages = ctx.db.query("messages")
        .filter((q)=>q.eq(q.field("conversationId") , conversationId))
        .collect();

        return messages;
    }

})