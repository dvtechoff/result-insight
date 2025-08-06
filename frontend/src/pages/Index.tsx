
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, GraduationCap, Award, BookOpen, TrendingUp, AlertCircle, Star, Trophy, Target, Calendar, Clock, User, Mail, Hash, Building2, Users, CheckCircle2, XCircle, BarChart3, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


const Index = () => {
  const [rollNumber, setRollNumber] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!rollNumber.trim()) {
      setError("Please enter a valid roll number");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:3001/api/result?rollNo=${rollNumber}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Unknown error");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch result");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeColor = (sgpa: number) => {
    if (sgpa >= 8) return "status-excellent";
    if (sgpa >= 6) return "status-good";
    if (sgpa >= 4) return "status-average";
    return "status-poor";
  };

  const getSubjectGrade = (internal: string, external: string) => {
    const internalNum = parseInt(internal) || 0;
    const externalNum = parseInt(external) || 0;
    const total = internalNum + externalNum;
    
    if (total >= 80) return { grade: "A+", color: "status-excellent" };
    if (total >= 70) return { grade: "A", color: "status-good" };
    if (total >= 60) return { grade: "B+", color: "status-good" };
    if (total >= 50) return { grade: "B", color: "status-average" };
    if (total >= 40) return { grade: "C", color: "status-average" };
    return { grade: "F", color: "status-poor" };
  };

  const getPerformanceStats = () => {
    if (!result) return null;
    const sgpaValues = Object.values(result.SGPA).map(Number);
    const averageSGPA = sgpaValues.reduce((a, b) => a + b, 0) / sgpaValues.length;
    const totalSubjects = result.Subjects.length;
    const passedSubjects = result.Subjects.filter(subject => {
      const total = (parseInt(subject.internal) || 0) + (parseInt(subject.external) || 0);
      return total >= 40;
    }).length;
    
    return {
      averageSGPA: averageSGPA.toFixed(2),
      totalSubjects,
      passedSubjects,
      failedSubjects: totalSubjects - passedSubjects,
      passPercentage: ((passedSubjects / totalSubjects) * 100).toFixed(1)
    };
  };

  const performanceStats = getPerformanceStats();

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <div className="relative bg-white shadow-lg border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-primary">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">Student Result Portal</h1>
                <p className="text-muted-foreground mt-1 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Check your academic results instantly
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <Trophy className="h-8 w-8 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Excellence</p>
              </div>
              <div className="text-center">
                <Target className="h-8 w-8 text-accent mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Achievement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="relative">
          <Card className="mb-8 border bg-white">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Search className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl text-primary">Enter Your Roll Number</CardTitle>
              </div>
              <p className="text-muted-foreground flex items-center justify-center gap-2">
                <Hash className="h-4 w-4" />
                Get your latest academic results instantly
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-lg mx-auto">
                <Label htmlFor="rollNumber" className="text-sm font-semibold flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" />
                  Roll Number
                </Label>
                <div className="flex gap-3 mt-2">
                  <Input
                    id="rollNumber"
                    placeholder="e.g., 2300320100074"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="flex-1 h-12 text-lg border-2 focus:border-primary/50 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button 
                    onClick={handleSearch} 
                    disabled={isLoading}
                    className="h-12 px-8 bg-primary text-white font-semibold"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        <span>Search</span>
                      </div>
                    )}
                  </Button>
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm mt-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                  </div>
                )}
              </div>
              
              {/* Quick Stats Preview */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4 border-t border-border/20">
                <div className="text-center">
                  <Clock className="h-6 w-6 text-primary mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Instant</p>
                  <p className="text-xs font-medium">Results</p>
                </div>
                <div className="text-center">
                  <Building2 className="h-6 w-6 text-accent mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Official</p>
                  <p className="text-xs font-medium">Portal</p>
                </div>
                <div className="text-center">
                  <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-xs font-medium">Results</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Result Section */}
        {result && (
          <div className="space-y-8 animate-fade-in">
            {/* Performance Overview */}
            {performanceStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="card-hover glass-effect border-0 text-center">
                  <CardContent className="p-4">
                    <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold gradient-text">{performanceStats.averageSGPA}</p>
                    <p className="text-xs text-muted-foreground">Avg SGPA</p>
                  </CardContent>
                </Card>
                <Card className="card-hover glass-effect border-0 text-center">
                  <CardContent className="p-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{performanceStats.passedSubjects}</p>
                    <p className="text-xs text-muted-foreground">Passed</p>
                  </CardContent>
                </Card>
                <Card className="card-hover glass-effect border-0 text-center">
                  <CardContent className="p-4">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-red-600">{performanceStats.failedSubjects}</p>
                    <p className="text-xs text-muted-foreground">Failed</p>
                  </CardContent>
                </Card>
                <Card className="card-hover glass-effect border-0 text-center">
                  <CardContent className="p-4">
                    <Target className="h-8 w-8 text-accent mx-auto mb-2" />
                    <p className="text-2xl font-bold gradient-accent-text">{performanceStats.passPercentage}%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Student Info */}
            <Card className="card-hover glass-effect border-0 overflow-hidden">
              <CardHeader className="relative" style={{background: 'var(--gradient-primary)'}}>
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/30"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-white/20"></div>
                </div>
                <CardTitle className="flex items-center gap-3 text-white relative z-10">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <User className="h-6 w-6" />
                  </div>
                  Student Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <User className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Full Name</Label>
                        <p className="text-lg font-bold text-foreground">{result.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Father's Name</Label>
                        <p className="text-lg font-medium text-foreground">{result.fatherName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <Hash className="h-5 w-5 text-primary" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Roll Number</Label>
                        <p className="text-lg font-mono font-bold text-foreground">{result.rollNo}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <Hash className="h-5 w-5 text-accent" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Enrollment Number</Label>
                        <p className="text-lg font-mono font-medium text-foreground">{result.enrollmentNo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <Award className="h-5 w-5 text-accent" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Course</Label>
                        <p className="text-lg font-bold text-foreground">{result.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                      <BookOpen className="h-5 w-5 text-accent" />
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">Branch</Label>
                        <p className="text-lg font-medium text-foreground">{result.branch}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="my-6" />
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Institute</Label>
                    <p className="text-lg font-semibold text-foreground">{result.instituteName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Academic Performance */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* SGPA */}
              <Card className="card-hover glass-effect border-0 overflow-hidden">
                <CardHeader className="relative" style={{background: 'var(--gradient-accent)'}}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 w-16 h-16 rounded-full border border-white/30"></div>
                  </div>
                  <CardTitle className="flex items-center gap-3 text-white relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    Semester-wise SGPA
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {Object.entries(result.SGPA).map(([sem, sgpa]) => (
                      <div key={sem} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-primary" />
                          <span className="font-semibold capitalize">{sem.replace('sem', 'Semester ')}</span>
                        </div>
                        <Badge className={`${getGradeColor(Number(sgpa))} text-white font-bold px-3 py-1`}>
                          {Number(sgpa)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="card-hover glass-effect border-0 overflow-hidden">
                <CardHeader className="relative" style={{background: 'var(--gradient-primary)'}}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-2 right-2 w-16 h-16 rounded-full border border-white/30"></div>
                  </div>
                  <CardTitle className="flex items-center gap-3 text-white relative z-10">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    Result Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-muted/30 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 shimmer-effect"></div>
                      <Trophy className="h-8 w-8 text-primary mx-auto mb-2 relative z-10" />
                      <p className="text-3xl font-bold gradient-text relative z-10">{result.totalMarksObtained}</p>
                      <p className="text-sm text-muted-foreground relative z-10">Total Marks Obtained</p>
                    </div>
                    {result.latestCOP && result.latestCOP !== "NO Backlogs" && (
                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="h-4 w-4 text-destructive" />
                          <p className="text-sm font-semibold text-destructive">Latest Carry Overs:</p>
                        </div>
                        <p className="text-sm text-destructive/80">{result.latestCOP}</p>
                      </div>
                    )}
                    {(!result.latestCOP || result.latestCOP === "NO Backlogs") && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-2 text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          <p className="text-sm font-semibold">No Carry Overs - Excellent!</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card className="card-hover glass-effect border-0 overflow-hidden">
              <CardHeader className="relative" style={{background: 'var(--gradient-secondary)'}}>
                <CardTitle className="flex items-center gap-3 text-foreground relative z-10">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  Detailed Subject Results
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="subjects" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
                    <TabsTrigger value="subjects" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Subject Marks
                    </TabsTrigger>
                    <TabsTrigger value="carryovers" className="data-[state=active]:bg-white data-[state=active]:shadow-md transition-all">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Carry Overs
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="subjects" className="mt-6">
                    <div className="overflow-x-auto rounded-xl border border-border/50">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            <th className="text-left p-4 font-semibold">Subject</th>
                            <th className="text-left p-4 font-semibold">Code</th>
                            <th className="text-center p-4 font-semibold">Type</th>
                            <th className="text-center p-4 font-semibold">Internal</th>
                            <th className="text-center p-4 font-semibold">External</th>
                            <th className="text-center p-4 font-semibold">Total</th>
                            <th className="text-center p-4 font-semibold">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.Subjects.map((subject, index) => {
                            const total = (parseInt(subject.internal) || 0) + (parseInt(subject.external) || 0);
                            const gradeInfo = getSubjectGrade(subject.internal, subject.external);
                            
                            return (
                              <tr key={index} className="border-b border-border/30 hover:bg-muted/30 transition-all duration-300 group">
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <p className="font-medium text-foreground">{subject.subject}</p>
                                  </div>
                                </td>
                                <td className="p-4 font-mono text-sm text-muted-foreground">{subject.code}</td>
                                <td className="p-4 text-center">
                                  <Badge variant={subject.type === "Theory" ? "default" : "secondary"} className="font-medium">
                                    {subject.type}
                                  </Badge>
                                </td>
                                <td className="p-4 text-center font-semibold">{subject.internal || "-"}</td>
                                <td className="p-4 text-center font-semibold">{subject.external || "-"}</td>
                                <td className="p-4 text-center font-bold text-lg">{total || "-"}</td>
                                <td className="p-4 text-center">
                                  <Badge className={`${gradeInfo.color} text-white font-bold px-3 py-1`}>
                                    {gradeInfo.grade}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="carryovers" className="mt-6">
                    <div className="space-y-4">
                      {result.CarryOvers.length > 0 && result.CarryOvers[0] !== "No Backlogs" ? (
                        result.CarryOvers.map((carryOver, index) => (
                          <div key={index} className="p-6 border border-destructive/20 bg-destructive/5 rounded-xl hover:bg-destructive/10 transition-all duration-300">
                            <div className="flex justify-between items-start">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-destructive" />
                                  <p className="font-semibold text-destructive">{carryOver.session}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground">Semester: {carryOver.sem}</p>
                                </div>
                                <p className="text-sm text-destructive/80 mt-2">{carryOver.cop}</p>
                              </div>
                              <Badge variant="destructive" className="font-medium">
                                <XCircle className="h-3 w-3 mr-1" />
                                Carry Over
                              </Badge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-green-50 rounded-xl border border-green-200">
                          <div className="relative inline-block">
                            <Trophy className="h-16 w-16 mx-auto text-green-500 mb-4 animate-float" />
                            <Sparkles className="h-4 w-4 text-green-400 absolute -top-1 -right-1 animate-float" style={{animationDelay: '0.5s'}} />
                          </div>
                          <p className="text-lg font-semibold text-green-700 mb-2">Perfect Record!</p>
                          <p className="text-green-600">No carry overs found - Keep up the excellent work!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
