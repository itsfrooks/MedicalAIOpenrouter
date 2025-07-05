import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertAssessmentSchema, type InsertAssessment } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ClipboardList, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SymptomFormProps {
  onAssessmentCreated: (assessmentId: number) => void;
}

const commonSymptoms = [
  "Fever", "Headache", "Nausea", "Fatigue", "Dizziness", "Chest Pain",
  "Shortness of breath", "Cough", "Sore throat", "Muscle aches", "Joint pain", "Vomiting"
];

const extendedSchema = insertAssessmentSchema.extend({
  primarySymptoms: insertAssessmentSchema.shape.primarySymptoms.min(10, "Please describe your symptoms in detail"),
  severity: insertAssessmentSchema.shape.severity.min(1).max(10),
  age: insertAssessmentSchema.shape.age.min(1).max(120),
});

export default function SymptomForm({ onAssessmentCreated }: SymptomFormProps) {
  const { toast } = useToast();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severityValue, setSeverityValue] = useState([5]);

  const form = useForm<InsertAssessment>({
    resolver: zodResolver(extendedSchema),
    defaultValues: {
      primarySymptoms: "",
      additionalSymptoms: [],
      duration: "",
      severity: 5,
      medicalHistory: "",
      age: 30,
      gender: "",
    },
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: InsertAssessment) => {
      const response = await apiRequest("POST", "/api/assessments", data);
      return response.json();
    },
    onSuccess: (assessment) => {
      onAssessmentCreated(assessment.id);
      toast({
        title: "Assessment Created",
        description: "Your symptom assessment has been recorded. Processing AI analysis...",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const onSubmit = (data: InsertAssessment) => {
    const submitData = {
      ...data,
      additionalSymptoms: selectedSymptoms,
      severity: severityValue[0],
    };
    createAssessmentMutation.mutate(submitData);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <ClipboardList className="text-blue-600 h-5 w-5 mr-2" />
          Symptom Assessment
        </CardTitle>
        <CardDescription>
          Please provide detailed information about your symptoms
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="primarySymptoms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Primary Symptoms <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your main symptoms in detail..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-24h">Less than 24 hours</SelectItem>
                        <SelectItem value="1-3-days">1-3 days</SelectItem>
                        <SelectItem value="4-7-days">4-7 days</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="more-than-2-weeks">More than 2 weeks</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="severity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Severity (1-10)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={1}
                          max={10}
                          step={1}
                          value={severityValue}
                          onValueChange={(value) => {
                            setSeverityValue(value);
                            field.onChange(value[0]);
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Mild</span>
                          <span>Moderate</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel className="text-sm font-medium text-gray-700 mb-3 block">
                Additional Symptoms
              </FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonSymptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2">
                    <Checkbox
                      id={symptom}
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <label
                      htmlFor={symptom}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="medicalHistory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Medical History</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any relevant medical conditions, medications, or recent treatments..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter age"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={createAssessmentMutation.isPending}
                className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 font-medium"
              >
                {createAssessmentMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Get AI Analysis
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
