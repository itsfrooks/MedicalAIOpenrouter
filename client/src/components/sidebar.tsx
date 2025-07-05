import MedicalHistory from "./medical-history";
import MedicalTerms from "./medical-terms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ShieldQuestion, Award } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="space-y-6">
      <MedicalHistory />
      <MedicalTerms />
      
      {/* Data Privacy Notice */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center">
            <Shield className="text-blue-600 h-4 w-4 mr-2" />
            Privacy & Security
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-xs text-gray-600">
            <p className="flex items-center">
              <Lock className="text-green-500 h-3 w-3 mr-2" />
              Your data is encrypted and secure
            </p>
            <p className="flex items-center">
              <ShieldQuestion className="text-green-500 h-3 w-3 mr-2" />
              No personal data is stored permanently
            </p>
            <p className="flex items-center">
              <Award className="text-green-500 h-3 w-3 mr-2" />
              HIPAA compliant processing
            </p>
          </div>
          <Button variant="ghost" className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700">
            Privacy Policy
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
