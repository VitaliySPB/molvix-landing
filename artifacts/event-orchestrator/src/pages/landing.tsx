import { useEffect, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  QrCode, BarChart3, Bell, Users, 
  ShieldCheck, ArrowRight, CheckCircle2, 
  Workflow, CalendarDays, TrendingUp, Target
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

const demoFormSchema = z.object({
  name: z.string().min(2, "Имя должно содержать не менее 2 символов").max(100),
  email: z.string().email("Введите корректный email-адрес"),
  company: z.string().min(1, "Укажите название компании").max(200),
  role: z.string().max(100).optional(),
  message: z.string().max(1000).optional(),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <MetricsSection />
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
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold text-base tracking-tight">EOS</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase font-medium">Event Operating System</span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Как работает</a>
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Возможности</a>
          <a href="#metrics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Результаты</a>
          <Button asChild size="sm" className="rounded-full px-6 shadow-sm">
            <a href="#demo">Запросить демо</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 flex items-center hero-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-muted-foreground mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-20"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground"></span>
            </span>
            MVP готов · Ищем первых пилотных клиентов
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-medium tracking-tight text-foreground leading-[1.08] mb-6">
            Вы платите ~4000 ₽ за каждого участника.
            <br />
            <span className="text-muted-foreground">Через неделю не знаете ни одного по имени.</span>
          </h1>

          <p className="text-2xl md:text-3xl font-display font-medium text-foreground/80 leading-snug max-w-3xl mb-6">
            Событие длится один день. Отношения с аудиторией — годами.
          </p>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mb-12">
            EOS — платформа, которая превращает разовое событие в постоянную базу контактов. Вы знаете кто вернётся — ещё до следующего события.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="lg" className="rounded-full px-8 h-14 text-base shadow-lg hover:shadow-xl transition-all btn-primary-hover">
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

function ProblemSection() {
  const facts = [
    { label: "Email-листа", value: "15–20%", desc: "открываемость через неделю после события" },
    { label: "Telegram-группы", value: "3–5 дней", desc: "до нулевой активности" },
    { label: "Данных об аудитории", value: "≈ 0", desc: "кто готов купить снова — неизвестно" },
    { label: "Стоимость привлечения", value: "~4000 ₽", desc: "на одного участника, которого вы теряете" },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Реальная проблема</p>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              Организаторы начинают каждое событие с нуля.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Вы потратили сотни тысяч рублей на привлечение аудитории. Провели с ней один день. И через неделю не знаете ни одного из них по имени.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Следующее событие начинается с той же точки — заново покупая ту же аудиторию. Это не проблема удержания. Это сломанная механика.
            </p>
            <p className="text-base text-foreground/60 leading-relaxed italic border-l-2 border-border pl-4">
              Retention нельзя «включить» после события — если до и во время ничего не было сделано. EOS работает на всех трёх фазах именно поэтому.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {facts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="p-6 bg-background border-border/50 h-full">
                  <p className="text-3xl font-display font-semibold text-foreground mb-1">{fact.value}</p>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{fact.label}</p>
                  <p className="text-sm text-muted-foreground leading-snug">{fact.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const phases = [
    {
      num: "01",
      label: "До события",
      title: "Участник уже внутри — до начала.",
      desc: "Программа, материалы и профили других участников в телефоне. QR-код для входа без очередей. Организатор настраивает всё за 20 минут без разработчика.",
      items: ["Программа и расписание в приложении", "Биографии спикеров и тезисы", "Профили участников — кто придёт", "QR-код вместо бумажного бейджа"],
      icon: CalendarDays
    },
    {
      num: "02",
      label: "В день события",
      title: "Участник получает больше, чем ожидал.",
      desc: "QR-нетворкинг, живая программа, тематические комнаты, материалы спикеров. Человек который познакомился с 8 людьми — вернётся завтра.",
      items: ["QR-нетворкинг без визиток и Telegram", "Живая программа с мгновенными изменениями", "Тематические комнаты внутри события", "Материалы спикеров — скачать прямо сейчас"],
      icon: Users
    },
    {
      num: "03",
      label: "После события",
      title: "Аудитория не исчезла — она активна.",
      desc: "Retention-дашборд, поведенческая аналитика, скоринг участников. CAC на повторное приглашение = 0 рублей. Вы знаете кто готов купить снова.",
      items: ["Retention D+1 / D+7 / D+14 / D+30", "Скоринг участников 0–100 по готовности", "Сегментированные рассылки по интересам", "Повторные приглашения одним кликом"],
      icon: TrendingUp
    },
  ];

  return (
    <section id="how-it-works" className="py-16 section-dots">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Три фазы жизненного цикла</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
            Retention нельзя включить после. Он начинается до.
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Каждая фаза — необходимое условие для следующей. Если участник не получил ценность в день события — он не вернётся после.
          </p>
          <p className="text-base text-muted-foreground/60">
            Вот как EOS встраивается в каждый этап — не добавляя сложности, а заполняя то, чего раньше не было.
          </p>
        </div>

        <div className="space-y-6">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card className="p-8 md:p-10 border-border/50 hover:border-border transition-colors duration-300">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">{phase.num}</span>
                      <span className="text-sm font-medium text-muted-foreground">{phase.label}</span>
                    </div>
                    <h3 className="text-2xl font-display font-medium leading-snug">{phase.title}</h3>
                  </div>
                  <div>
                    <p className="text-muted-foreground leading-relaxed mb-6">{phase.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {phase.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-foreground">
                          <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    { title: "QR-нетворкинг", desc: "Сканируешь QR человека — он появляется в контактах с полным профилем. Без визиток, без «напиши мне в Telegram».", icon: QrCode },
    { title: "Live-дашборд", desc: "Сколько людей активны прямо сейчас, посещаемость сессий, вовлечённость, скачивания — в реальном времени.", icon: BarChart3 },
    { title: "Push-уведомления", desc: "Изменение зала, важное объявление, пауза — мгновенно всем участникам или выбранной группе.", icon: Bell },
    { title: "Скоринг аудитории", desc: "Каждый участник получает оценку от 0 до 100 по активности. Вы знаете кто «горячий» и готов к следующей покупке.", icon: Target },
    { title: "Воронка участника", desc: "Приглашён → открыл → зарегистрировался → подтверждён → пришёл. Полная прозрачность на каждом шаге.", icon: TrendingUp },
    { title: "Безопасный доступ", desc: "Контроль входа в реальном времени, управление доступом к материалам, журнал сканирования QR-кодов.", icon: ShieldCheck },
  ];

  return (
    <section id="features" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Инструменты</p>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              Два продукта в одном.
            </h2>
            <p className="text-xl text-muted-foreground mb-4">
              Мобильное приложение для участников и веб-панель для организаторов. CRM для живой аудитории с поведенческими данными — аналога на рынке СНГ нет.
            </p>
            <p className="text-base text-muted-foreground/60">
              Участник не теряется. Организатор не гадает. Всё, что нужно — уже внутри.
            </p>
          </div>
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

function MetricsSection() {
  const metrics = [
    { value: "D+30", label: "глубина retention-аналитики", desc: "Отслеживаем возврат аудитории через 1, 7, 14 и 30 дней после события" },
    { value: "0 ₽", label: "CAC на повторное приглашение", desc: "Вся аудитория прошлого события одним кликом — без нового бюджета на привлечение" },
    { value: "20 мин", label: "настройка события", desc: "Название, программа, сессии, спикеры, приглашения — без разработчика" },
    { value: "× N", label: "событий в базе", desc: "Аудитории всех событий накапливаются и сегментируются в едином профиле" },
  ];

  return (
    <section id="metrics" className="py-16 section-dots">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Что получает организатор</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            Аудитория как актив, а не расход.
          </h2>
          <p className="text-lg text-muted-foreground">
            Это не прогнозы. Это то, что становится возможным, когда событие перестаёт заканчиваться в день проведения.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="border-t-2 border-foreground/10 pt-6"
            >
              <p className="text-4xl font-display font-semibold text-foreground mb-1">{m.value}</p>
              <p className="text-sm font-medium text-foreground/70 mb-3 uppercase tracking-wide">{m.label}</p>
              <p className="text-sm text-muted-foreground leading-snug">{m.desc}</p>
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
    defaultValues: { name: "", email: "", company: "", role: "", message: "" },
  });

  const submitMutation = useSubmitDemoRequest();

  const onSubmit = (data: DemoFormValues) => {
    submitMutation.mutate(
      { data },
      {
        onSuccess: () => { setIsSuccess(true); form.reset(); },
        onError: () => {
          toast({
            title: "Что-то пошло не так",
            description: "Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <section id="demo" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          <div className="max-w-xl lg:sticky lg:top-32">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Пилотный запуск</p>
            <h2 className="text-5xl md:text-6xl font-display font-medium tracking-tight mb-8">
              Станьте первым.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              EOS находится на стадии поиска первых пилотных клиентов. Мы работаем в ручном режиме, глубоко погружаясь в каждый запуск.
            </p>
            <p className="text-base text-muted-foreground/70 leading-relaxed mb-10">
              Один разговор меняет понимание того, что вообще возможно с вашей аудиторией — до, во время и после события.
            </p>

            <div className="space-y-4">
              {[
                "Персональный разбор вашего события",
                "Настройка и запуск под вашу задачу",
                "Прямой доступ к команде основателей",
                "Участие в формировании продукта",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-muted-foreground shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 pt-8 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                Рынок: Россия · Казахстан · СНГ
              </p>
            </div>
          </div>

          <div className="relative">
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
                    Спасибо! Мы свяжемся с вами в ближайшее время, чтобы согласовать демо.
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
                  <div className="mb-6">
                    <h3 className="text-xl font-display font-medium mb-1">Запросить демо</h3>
                    <p className="text-sm text-muted-foreground">Расскажите о вашем событии — мы подготовимся</p>
                  </div>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">Компания</FormLabel>
                            <FormControl>
                              <Input placeholder="Название организации" className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                              <Input placeholder="Организатор, директор..." className="h-12 bg-secondary/30 rounded-xl" {...field} />
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
                          <FormLabel className="text-foreground/80 font-medium">О вашем событии <span className="text-muted-foreground font-normal">(необязательно)</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Расскажите: какой формат, сколько участников, как часто проводите..."
                              className="min-h-[110px] bg-secondary/30 rounded-xl resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl text-base shadow-md hover:shadow-lg transition-all btn-primary-hover"
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
          <div className="flex flex-col leading-none">
            <span className="font-display font-semibold tracking-tight text-sm">EOS</span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase">Event Operating System</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} EOS. Все права защищены.
        </p>
      </div>
    </footer>
  );
}
