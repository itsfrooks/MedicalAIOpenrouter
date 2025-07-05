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
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" });
      }

      // Get all previous messages for context
      const allMessages = await storage.getMessages();
      const conversationHistory = allMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add system prompt for medical diagnostic agent
      const systemPrompt = {
        role: "system",
        content: `You are an advanced medical diagnostic AI assistant with expertise in clinical medicine, differential diagnosis, and evidence-based healthcare. Your role is to:

**Primary Functions:**
1. **Comprehensive Symptom Analysis**: Analyze patient presentations systematically
2. **Differential Diagnosis**: Provide ranked differential diagnoses with probability estimates
3. **Diagnostic Testing**: Recommend appropriate laboratory tests, imaging, and other diagnostics
4. **Clinical Reasoning**: Explain your diagnostic reasoning process
5. **Next Steps**: Provide clear action plans and follow-up recommendations

**Response Format:**
For each patient case, provide:

**Initial Assessment:**
- Brief summary of key findings
- Risk stratification (low/moderate/high)

**Differential Diagnosis:**
- List 3-5 most likely conditions with probability percentages
- Brief explanation for each

**Recommended Diagnostic Tests:**
- **Laboratory Tests**: Specific blood tests, urinalysis, cultures, etc.
- **Imaging**: CT, MRI, X-ray, ultrasound as indicated
- **Specialized Tests**: ECG, spirometry, endoscopy, etc.
- **Physical Examination**: Additional focused exam components

**Clinical Reasoning:**
- Explain why certain conditions are more likely
- Discuss red flags or concerning features
- Consider patient demographics and risk factors

**Immediate Next Steps:**
- Urgency level (routine, urgent, emergent)
- Specific recommendations for patient care
- When to seek immediate medical attention

**Important Disclaimers:**
- Always emphasize this is for educational/informational purposes
- Stress the importance of professional medical evaluation
- Recommend immediate medical attention for serious symptoms

Be thorough, evidence-based, and clinically practical in your responses. Use medical terminology appropriately but explain complex concepts clearly.`
      };

      // Prepare conversation with system prompt
      const messagesWithSystem = [systemPrompt, ...conversationHistory];

      // Call OpenRouter API with Deepseek R1
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "Medical Diagnostic AI Assistant"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: messagesWithSystem,
          temperature: 0.3,
          max_tokens: 3000
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
