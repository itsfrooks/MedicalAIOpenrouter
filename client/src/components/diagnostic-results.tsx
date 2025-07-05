import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Assessment, type AIResponse } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Stethoscope, CheckCircle, AlertTriangle, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiagnosticResultsProps {
  assessmentId: number;
}

export default function DiagnosticResults({ assessmentId }: DiagnosticResultsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assessment, isLoading } = useQuery<Assessment>({
    queryKey: ["/api/assessments", assessmentId],
    enabled: !!assessmentId,
  });

  const diagnoseMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/assessments/${assessmentId}/diagnose`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/assessments", assessmentId], data);
      toast({
        title: "Analysis Complete",
        description: "AI diagnostic analysis has been completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: "Failed to get AI analysis. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDiagnose = () => {
    diagnoseMutation.mutate();
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessment) {
    return null;
  }

  const aiResponse = assessment.aiResponse as AIResponse | null;
  const hasResults = aiResponse && aiResponse.possibleConditions.length > 0;

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <Stethoscope className="text-blue-600 h-5 w-5 mr-2" />
          AI Diagnostic Analysis
        </CardTitle>
        <CardDescription>
          Powered by Deepseek R1 via OpenRouter
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {diagnoseMutation.isPending && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Analyzing symptoms...</span>
          </div>
        )}

        {!hasResults && !diagnoseMutation.isPending && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Ready to analyze your symptoms</p>
            <Button onClick={handleDiagnose} className="bg-blue-600 hover:bg-blue-700">
              <Brain className="h-4 w-4 mr-2" />
              Start AI Analysis
            </Button>
          </div>
        )}

        {hasResults && (
          <div className="space-y-6">
            {/* Possible Conditions */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Possible Conditions</h3>
              <div className="space-y-3">
                {aiResponse.possibleConditions.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{result.condition}</h4>
                      <Badge 
                        variant={result.severity === 'high' ? 'destructive' : 
                               result.severity === 'medium' ? 'secondary' : 'default'}
                        className={
                          result.severity === 'high' ? 'bg-red-500' :
                          result.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }
                      >
                        {result.probability}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      <span>{result.recommendation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            {aiResponse.recommendations && aiResponse.recommendations.length > 0 && (
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Recommendations</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <ul className="space-y-2 text-sm text-blue-800">
                    {aiResponse.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="text-blue-600 h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Emergency Warning */}
            {aiResponse.emergencyWarnings && aiResponse.emergencyWarnings.length > 0 && (
              <Alert className="bg-red-50 border-l-4 border-red-400">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription>
                  <h4 className="text-sm font-medium text-red-800 mb-2">When to Seek Immediate Care</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {aiResponse.emergencyWarnings.map((warning, index) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* General Medical Disclaimer */}
            <Alert className="bg-yellow-50 border-l-4 border-yellow-400">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
