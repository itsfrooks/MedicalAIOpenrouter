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

      // Use the provided API key
      const apiKey = "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";

      // Get all previous messages for context
      const allMessages = await storage.getMessages();
      const conversationHistory = allMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Call OpenRouter API with Deepseek R1
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "Deepseek R1 Chatbot"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: conversationHistory,
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
