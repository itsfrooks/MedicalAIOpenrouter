import { useQuery } from "@tanstack/react-query";
import { type Assessment } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function MedicalHistory() {
  const { data: assessments = [], isLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const recentAssessments = assessments.slice(0, 5);

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <History className="text-blue-600 h-5 w-5 mr-2" />
          Recent Assessments
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-l-4 border-gray-200 pl-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-28"></div>
              </div>
            ))}
          </div>
        ) : recentAssessments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No assessments yet</p>
            <p className="text-sm">Your assessment history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentAssessments.map((assessment) => (
              <div key={assessment.id} className="border-l-4 border-blue-600 pl-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">
                      {formatDistanceToNow(new Date(assessment.createdAt))} ago
                    </p>
                  </div>
                  <Badge variant={assessment.aiResponse ? "default" : "secondary"}>
                    {assessment.aiResponse ? "Analyzed" : "Pending"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {assessment.primarySymptoms.length > 50 
                    ? `${assessment.primarySymptoms.substring(0, 50)}...`
                    : assessment.primarySymptoms}
                </p>
                {assessment.aiResponse && (
                  <p className="text-xs text-blue-600 mt-1">
                    {(assessment.aiResponse as any).possibleConditions?.[0]?.condition || "Analysis complete"}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        
        {recentAssessments.length > 0 && (
          <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700">
            View All History
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
