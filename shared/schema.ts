import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  primarySymptoms: text("primary_symptoms").notNull(),
  additionalSymptoms: text("additional_symptoms").array().default([]),
  duration: text("duration").notNull(),
  severity: integer("severity").notNull(),
  medicalHistory: text("medical_history"),
  age: integer("age").notNull(),
  gender: text("gender").notNull(),
  aiResponse: jsonb("ai_response"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  primarySymptoms: true,
  additionalSymptoms: true,
  duration: true,
  severity: true,
  medicalHistory: true,
  age: true,
  gender: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export interface DiagnosticResult {
  condition: string;
  probability: number;
  description: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AIResponse {
  possibleConditions: DiagnosticResult[];
  recommendations: string[];
  emergencyWarnings: string[];
}
