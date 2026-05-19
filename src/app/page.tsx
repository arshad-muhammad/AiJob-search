import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Zap, Clock, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Navigate straight to dashboard for preview purposes
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" to="/">
          <Bot className="h-6 w-6 mr-2 text-primary" />
          <span className="font-bold">AutoApply AI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" onClick={handleSignIn}>Log in</Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-transparent">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Apply to 100 jobs while you sleep
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl pt-4">
                  Upload your resume once. Our AI tailors your application, generates personalized cover letters, and auto-submits to top jobs fitting your profile.
                </p>
              </div>
              <div className="space-x-4 pt-6">
                <Button size="lg" onClick={handleSignIn} className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 rounded-full font-bold">
                  <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="h-5 w-5 bg-white rounded-full p-0.5" />
                  Sign in with Google
                </Button>
                <Button variant="outline" size="lg" onClick={handleSignIn} className="rounded-full border-white/10 hover:bg-white/5">
                  View Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-transparent border-t border-white/5">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>AI Tailoring</CardTitle>
                  <CardDescription>
                    Automatically rewrites bullet points and generates custom cover letters for every single application.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Auto Submission</CardTitle>
                  <CardDescription>
                    We handle Greenhouse, Lever, and Workday parsing. You just approve the tailored docs.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Track Status</CardTitle>
                  <CardDescription>
                    Unified Kanban board to track your pipeline from applied, to interviewing, to offer negotiations.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-xs text-muted-foreground">© 2024 AutoApply AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
