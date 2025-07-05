import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createMessage({
        content: validatedData.content,
        role: "user"
      });

      // Get OpenRouter API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY?.trim();
      
      if (!apiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" });
      }

      // Get all previous messages for context
      const allMessages = await storage.getMessages();
      const conversationHistory = allMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add system prompt for chatbot
      const systemPrompt = {
        role: "system",
        content: `You are a helpful, friendly AI assistant powered by Deepseek R1. You can help with a wide variety of tasks including:

- Answering questions and providing information
- Helping with writing, analysis, and creative tasks
- Providing explanations and tutorials
- Assisting with problem-solving and brainstorming
- Engaging in thoughtful conversation

Please be helpful, accurate, and engaging in your responses. If you're unsure about something, it's okay to say so. Always strive to provide valuable and relevant information to the user.`
      };

      // Prepare conversation with system prompt
      const messagesWithSystem = [systemPrompt, ...conversationHistory];

      // Call OpenRouter API with Deepseek R1
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: messagesWithSystem,
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API error:", errorData);
        return res.status(500).json({ error: "Failed to get AI response" });
      }

      const aiResponse = await response.json();
      const assistantContent = aiResponse.choices[0].message.content;

      // Save assistant message
      const assistantMessage = await storage.createMessage({
        content: assistantContent,
        role: "assistant"
      });

      res.json({
        userMessage,
        assistantMessage
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
