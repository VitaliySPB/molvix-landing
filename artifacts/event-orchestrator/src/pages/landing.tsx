import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Network, Zap, Activity, ShieldCheck, 
  Users, History, ArrowRight, CheckCircle2, 
  Workflow, ArrowUpRight
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useSubmitDemoRequest } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

// Form Schema matching OpenAPI specifications
const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required").max(200),
  role: z.string().max(100).optional(),
  message: z.string().max(1000).optional(),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

export default function LandingPage() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection y={y} opacity={opacity} />
        <SocialProofSection />
        <HowItWorksSection />
        <FeaturesSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
            <Workflow className="w-4 h-4" />
          </div>
          <span className="font-display font-semibold text-xl tracking-tight">
            Event Orchestrator
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <Button asChild size="sm" className="rounded-full px-6 shadow-sm">
            <a href="#demo">Request Demo</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection({ y, opacity }: { y: any, opacity: any }) {
  return (
    <section className="relative pt-48 pb-32 overflow-hidden flex items-center min-h-[90vh]">
      {/* Decorative ambient background */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] -z-10 opacity-40" style={{ background: 'radial-gradient(ellipse, hsl(240 5% 92%) 0%, transparent 70%)' }} />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 w-full">
        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
            </span>
            Event Orchestrator 2.0 is live
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-medium tracking-tight text-foreground leading-[1.05] mb-8">
            Orchestrate events <br className="hidden md:block" />
            <span className="text-muted-foreground">with absolute clarity.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            The enterprise-grade platform to manage, trigger, and monitor event-driven workflows across your entire distributed architecture.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all">
              <a href="#demo">
                Request a Demo <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-base bg-transparent border-border/60 hover:bg-secondary/50">
              <a href="#how-it-works">
                See how it works
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const companies = ["Acme Corp", "GlobalTech", "Quantum", "Nexus", "Starlight", "Horizon"];
  
  return (
    <section className="py-12 border-y border-border/40 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">
          Trusted by engineering teams at
        </p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-60 grayscale">
          {companies.map((company, i) => (
            <span key={i} className="font-display font-bold text-xl md:text-2xl tracking-tighter text-foreground">
              {company}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Connect",
      desc: "Integrate your existing microservices and message queues with a single line of configuration.",
      icon: Network
    },
    {
      num: "02",
      title: "Orchestrate",
      desc: "Define complex routing rules, transformations, and recovery playbooks visually or via code.",
      icon: Workflow
    },
    {
      num: "03",
      title: "Monitor",
      desc: "Gain unprecedented observability into every event, trace, and workflow in real-time.",
      icon: Activity
    }
  ];

  return (
    <section id="how-it-works" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
            Complexity made simple.
          </h2>
          <p className="text-xl text-muted-foreground">
            We built Event Orchestrator to remove the chaos from event-driven architectures, giving you back control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-[1px] bg-border" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative z-10"
            >
              <div className="w-24 h-24 rounded-3xl bg-secondary border border-border/50 flex items-center justify-center mb-8 shadow-sm group hover:border-primary/20 transition-colors">
                <step.icon className="w-8 h-8 text-foreground group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-2xl font-display font-medium mb-3 flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{step.num}</span>
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "Event Routing", desc: "Route events to the right services instantly based on dynamic payloads.", icon: ArrowUpRight },
    { title: "Smart Triggers", desc: "Define rules that fire workflows automatically when exact conditions are met.", icon: Zap },
    { title: "Real-time Observability", desc: "See every event, every step, and every failure in absolute real time.", icon: Activity },
    { title: "Retry & Recovery", desc: "Never lose an event. Built-in dead letter queues and intelligent retries.", icon: History },
    { title: "Team Collaboration", desc: "Share workflows, pipelines, and recovery playbooks across engineering squads.", icon: Users },
    { title: "Audit & Compliance", desc: "Full history, version control, and RBAC access control built right in.", icon: ShieldCheck }
  ];

  return (
    <section id="features" className="py-32 bg-secondary/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              Everything you need to scale.
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful primitives that handle the heavy lifting of distributed systems so you can focus on product logic.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full shrink-0">
            <a href="#demo">View Full Documentation</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="p-8 h-full bg-background/50 hover:bg-background border-border/50 hover-elevate transition-colors duration-300">
                <feat.icon className="w-6 h-6 mb-6 text-foreground" />
                <h3 className="text-xl font-display font-medium mb-3">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoSection() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      role: "",
      message: ""
    }
  });

  const submitMutation = useSubmitDemoRequest();

  const onSubmit = (data: DemoFormValues) => {
    submitMutation.mutate(
      { data },
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
        },
        onError: () => {
          toast({
            title: "Something went wrong",
            description: "Failed to submit demo request. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <section id="demo" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="max-w-xl">
            <h2 className="text-5xl md:text-7xl font-display font-medium tracking-tight mb-8">
              Ready to see it in action?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              Request a personalized demo and discover how Event Orchestrator can bring clarity and reliability to your architecture.
            </p>
            
            <div className="space-y-4">
              {[
                "Personalized platform walkthrough",
                "Architecture review with our engineers",
                "Custom pricing based on your scale",
                "Access to sandbox environment"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Decorative background behind card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-secondary to-background rounded-[2rem] transform rotate-3 scale-105 -z-10 border border-border/50" />
            
            <Card className="p-8 md:p-10 shadow-2xl shadow-black/5 bg-background border-border/60 rounded-3xl relative z-10">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <div className="w-16 h-16 bg-secondary text-foreground rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-display font-medium mb-3">Request Received</h3>
                  <p className="text-muted-foreground">
                    Thank you! Our team will review your request and be in touch shortly to schedule your demo.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-8 rounded-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Submit another request
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jane Doe" className="h-12 bg-secondary/30 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">Work Email</FormLabel>
                            <FormControl>
                              <Input placeholder="jane@company.com" className="h-12 bg-secondary/30 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" className="h-12 bg-secondary/30 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">Role <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="CTO, VP Eng..." className="h-12 bg-secondary/30 rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 font-medium">Message <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us about your current architecture..." 
                              className="min-h-[120px] bg-secondary/30 rounded-xl resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-base shadow-md hover:shadow-lg transition-all"
                      disabled={submitMutation.isPending}
                    >
                      {submitMutation.isPending ? "Submitting..." : "Request Demo"}
                    </Button>
                  </form>
                </Form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Workflow className="w-5 h-5" />
          <span className="font-display font-semibold tracking-tight">Event Orchestrator</span>
        </div>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Event Orchestrator, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
