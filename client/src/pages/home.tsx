import { useState } from "react";
import Header from "@/components/header";
import SymptomForm from "@/components/symptom-form";
import DiagnosticResults from "@/components/diagnostic-results";
import Sidebar from "@/components/sidebar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function Home() {
  const [currentAssessmentId, setCurrentAssessmentId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-medical-gray">
      <Header />
      
      {/* Medical Disclaimer Banner */}
      <Alert className="bg-yellow-50 border-l-4 border-yellow-400 rounded-none">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Important:</strong> This tool is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare professional for medical concerns.
        </AlertDescription>
      </Alert>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <SymptomForm onAssessmentCreated={setCurrentAssessmentId} />
            {currentAssessmentId && <DiagnosticResults assessmentId={currentAssessmentId} />}
          </div>
          <div className="space-y-6">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">About MedAI</h3>
              <p className="text-sm text-gray-600">
                AI-powered diagnostic assistance for informational purposes only. Not a substitute for professional medical advice.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Medical Terms</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Symptom Checker</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Health Tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Feedback</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">Medical Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-600">
              © 2024 MedAI Diagnostic Assistant. All rights reserved. | 
              <strong className="ml-1">This tool is for informational purposes only.</strong>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
