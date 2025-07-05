import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";

const medicalTerms = [
  {
    name: "Acute",
    definition: "Sudden onset or short duration of symptoms"
  },
  {
    name: "Chronic",
    definition: "Long-lasting or recurring condition"
  },
  {
    name: "Diagnosis",
    definition: "Identification of a disease or condition"
  },
  {
    name: "Symptom",
    definition: "Physical or mental sign of illness"
  },
  {
    name: "Prognosis",
    definition: "Expected course and outcome of a disease"
  },
  {
    name: "Inflammation",
    definition: "Body's response to injury or infection"
  },
  {
    name: "Benign",
    definition: "Non-cancerous or not harmful"
  },
  {
    name: "Malignant",
    definition: "Cancerous or potentially harmful"
  }
];

export default function MedicalTerms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredTerms = medicalTerms.filter(term =>
    term.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedTerms = showAll ? filteredTerms : filteredTerms.slice(0, 4);

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
          <BookOpen className="text-blue-600 h-5 w-5 mr-2" />
          Medical Terms
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search medical terms..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {displayedTerms.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No terms found</p>
          ) : (
            displayedTerms.map((term) => (
              <div key={term.name} className="cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                <h4 className="text-sm font-medium text-gray-900">{term.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{term.definition}</p>
              </div>
            ))
          )}
        </div>

        {filteredTerms.length > 4 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "Show Less" : "View All Terms"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
