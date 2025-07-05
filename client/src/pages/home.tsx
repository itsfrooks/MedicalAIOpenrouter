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
    <div className="min-h-screen relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="glass-card relative z-10 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">Medical AI Diagnostic</h1>
                <p className="text-sm text-muted-foreground">Advanced Clinical Analysis System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                <span>Deepseek R1 Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4 text-red-500 animate-pulse" />
                <Brain className="h-4 w-4 text-purple-500 animate-pulse" />
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Card className="h-[calc(100vh-220px)] flex flex-col glass-card glow-effect">
          <CardHeader className="border-b border-border/50 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gradient">Diagnostic Analysis</h2>
                  <p className="text-sm text-muted-foreground font-normal">Powered by Advanced AI</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Online</span>
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-float"></div>
                    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full">
                      <Bot className="h-16 w-16 text-white animate-pulse" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gradient mb-4">Medical AI Assistant</h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                    Advanced diagnostic analysis powered by cutting-edge AI. Describe your symptoms for comprehensive medical insights.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <Brain className="h-8 w-8 text-purple-500" />
                        <h4 className="text-lg font-semibold text-gradient">AI Analysis</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>Symptom pattern recognition</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Differential diagnosis ranking</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span>Risk stratification</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="glass-card p-6 rounded-2xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <Activity className="h-8 w-8 text-cyan-500" />
                        <h4 className="text-lg font-semibold text-gradient">Clinical Support</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span>Diagnostic test recommendations</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span>Imaging protocols</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Urgency assessment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl max-w-2xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span className="font-semibold text-red-400">Medical Disclaimer</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This AI assistant provides educational information only. Always consult qualified healthcare professionals for medical advice, diagnosis, or treatment.
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
                      className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                        message.role === "user"
                          ? "chat-bubble-user"
                          : "chat-bubble-ai"
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-xl mr-3 ${
                          message.role === "user" 
                            ? "bg-white/20" 
                            : "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        }`}>
                          {message.role === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <div>
                          <span className={`text-xs font-semibold ${
                            message.role === "user" ? "text-white/90" : "text-muted-foreground"
                          }`}>
                            {message.role === "user" ? "You" : "Medical AI Assistant"}
                          </span>
                          <div className={`text-xs ${
                            message.role === "user" ? "text-white/70" : "text-muted-foreground"
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div 
                        className={`whitespace-pre-wrap text-sm leading-relaxed ${
                          message.role === "user" ? "text-white" : "text-foreground"
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
                  <div className="chat-bubble-ai max-w-[85%] rounded-2xl px-6 py-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 rounded-xl mr-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                        <Bot className="h-4 w-4 text-blue-500 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-muted-foreground">Medical AI Assistant</span>
                        <div className="text-xs text-muted-foreground">Analyzing...</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Processing diagnostic analysis...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 p-6 bg-gradient-to-r from-blue-600/5 to-purple-600/5">
              <form onSubmit={handleSendMessage} className="flex space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Describe your symptoms in detail (e.g., chest pain, duration, severity)..."
                    disabled={sendMessageMutation.isPending}
                    className="pl-12 pr-4 py-3 text-base border-border/50 bg-background/50 backdrop-blur-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                  />
                  <Stethoscope className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || sendMessageMutation.isPending}
                  className="px-6 py-3 medical-gradient hover:opacity-90 disabled:opacity-50 rounded-xl transition-all duration-200 glow-effect"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
              <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure • HIPAA Compliant • Educational Use Only</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
