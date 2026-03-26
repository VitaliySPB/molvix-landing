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
  name: z.string().min(2, "Имя должно содержать не менее 2 символов").max(100),
  email: z.string().email("Введите корректный email-адрес"),
  company: z.string().min(1, "Укажите название компании").max(200),
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
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Как это работает</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Возможности</a>
          <Button asChild size="sm" className="rounded-full px-6 shadow-sm">
            <a href="#demo">Запросить демо</a>
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
            Event Orchestrator 2.0 доступен
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-medium tracking-tight text-foreground leading-[1.05] mb-8">
            Управляйте событиями <br className="hidden md:block" />
            <span className="text-muted-foreground">с абсолютной ясностью.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mb-12">
            Платформа корпоративного уровня для управления, запуска и мониторинга событийных процессов в распределённых системах.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all">
              <a href="#demo">
                Запросить демо <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 h-14 text-base bg-transparent border-border/60 hover:bg-secondary/50">
              <a href="#how-it-works">
                Как это работает
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
          Доверяют команды из
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
      title: "Подключите",
      desc: "Интегрируйте существующие микросервисы и очереди сообщений с помощью одной строки конфигурации.",
      icon: Network
    },
    {
      num: "02",
      title: "Оркестрируйте",
      desc: "Задавайте сложные правила маршрутизации, трансформации и сценарии восстановления — визуально или через код.",
      icon: Workflow
    },
    {
      num: "03",
      title: "Контролируйте",
      desc: "Получите беспрецедентную наблюдаемость за каждым событием, трейсом и процессом в реальном времени.",
      icon: Activity
    }
  ];

  return (
    <section id="how-it-works" className="py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-20 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
            Сложность — просто.
          </h2>
          <p className="text-xl text-muted-foreground">
            Event Orchestrator создан, чтобы убрать хаос из событийных архитектур и вернуть вам контроль.
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
    { title: "Маршрутизация событий", desc: "Направляйте события к нужным сервисам мгновенно, на основе динамических данных.", icon: ArrowUpRight },
    { title: "Умные триггеры", desc: "Задавайте правила, которые автоматически запускают процессы при наступлении нужных условий.", icon: Zap },
    { title: "Наблюдаемость в реальном времени", desc: "Видите каждое событие, каждый шаг и каждый сбой — прямо сейчас.", icon: Activity },
    { title: "Повторы и восстановление", desc: "Ни одно событие не будет потеряно. Встроенные очереди и интеллектуальные повторные попытки.", icon: History },
    { title: "Командная работа", desc: "Делитесь процессами, пайплайнами и сценариями восстановления между командами.", icon: Users },
    { title: "Аудит и соответствие", desc: "Полная история, контроль версий и ролевой доступ — всё встроено с первого дня.", icon: ShieldCheck }
  ];

  return (
    <section id="features" className="py-32 bg-secondary/30 border-y border-border/40">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              Всё для масштабирования.
            </h2>
            <p className="text-xl text-muted-foreground">
              Мощные инструменты берут на себя сложность распределённых систем, чтобы вы сосредоточились на продукте.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full shrink-0">
            <a href="#demo">Смотреть документацию</a>
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
            title: "Что-то пошло не так",
            description: "Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.",
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
              Готовы увидеть в деле?
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              Запросите персональное демо и узнайте, как Event Orchestrator привнесёт ясность и надёжность в вашу архитектуру.
            </p>
            
            <div className="space-y-4">
              {[
                "Персональный обзор платформы",
                "Разбор архитектуры с нашими инженерами",
                "Индивидуальные условия под ваш масштаб",
                "Доступ к sandbox-среде"
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
                  <h3 className="text-2xl font-display font-medium mb-3">Заявка получена</h3>
                  <p className="text-muted-foreground">
                    Спасибо! Наша команда рассмотрит заявку и скоро свяжется с вами для согласования демо.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-8 rounded-full"
                    onClick={() => setIsSuccess(false)}
                  >
                    Отправить ещё одну заявку
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
                            <FormLabel className="text-foreground/80 font-medium">Имя и фамилия</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Петров" className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                            <FormLabel className="text-foreground/80 font-medium">Рабочий email</FormLabel>
                            <FormControl>
                              <Input placeholder="ivan@company.com" className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                            <FormLabel className="text-foreground/80 font-medium">Компания</FormLabel>
                            <FormControl>
                              <Input placeholder="ООО Ромашка" className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                            <FormLabel className="text-foreground/80 font-medium">Должность <span className="text-muted-foreground font-normal">(необязательно)</span></FormLabel>
                            <FormControl>
                              <Input placeholder="CTO, VP Engineering..." className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                          <FormLabel className="text-foreground/80 font-medium">Сообщение <span className="text-muted-foreground font-normal">(необязательно)</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Расскажите о вашей текущей архитектуре..." 
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
                      {submitMutation.isPending ? "Отправка..." : "Запросить демо"}
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
          © {new Date().getFullYear()} Event Orchestrator. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
