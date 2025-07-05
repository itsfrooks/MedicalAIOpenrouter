import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Message } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, Bot, User, Stethoscope, Activity, Heart, Brain, Zap } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-teal-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-2.5 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">MedAssist AI</h1>
                <p className="text-xs text-gray-500">Intelligent Medical Consultation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>AI Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-red-400" />
                <Brain className="h-4 w-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="h-[calc(100vh-160px)] flex flex-col soft-card">
          <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-teal-50">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Medical Consultation</h2>
                  <p className="text-sm text-gray-500 font-normal">AI-Powered Diagnostic Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Activity className="h-3 w-3 text-green-500" />
                <span>Active</span>
              </div>
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
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-4 rounded-2xl mb-6 animate-gentle-bounce">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to MedAssist AI</h3>
                  <p className="text-gray-600 mb-8 text-center max-w-lg">
                    Describe your symptoms and receive comprehensive medical insights powered by advanced AI technology.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
                    <div className="feature-card p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Brain className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Smart Analysis</h4>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Symptom pattern recognition</li>
                        <li>• Differential diagnosis</li>
                        <li>• Risk assessment</li>
                      </ul>
                    </div>
                    
                    <div className="feature-card p-4 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <Activity className="h-5 w-5 text-teal-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Clinical Guidance</h4>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Test recommendations</li>
                        <li>• Treatment suggestions</li>
                        <li>• Next steps guidance</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 max-w-md">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span className="font-medium text-red-700">Important Notice</span>
                    </div>
                    <p className="text-sm text-red-600">
                      This is for educational purposes only. Always consult healthcare professionals for medical advice.
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 ${
                        message.role === "user"
                          ? "chat-bubble-user ml-auto"
                          : "chat-bubble-ai"
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <div className={`p-1.5 rounded-lg mr-2 ${
                          message.role === "user" 
                            ? "bg-white/20" 
                            : "bg-blue-100"
                        }`}>
                          {message.role === "user" ? (
                            <User className="h-3 w-3" />
                          ) : (
                            <Bot className="h-3 w-3 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-medium ${
                              message.role === "user" ? "text-white/90" : "text-gray-700"
                            }`}>
                              {message.role === "user" ? "You" : "MedAssist AI"}
                            </span>
                            <span className={`text-xs ${
                              message.role === "user" ? "text-white/70" : "text-gray-500"
                            }`}>
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`text-sm leading-relaxed ${
                          message.role === "user" ? "text-white" : "text-gray-800"
                        }`}
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
                  <div className="chat-bubble-ai max-w-[80%] rounded-xl px-4 py-3">
                    <div className="flex items-center mb-2">
                      <div className="p-1.5 rounded-lg mr-2 bg-blue-100">
                        <Bot className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-medium text-gray-700">MedAssist AI</span>
                        <div className="text-xs text-gray-500">Analyzing...</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600">Processing your medical inquiry...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe your symptoms (e.g., headache for 3 days, fever 101°F)..."
                    disabled={sendMessageMutation.isPending}
                    className="pl-10 pr-4 py-2.5 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg"
                  />
                  <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="px-4 py-2.5 medical-gradient hover:opacity-90 disabled:opacity-50 rounded-lg transition-all duration-200"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-center mt-3 text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Secure • Educational Use • Not Medical Advice</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
