import { users, assessments, type User, type InsertUser, type Assessment, type InsertAssessment, type AIResponse } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, aiResponse: AIResponse): Promise<Assessment | undefined>;
  getUserAssessments(userId?: number): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private currentUserId: number;
  private currentAssessmentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.currentUserId = 1;
    this.currentAssessmentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentAssessmentId++;
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      userId: null,
      aiResponse: null,
      createdAt: new Date(),
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, aiResponse: AIResponse): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;

    const updatedAssessment: Assessment = {
      ...assessment,
      aiResponse,
    };
    this.assessments.set(id, updatedAssessment);
    return updatedAssessment;
  }

  async getUserAssessments(userId?: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(assessment => !userId || assessment.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }
}

export const storage = new MemStorage();
