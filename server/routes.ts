import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, type AIResponse, type DiagnosticResult } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error) {
      res.status(400).json({ error: "Invalid assessment data" });
    }
  });

  // Get AI diagnosis
  app.post("/api/assessments/:id/diagnose", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }

      // Get OpenRouter API key from environment
      const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey) {
        return res.status(500).json({ error: "OpenRouter API key not configured" });
      }

      // Prepare prompt for Deepseek R1
      const prompt = `You are a medical AI assistant providing diagnostic suggestions for informational purposes only. 

Patient Information:
- Age: ${assessment.age}
- Gender: ${assessment.gender}
- Primary Symptoms: ${assessment.primarySymptoms}
- Additional Symptoms: ${assessment.additionalSymptoms?.join(', ') || 'None'}
- Duration: ${assessment.duration}
- Severity (1-10): ${assessment.severity}
- Medical History: ${assessment.medicalHistory || 'None provided'}

Please provide a structured analysis in the following JSON format:
{
  "possibleConditions": [
    {
      "condition": "condition name",
      "probability": number (0-100),
      "description": "brief description",
      "recommendation": "brief recommendation",
      "severity": "low|medium|high"
    }
  ],
  "recommendations": [
    "general care recommendations"
  ],
  "emergencyWarnings": [
    "when to seek immediate care"
  ]
}

Focus on common conditions that match the symptoms. Always emphasize the need for professional medical consultation.`;

      // Call OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.REPLIT_DOMAINS?.split(',')[0] || "http://localhost:5000",
          "X-Title": "MedAI Diagnostic Assistant"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [
            {
              role: "system",
              content: "You are a medical AI assistant. Provide diagnostic suggestions for informational purposes only. Always emphasize that this is not a substitute for professional medical advice."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("OpenRouter API error:", errorData);
        return res.status(500).json({ error: "Failed to get AI diagnosis" });
      }

      const aiResponse = await response.json();
      let aiResult: AIResponse;

      try {
        // Try to parse the AI response as JSON
        const content = aiResponse.choices[0].message.content;
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}') + 1;
        const jsonContent = content.substring(jsonStart, jsonEnd);
        
        aiResult = JSON.parse(jsonContent);
      } catch (parseError) {
        // Fallback if JSON parsing fails
        aiResult = {
          possibleConditions: [
            {
              condition: "Analysis Available",
              probability: 50,
              description: "The AI provided analysis but in an unexpected format. Please consult a healthcare professional for proper evaluation.",
              recommendation: "Seek professional medical advice",
              severity: "medium"
            }
          ],
          recommendations: [
            "Consult with a healthcare professional",
            "Monitor symptoms closely",
            "Seek immediate care if symptoms worsen"
          ],
          emergencyWarnings: [
            "Seek immediate medical attention if you experience severe symptoms",
            "Call emergency services for life-threatening conditions"
          ]
        };
      }

      // Update assessment with AI response
      const updatedAssessment = await storage.updateAssessment(assessmentId, aiResult);
      
      res.json(updatedAssessment);
    } catch (error) {
      console.error("Diagnosis error:", error);
      res.status(500).json({ error: "Failed to process diagnosis" });
    }
  });

  // Get recent assessments
  app.get("/api/assessments", async (req, res) => {
    try {
      const assessments = await storage.getUserAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessments" });
    }
  });

  // Get single assessment
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const assessmentId = parseInt(req.params.id);
      const assessment = await storage.getAssessment(assessmentId);
      
      if (!assessment) {
        return res.status(404).json({ error: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assessment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
