
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  BookOpen,
  Camera,
  CheckCircle2,
  TrendingUp,
  Award,
  Loader2,
  Send,
  Volume2,
  BarChart3,
  Target,
  Sparkles,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  XCircle,
  Upload,
  Eye,
} from "lucide-react";

// API Configuration
const API_BASE_URL = "https://artisan-mentor-api-508329185712.us-central1.run.app";

// Types
interface LearningProgress {
  current_module: string;
  current_lesson: string;
  total_points: number;
  max_points: number;
  completion_percent: number;
  completed_lessons: string[];
  streak_days: number;
  last_activity: string;
}

interface BusinessReadiness {
  photography_score: number;
  listing_quality: number;
  marketing_readiness: number;
  export_readiness: number;
}

interface SkillMatrix {
  [key: string]: number;
}

interface Achievement {
  id: string;
  title: string;
  description?: string;
  unlocked_at?: string;
}

interface Recommendation {
  type: string;
  priority: string;
  message: string;
  action?: string;
  estimated_impact?: string;
}

interface DashboardData {
  learning_progress: LearningProgress;
  business_readiness: BusinessReadiness;
  skill_matrix: SkillMatrix;
  achievements: Achievement[];
  recommendations: Recommendation[];
  next_milestones: Array<{
    title: string;
    progress: number;
    status: string;
  }>;
}

interface LessonData {
  lesson_id: string;
  id?: string; // Alternative lesson ID field
  title: string;
  module: string;
  points: number;
  estimated_time: string;
  estimated_completion_time?: string; // Alternative field
  content: string;
  objectives: string[];
  objective?: string; // Single objective field
  task: {
    type: string;
    description: string;
    requirements: string[];
  };
  action_type?: string; // photo_upload, text_input, etc.
  validation_criteria?: string[];
  reward?: string;
  prompt_template?: string;
  multimodal_content?: {
    title: string;
    objective: string;
    instructions: string;
    craft_context?: any;
    media: {
      images: string[];
      audio: string[];
      videos: string[];
    };
  };
  audio_url?: string;
  next_lesson?: string;
}

interface ValidationResult {
  passed: boolean;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

interface SubmissionResponse {
  validation_result: ValidationResult;
  points_earned: number;
  total_points: number;
  achievement_unlocked?: Achievement;
  progress_update: {
    current_lesson: string;
    completion_percent: number;
    streak_days: number;
  };
  next_action: {
    type: string;
    lesson_id?: string;
    title?: string;
  };
}

export function ArtisanMentor() {
  const { toast } = useToast();
  
  // State Management
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [userId, setUserId] = React.useState<string>("");
  const [currentLesson, setCurrentLesson] = React.useState<LessonData | null>(null);
  const [dashboardData, setDashboardData] = React.useState<DashboardData | null>(null);
  const [submissionContent, setSubmissionContent] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [lastSubmissionResult, setLastSubmissionResult] = React.useState<SubmissionResponse | null>(null);
  const [activeTab, setActiveTab] = React.useState("lesson");
  const [isNewUser, setIsNewUser] = React.useState(false);
  
  // Local progress tracking (fallback when backend dashboard fails)
  const [localProgress, setLocalProgress] = React.useState({
    completedLessons: 0,
    totalPoints: 0,
    currentStreak: 0,
  });

  // Initialize user and load data
  React.useEffect(() => {
    // Test API health first
    fetch(`${API_BASE_URL}/health`)
      .then(res => res.json())
      .then(data => {
        console.log("API Health Check:", data);
        initializeUser();
      })
      .catch(err => {
        console.error("API Health Check Failed:", err);
        toast({
          variant: "destructive",
          title: "API Connection Error",
          description: "Cannot connect to Artisan Mentor API. Please check your connection.",
        });
      });
  }, []);

  const initializeUser = async () => {
    try {
      setLoading(true);
      
      // Generate or retrieve user ID (in production, use Firebase Auth)
      let currentUserId = localStorage.getItem("artisan_mentor_user_id");
      
      // Load local progress from localStorage
      if (currentUserId) {
        const progressKey = `artisan_progress_${currentUserId}`;
        const storedProgress = localStorage.getItem(progressKey);
        if (storedProgress) {
          try {
            const progress = JSON.parse(storedProgress);
            setLocalProgress({
              completedLessons: progress.completedLessons || 0,
              totalPoints: progress.totalPoints || 0,
              currentStreak: progress.currentStreak || 0,
            });
            console.log("📊 Loaded local progress:", progress);
          } catch (e) {
            console.warn("Failed to parse stored progress:", e);
          }
        }
      }
      
      if (!currentUserId) {
        // New user - create profile
        currentUserId = `artisan_${Date.now()}`;
        localStorage.setItem("artisan_mentor_user_id", currentUserId);
        setIsNewUser(true);
        
        console.log("Creating new user:", currentUserId);
        
        // Start learning journey
        const response = await fetch(`${API_BASE_URL}/start-journey`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: currentUserId,
            name: "Artisan User",
            phone: "+91 0000000000",
            craft_type: "pottery",
            language: "en",
          }),
        });

        const responseText = await response.text();
        console.log("Start journey response:", responseText);

        const data = JSON.parse(responseText);
        
        if (data.status !== "success") {
          throw new Error(data.message || "Failed to start journey");
        }
        
        console.log("Journey started successfully:", data);
        
        toast({
          title: "🎉 Welcome to Artisan Mentor!",
          description: "Your learning journey has begun. Loading your first lesson...",
        });
        
        // CRITICAL: Wait for Firestore write to complete (3 seconds)
        console.log("⏳ Waiting for database sync...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log("✅ Database synced, loading lesson...");
        
      } else {
        console.log("Returning user:", currentUserId);
      }

      setUserId(currentUserId);
      await loadCurrentLesson(currentUserId);
      
      // Load dashboard data in background
      loadDashboard().catch(err => console.warn("Dashboard load failed:", err));
      
    } catch (error) {
      console.error("Initialization error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize. Please refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentLesson = async (uid: string) => {
    try {
      let currentLessonId = "F1.1"; // Default to first lesson
      
      // FIRST: Check localStorage for last lesson (most recent state)
      const progressKey = `artisan_progress_${uid}`;
      const storedProgress = localStorage.getItem(progressKey);
      if (storedProgress) {
        try {
          const progress = JSON.parse(storedProgress);
          if (progress.currentLesson) {
            currentLessonId = progress.currentLesson;
            console.log("📖 Restored current lesson from localStorage:", currentLessonId);
          } else if (progress.lastCompleted) {
            // If we have lastCompleted but no currentLesson, advance to next
            const nextLessonMap: { [key: string]: string } = {
              "F1.1": "F1.2",
              "F1.2": "F1.3",
              "F1.3": "F2.1",
              "F2.1": "F2.2",
              "F2.2": "F2.3",
              "F2.3": "F3.1",
            };
            currentLessonId = nextLessonMap[progress.lastCompleted] || progress.lastCompleted;
            console.log("📖 Calculated next lesson from lastCompleted:", currentLessonId);
          }
        } catch (e) {
          console.warn("Failed to parse stored progress:", e);
        }
      }
      
      // THEN: Try to get dashboard to know current lesson (fallback/sync)
      try {
        const dashResponse = await fetch(`${API_BASE_URL}/dashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_id: uid }),
        });

        if (dashResponse.ok) {
          const dashData = await dashResponse.json();
          console.log("Dashboard full response:", JSON.stringify(dashData, null, 2));
          
          // Handle different response structures
          let dashboard = null;
          if (dashData.status === "success" && dashData.data) {
            dashboard = dashData.data;
          } else if (dashData.dashboard) {
            dashboard = dashData.dashboard;
          } else if (dashData.learning_progress) {
            dashboard = dashData;
          }
          
          console.log("Parsed dashboard:", dashboard);
          if (dashboard) {
            setDashboardData(dashboard);
            // Only override if dashboard has a current_lesson and localStorage didn't have currentLesson
            if (dashboard?.learning_progress?.current_lesson && !storedProgress) {
              currentLessonId = dashboard.learning_progress.current_lesson;
              console.log("📊 Using lesson from dashboard:", currentLessonId);
            }
          }
        } else {
          const errorText = await dashResponse.text();
          console.warn("Dashboard API error (continuing with stored/default):", errorText);
        }
      } catch (dashError) {
        console.warn("Failed to load dashboard (continuing with stored/default):", dashError);
      }

      console.log("Loading lesson:", currentLessonId, "for user:", uid);

      // Get lesson content with retry logic (for new users waiting for Firestore sync)
      let lessonData = null;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount <= maxRetries) {
        try {
          console.log(`📥 Attempt ${retryCount + 1}/${maxRetries + 1} - Fetching lesson...`);
          
          const lessonResponse = await fetch(`${API_BASE_URL}/get-lesson`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: uid,
              lesson_id: currentLessonId,
            }),
          });

          const lessonResponseText = await lessonResponse.text();
          console.log("Lesson raw response:", lessonResponseText);

          if (!lessonResponse.ok) {
            console.error("Lesson API HTTP error:", lessonResponse.status, lessonResponseText);
            throw new Error(`Failed to load lesson: HTTP ${lessonResponse.status}`);
          }
          
          try {
            lessonData = JSON.parse(lessonResponseText);
          } catch (parseError) {
            console.error("Failed to parse lesson response:", parseError);
            throw new Error("API returned invalid JSON");
          }
          
          console.log("Lesson parsed JSON:", JSON.stringify(lessonData, null, 2));
          
          // Check for API error responses
          if (lessonData.status === "error") {
            console.warn(`⚠️ API error (attempt ${retryCount + 1}):`, lessonData.message);
            
            // If "User not found", retry after delay
            if (lessonData.message && lessonData.message.includes("not found")) {
              if (retryCount < maxRetries) {
                const delay = (retryCount + 1) * 2000; // 2s, 4s, 6s
                console.log(`⏳ Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                retryCount++;
                continue;
              }
            }
            throw new Error(lessonData.message || "Failed to load lesson");
          }
          
          // Check if we got valid data
          if (lessonData && Object.keys(lessonData).length > 0) {
            console.log("✅ Valid response received");
            break; // Success!
          } else {
            console.warn("⚠️ Empty response, retrying...");
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 2000));
              retryCount++;
              continue;
            }
          }
          
        } catch (fetchError) {
          console.error(`❌ Fetch error (attempt ${retryCount + 1}):`, fetchError);
          if (retryCount >= maxRetries) {
            throw fetchError;
          }
          await new Promise(resolve => setTimeout(resolve, 2000));
          retryCount++;
        }
      }
      
      if (!lessonData || Object.keys(lessonData).length === 0) {
        throw new Error("Failed to load lesson after multiple retries. Please refresh the page.");
      }
      
      // Handle different response structures
      let lesson = null;
      if (lessonData.status === "success" && lessonData.lesson) {
        lesson = lessonData.lesson;
      } else if (lessonData.status === "success" && lessonData.data) {
        lesson = lessonData.data;
      } else if (lessonData.lesson) {
        lesson = lessonData.lesson;
      } else if (lessonData.lesson_id || lessonData.id) {
        lesson = lessonData;
      }
      
      console.log("📚 Parsed lesson:", lesson);
      
      if (!lesson) {
        console.error("Invalid lesson data structure:", lessonData);
        throw new Error("Lesson data is missing or incomplete. Please try again.");
      }
      
      // Validate lesson has required fields (title and either content or multimodal_content)
      if (!lesson.title) {
        console.error("Lesson missing title:", lesson);
        throw new Error("Lesson data is incomplete (no title).");
      }
      
      console.log("✅ Lesson loaded successfully:", lesson.title);
      setCurrentLesson(lesson);
      
    } catch (error) {
      console.error("Load lesson error:", error);
      toast({
        variant: "destructive",
        title: "Failed to Load Lesson",
        description: error instanceof Error ? error.message : "Failed to load lesson content. Check console for details.",
      });
    }
  };

  const handleSubmitWork = async () => {
    if (!currentLesson || !userId) return;

    // Determine submission type based on action_type or legacy task.type
    const submissionType = currentLesson.action_type === "photo_upload" ? "photo" 
                          : currentLesson.action_type === "text_input" ? "text"
                          : currentLesson.task?.type || "text";

    // Validate submission
    if (submissionType === "text" && !submissionContent.trim()) {
      toast({
        variant: "destructive",
        title: "Empty Submission",
        description: "Please enter your work before submitting.",
      });
      return;
    }

    if (submissionType === "photo" && !selectedFile) {
      toast({
        variant: "destructive",
        title: "No File Selected",
        description: "Please select an image file to submit.",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Prepare submission object
      let submissionData: any = {
        content: submissionContent || "",
      };

      // For image submissions, in production upload to storage first
      if (submissionType === "photo" && selectedFile) {
        // Simulate image upload (in production, upload to Cloud Storage)
        const imageUrl = `image_${Date.now()}_${selectedFile.name}`;
        submissionData.content = imageUrl;
        submissionData.metadata = {
          filename: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
        };
      }

      // Get lesson ID from currentLesson (could be 'id' or 'lesson_id')
      const lessonId = currentLesson.id || currentLesson.lesson_id || "F1.1";

      console.log("📤 Submitting work:", { 
        user_id: userId, 
        lesson_id: lessonId, 
        submission_type: submissionType,
        submission: submissionData 
      });

      const response = await fetch(`${API_BASE_URL}/submit-work`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: lessonId,
          submission_type: submissionType,
          submission: submissionData,
        }),
      });

      const responseText = await response.text();
      console.log("📥 Submission response:", responseText);

      if (!response.ok) {
        console.error("Submission API error:", responseText);
        throw new Error(`Submission failed: ${response.status}`);
      }

      const result = JSON.parse(responseText);
      console.log("✅ Submission result:", JSON.stringify(result, null, 2));
      
      // Store the result for display
      setLastSubmissionResult(result);

      // Show success or feedback based on passed status
      if (result.passed) {
        // Update local progress tracking
        const pointsEarned = currentLesson?.points || 25;
        setLocalProgress(prev => ({
          completedLessons: prev.completedLessons + 1,
          totalPoints: prev.totalPoints + pointsEarned,
          currentStreak: prev.currentStreak + 1,
        }));
        
        // Store in localStorage for persistence
        const progressKey = `artisan_progress_${userId}`;
        
        // Determine next lesson
        const nextLessonMap: { [key: string]: string } = {
          "F1.1": "F1.2",
          "F1.2": "F1.3",
          "F1.3": "F2.1",
          "F2.1": "F2.2",
          "F2.2": "F2.3",
          "F2.3": "F3.1",
        };
        const currentId = currentLesson?.id || currentLesson?.lesson_id || "F1.1";
        const nextLessonId = nextLessonMap[currentId];
        
        const storedProgress = {
          completedLessons: localProgress.completedLessons + 1,
          totalPoints: localProgress.totalPoints + pointsEarned,
          currentStreak: localProgress.currentStreak + 1,
          lastCompleted: currentId,
          currentLesson: nextLessonId || currentId, // Save the next lesson as current
          lastActivity: new Date().toISOString(),
        };
        localStorage.setItem(progressKey, JSON.stringify(storedProgress));
        
        toast({
          title: `🎉 Lesson Complete! +${pointsEarned} Points`,
          description: result.feedback || "Great work! Moving to next lesson...",
        });

        // Auto-advance to next lesson after 3 seconds
        setTimeout(async () => {
          console.log("🔄 Advancing to next lesson...");
          
          // Define lesson progression (F1.1 → F1.2 → F1.3 → F2.1, etc.)
          const nextLessonMap: { [key: string]: string } = {
            "F1.1": "F1.2",
            "F1.2": "F1.3",
            "F1.3": "F2.1",
            "F2.1": "F2.2",
            "F2.2": "F2.3",
            "F2.3": "F3.1",
            // Add more as needed
          };
          
          const currentId = currentLesson?.id || currentLesson?.lesson_id || "F1.1";
          const nextLessonId = nextLessonMap[currentId];
          
          if (nextLessonId) {
            console.log(`📚 Loading next lesson: ${nextLessonId}`);
            await loadNextLesson(nextLessonId);
          } else {
            console.log("✅ All lessons completed!");
            toast({
              title: "🏆 Congratulations!",
              description: "You've completed all available lessons!",
            });
          }
          
          // Try to reload dashboard (but don't block on failure)
          loadDashboard().catch(err => console.warn("Dashboard load failed:", err));
        }, 3000);
      } else {
        toast({
          title: "📝 Keep Improving",
          description: result.feedback || "Review the feedback and try again.",
          variant: "default",
        });
      }

      // Clear submission
      setSubmissionContent("");
      setSelectedFile(null);
      
    } catch (error) {
      console.error("❌ Submit error:", error);
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: error instanceof Error ? error.message : "Failed to submit your work. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const loadNextLesson = async (lessonId: string) => {
    try {
      setLoading(true);
      setLastSubmissionResult(null);
      
      const response = await fetch(`${API_BASE_URL}/get-lesson`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          lesson_id: lessonId,
        }),
      });

      if (!response.ok) throw new Error("Failed to load next lesson");
      
      const data = await response.json();
      console.log("Next lesson response:", data);
      
      // Handle different response structures
      const lesson = data.lesson || data.data || data;
      setCurrentLesson(lesson);
      setActiveTab("lesson");
      
      // Save current lesson to localStorage for page reload persistence
      if (userId) {
        const progressKey = `artisan_progress_${userId}`;
        const storedProgress = localStorage.getItem(progressKey);
        let progress = storedProgress ? JSON.parse(storedProgress) : {};
        progress.currentLesson = lessonId;
        progress.lastActivity = new Date().toISOString();
        localStorage.setItem(progressKey, JSON.stringify(progress));
        console.log("💾 Saved current lesson to localStorage:", lessonId);
      }
      
      // Refresh dashboard
      await loadDashboard();
      
    } catch (error) {
      console.error("Load next lesson error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load next lesson.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      console.log("📊 Loading dashboard for user:", userId);
      const response = await fetch(`${API_BASE_URL}/dashboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });

      const data = await response.json();
      console.log("📊 Dashboard response:", data);
      
      // Check for API errors
      if (data.status === "error") {
        console.warn("⚠️ Dashboard API error:", data.message);
        toast({
          title: "Dashboard Unavailable",
          description: "Dashboard data is currently unavailable. Your progress is still being tracked.",
          variant: "default",
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }
      
      // Handle different response structures
      const dashboard = data.dashboard || data.data || data;
      
      if (dashboard && Object.keys(dashboard).length > 0) {
        setDashboardData(dashboard);
        console.log("✅ Dashboard loaded successfully");
      } else {
        console.warn("⚠️ Dashboard returned empty data");
      }
      
    } catch (error) {
      console.error("❌ Load dashboard error:", error);
      toast({
        title: "Dashboard Error",
        description: "Unable to load dashboard. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const playAudio = () => {
    if (currentLesson?.audio_url) {
      const audio = new Audio(currentLesson.audio_url);
      audio.play();
      toast({
        title: "🔊 Playing Audio",
        description: "Listen to your lesson content",
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid File",
          description: "Please select an image file.",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File Too Large",
          description: "Please select an image under 5MB.",
        });
        return;
      }

      setSelectedFile(file);
    }
  };

  if (loading && !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar - Always Visible */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Your Learning Progress</CardTitle>
              <CardDescription>
                {localProgress.completedLessons} lessons completed · {localProgress.totalPoints} points earned
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{localProgress.totalPoints}</div>
                <div className="text-xs text-muted-foreground">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{localProgress.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">
                {dashboardData?.learning_progress?.completion_percent?.toFixed(1) || 
                 Math.min(100, (localProgress.completedLessons / 12) * 100).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={dashboardData?.learning_progress?.completion_percent || 
                     Math.min(100, (localProgress.completedLessons / 12) * 100)} 
              className="h-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Keep going! Complete lessons to unlock new skills and grow your artisan business.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Header Stats - Using localStorage for consistent display */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.min(100, (localProgress.completedLessons / 12) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {localProgress.completedLessons}/12 lessons
            </p>
            <Progress 
              value={Math.min(100, (localProgress.completedLessons / 12) * 100)} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localProgress.totalPoints}
            </div>
            <p className="text-xs text-muted-foreground">
              of 585 points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {localProgress.currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">days active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.achievements?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">badges unlocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        setActiveTab(value);
        // Load/reload dashboard data when switching to dashboard tab
        if (value === "dashboard" && userId) {
          console.log("📊 Loading dashboard data...");
          loadDashboard();
        }
      }} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lesson">
            <BookOpen className="h-4 w-4 mr-2" />
            Current Lesson
          </TabsTrigger>
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            My Dashboard
          </TabsTrigger>
        </TabsList>

        {/* Lesson Tab */}
        <TabsContent value="lesson" className="space-y-6">
          {!currentLesson ? (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                  <div>
                    <p className="text-lg font-semibold">Loading your lesson...</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Fetching personalized content from AI
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => userId && loadCurrentLesson(userId)}
                  >
                    Retry Loading
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Lesson Header */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary">{currentLesson.module}</Badge>
                      <CardTitle className="text-2xl font-headline">
                        {currentLesson.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 text-base">
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {currentLesson.points} points
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentLesson.estimated_time}
                        </span>
                      </CardDescription>
                    </div>
                    {currentLesson.audio_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={playAudio}
                        className="gap-2"
                      >
                        <Volume2 className="h-4 w-4" />
                        Listen
                      </Button>
                    )}
                  </div>
                </CardHeader>
              </Card>

              {/* Lesson Content */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Lesson Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Objective */}
                  {currentLesson.objective && (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Objective:
                        </h3>
                        <p className="text-muted-foreground pl-6">{currentLesson.objective}</p>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Instructions from multimodal_content or prompt_template */}
                  {(currentLesson.multimodal_content?.instructions || currentLesson.prompt_template) && (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">Instructions:</h3>
                        <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
                          <div dangerouslySetInnerHTML={{ 
                            __html: (currentLesson.multimodal_content?.instructions || currentLesson.prompt_template || '').replace(/\n/g, '<br />') 
                          }} />
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Legacy content field support */}
                  {currentLesson.content && (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content.replace(/\n/g, '<br />') }} />
                    </div>
                  )}
                  
                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {currentLesson.estimated_completion_time && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {currentLesson.estimated_completion_time}
                      </div>
                    )}
                    {currentLesson.points && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Award className="h-4 w-4" />
                        {currentLesson.points} points
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Task Submission - Always show for lessons with action_type */}
              {(currentLesson.action_type || currentLesson.task) && (
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Your Task
                    </CardTitle>
                    {currentLesson.objective && (
                      <CardDescription>{currentLesson.objective}</CardDescription>
                    )}
                    {currentLesson.task?.description && (
                      <CardDescription>{currentLesson.task.description}</CardDescription>
                    )}
                  </CardHeader>
                <CardContent className="space-y-4">
                  {/* Task Type Badge */}
                  {currentLesson.action_type && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {currentLesson.action_type.replace('_', ' ')}
                      </Badge>
                      {currentLesson.reward && (
                        <Badge variant="secondary">
                          {currentLesson.reward}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Validation Criteria */}
                  {currentLesson.validation_criteria && Array.isArray(currentLesson.validation_criteria) && currentLesson.validation_criteria.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Evaluation Criteria:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {currentLesson.validation_criteria.map((criteria, idx) => (
                          <li key={idx} className="capitalize">{criteria.replace('_', ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Legacy task requirements */}
                  {currentLesson.task?.requirements && Array.isArray(currentLesson.task.requirements) && currentLesson.task.requirements.length > 0 && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {currentLesson.task.requirements.map((req, idx) => (
                          <li key={idx}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Input Field Based on Action Type */}
                  {/* Show photo upload only if explicitly photo_upload */}
                  {(currentLesson.action_type === "photo_upload" || currentLesson.task?.type === "image") && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload Photos:</label>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="flex-1"
                          multiple={currentLesson.action_type === "photo_upload"}
                        />
                        {selectedFile && (
                          <Badge variant="secondary" className="gap-2">
                            <CheckCircle2 className="h-3 w-3" />
                            {selectedFile.name}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supported: JPG, PNG, WebP (max 5MB per file)
                      </p>
                    </div>
                  )}

                  {/* Show text input for all other action types (text_input, text_submission, or any other) */}
                  {currentLesson.action_type !== "photo_upload" && currentLesson.task?.type !== "image" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Submission:</label>
                      <Textarea
                        placeholder="Enter your work here..."
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        {submissionContent.length} characters
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmitWork}
                    disabled={submitting}
                    size="lg"
                    className="w-full gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit for Validation
                      </>
                    )}
                  </Button>
                </CardContent>
                </Card>
              )}

              {/* Validation Result */}
              {lastSubmissionResult && (
                <Card className={lastSubmissionResult.passed ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {lastSubmissionResult.passed ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                          Passed! Great Work!
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-amber-500" />
                          Needs Improvement
                        </>
                      )}
                    </CardTitle>
                    {lastSubmissionResult.score && (
                      <CardDescription>
                        Score: {lastSubmissionResult.score}/100
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Feedback */}
                    {lastSubmissionResult.feedback && (
                      <Alert>
                        <AlertTitle>AI Feedback</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">
                          {lastSubmissionResult.feedback}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Retry Guidance */}
                    {lastSubmissionResult.retry_guidance && !lastSubmissionResult.passed && (
                      <Alert variant="default">
                        <AlertTitle>💡 How to Improve</AlertTitle>
                        <AlertDescription>
                          {lastSubmissionResult.retry_guidance}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Improvement Suggestions */}
                    {lastSubmissionResult.improvement_suggestions && 
                     Array.isArray(lastSubmissionResult.improvement_suggestions) && 
                     lastSubmissionResult.improvement_suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
                          💡 Suggestions for Improvement:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {lastSubmissionResult.improvement_suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Legacy: Strengths (from old API format) */}
                    {lastSubmissionResult.validation_result?.strengths && 
                     Array.isArray(lastSubmissionResult.validation_result.strengths) && 
                     lastSubmissionResult.validation_result.strengths.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
                          ✅ Strengths:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {lastSubmissionResult.validation_result.strengths.map((s, idx) => (
                            <li key={idx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Legacy: Improvements (from old API format) */}
                    {lastSubmissionResult.validation_result?.improvements && 
                     Array.isArray(lastSubmissionResult.validation_result.improvements) && 
                     lastSubmissionResult.validation_result.improvements.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
                          💡 Areas for Improvement:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {lastSubmissionResult.validation_result.improvements.map((i, idx) => (
                            <li key={idx}>{i}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Achievement */}
                    {lastSubmissionResult.achievement_unlocked && (
                      <Alert className="border-yellow-500/50 bg-yellow-500/10">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <AlertTitle>🏆 Achievement Unlocked!</AlertTitle>
                        <AlertDescription>
                          {lastSubmissionResult.achievement_unlocked.title}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Next Action */}
                    {lastSubmissionResult.next_action?.lesson_id && lastSubmissionResult.passed && (
                      <Button
                        onClick={() => loadNextLesson(lastSubmissionResult.next_action.lesson_id!)}
                        size="lg"
                        className="w-full gap-2"
                      >
                        Continue to Next Lesson
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Always show content - either backend data or local progress */}
          <>
            {/* Show local progress card - always visible as fallback */}
            <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-amber-500/10 p-3">
                      <BarChart3 className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                        📊 {localProgress.completedLessons === 0 ? 'Start Your Journey' : 'Viewing Local Progress'}
                      </h3>
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        {localProgress.completedLessons === 0 
                          ? 'Your personalized dashboard will populate as you complete lessons. Start your first lesson to begin tracking your progress!'
                          : 'Your dashboard is loading. Showing your latest progress saved locally. Advanced analytics will appear once synced.'}
                      </p>
                      <div className="grid gap-3 md:grid-cols-3 mt-4">
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                          <div className="text-2xl font-bold text-primary">{localProgress.completedLessons}</div>
                          <div className="text-xs text-muted-foreground">Lessons Completed</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                          <div className="text-2xl font-bold text-primary">{localProgress.totalPoints}</div>
                          <div className="text-xs text-muted-foreground">Points Earned</div>
                        </div>
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                          <div className="text-2xl font-bold text-primary">{localProgress.currentStreak}</div>
                          <div className="text-xs text-muted-foreground">Day Streak</div>
                        </div>
                      </div>
                      <Button onClick={() => {
                        console.log("🔄 Manually refreshing dashboard...");
                        loadDashboard();
                      }} variant="outline" className="mt-4 border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30" size="sm">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {localProgress.completedLessons === 0 ? 'Try Loading Dashboard' : 'Load Full Dashboard'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

            {/* Business Readiness */}
              {dashboardData?.business_readiness && Object.keys(dashboardData.business_readiness).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Business Readiness
                    </CardTitle>
                    <CardDescription>
                      Your readiness across key business areas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(dashboardData.business_readiness).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="text-sm font-bold">{value}/100</span>
                        </div>
                        <Progress value={value} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Skill Matrix */}
              {dashboardData?.skill_matrix && Object.keys(dashboardData.skill_matrix).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Skill Proficiency Matrix
                    </CardTitle>
                    <CardDescription>
                      Your proficiency across 10 business skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      {Object.entries(dashboardData.skill_matrix).map(([skill, proficiency]) => (
                        <div key={skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm capitalize">
                              {skill.replace(/_/g, " ")}
                            </span>
                            <Badge variant={proficiency >= 70 ? "default" : "secondary"}>
                              {proficiency}%
                            </Badge>
                          </div>
                          <Progress value={proficiency} />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Achievements */}
              {dashboardData?.achievements && Array.isArray(dashboardData.achievements) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Achievements Unlocked
                    </CardTitle>
                    <CardDescription>
                      {dashboardData.achievements.length} badges earned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-3">
                      {dashboardData.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                        >
                          <Trophy className="h-8 w-8 text-yellow-500" />
                          <div>
                            <p className="font-semibold text-sm">{achievement.title}</p>
                            {achievement.description && (
                              <p className="text-xs text-muted-foreground">
                                {achievement.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {dashboardData.achievements.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        Complete lessons to unlock achievements!
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {dashboardData?.recommendations && Array.isArray(dashboardData.recommendations) && dashboardData.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions to accelerate your growth
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dashboardData.recommendations.map((rec, idx) => (
                      <Alert key={idx} className={
                        rec.priority === "high" ? "border-red-500/50" :
                        rec.priority === "medium" ? "border-yellow-500/50" :
                        "border-blue-500/50"
                      }>
                        <AlertTitle className="flex items-center gap-2">
                          <Badge variant={rec.priority === "high" ? "destructive" : "secondary"}>
                            {rec.priority}
                          </Badge>
                          {rec.type.replace(/_/g, " ").toUpperCase()}
                        </AlertTitle>
                        <AlertDescription className="space-y-2">
                          <p>{rec.message}</p>
                          {rec.estimated_impact && (
                            <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                              💰 {rec.estimated_impact}
                            </p>
                          )}
                          {rec.action && (
                            <Button size="sm" variant="outline" className="mt-2">
                              {rec.action}
                            </Button>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Milestones */}
              {dashboardData?.next_milestones && Array.isArray(dashboardData.next_milestones) && dashboardData.next_milestones.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      Learning Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {dashboardData.next_milestones.map((milestone, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{milestone.title}</span>
                          <Badge variant={milestone.status === "completed" ? "default" : "secondary"}>
                            {milestone.status}
                          </Badge>
                        </div>
                        <Progress value={milestone.progress} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
          </>
        </TabsContent>
      </Tabs>
    </div>
  );
}
