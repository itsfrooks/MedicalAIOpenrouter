import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Message } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", "/api/messages", {
        content,
        role: "user"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setInputMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !sendMessageMutation.isPending) {
      sendMessageMutation.mutate(inputMessage.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Bot className="text-blue-600 h-8 w-8 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Medical Diagnostic AI Assistant</h1>
            </div>
            <div className="text-sm text-gray-500">
              Deepseek R1 via OpenRouter
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[calc(100vh-200px)] flex flex-col">
          <CardHeader className="border-b border-gray-200">
            <CardTitle className="flex items-center text-lg font-semibold text-gray-900">
              <MessageCircle className="text-blue-600 h-5 w-5 mr-2" />
              Medical Diagnostic Assistant
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Bot className="h-12 w-12 mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Medical Diagnostic AI Assistant</p>
                  <p className="text-sm">Describe your symptoms or medical concerns to get a comprehensive analysis.</p>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg max-w-md text-xs text-blue-800">
                    <p className="font-medium mb-2">What I can help with:</p>
                    <ul className="list-disc list-inside space-y-1 text-left">
                      <li>Symptom analysis and differential diagnosis</li>
                      <li>Recommended blood tests and imaging</li>
                      <li>Clinical reasoning and next steps</li>
                      <li>Risk assessment and urgency levels</li>
                    </ul>
                    <p className="mt-3 text-red-600 font-medium">⚠️ For educational purposes only. Always consult a healthcare professional.</p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        {message.role === "user" ? (
                          <User className="h-4 w-4 mr-2" />
                        ) : (
                          <Bot className="h-4 w-4 mr-2" />
                        )}
                        <span className="text-xs font-medium">
                          {message.role === "user" ? "You" : "Medical AI"}
                        </span>
                      </div>
                      <div 
                        className="whitespace-pre-wrap text-sm"
                        dangerouslySetInnerHTML={{ 
                          __html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2">
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      <span className="text-xs font-medium">Medical AI</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="animate-pulse flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      </div>
                      <span className="ml-2 text-xs text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Describe your symptoms (e.g., fever, headache, chest pain)..."
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
