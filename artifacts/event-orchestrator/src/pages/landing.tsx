import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Users, ShieldCheck, ArrowRight, CheckCircle2, 
  CalendarDays, TrendingUp,
  Menu, X, Briefcase, BookOpen, Music
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  phone: z.string().min(6, "Укажите номер телефона").max(30, "Слишком длинный номер"),
  company: z.string().min(1, "Укажите название или ИНН компании").max(200),
  role: z.string().min(1, "Укажите вашу должность").max(100),
  message: z.string().max(1000).optional(),
});

type DemoFormValues = z.infer<typeof demoFormSchema>;

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || value === 0) return;
    const duration = 2800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, value]);

  return <span ref={ref}>{prefix}{started ? count : 0}{suffix}</span>;
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <ForWhoSection />
        <ProblemSection />
        <HowItWorksSection />
        <FeaturesSection />
        <MetricsSection />
        <PricingSection />
        <FaqSection />
        <DemoSection />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            src="/logo.jpg"
            alt="MOLVIX"
            className="w-9 h-9 rounded-lg object-contain bg-[#1E1B4B] group-hover:scale-105 transition-transform duration-300"
          />
          <span className={`font-display font-semibold text-base tracking-tight transition-colors duration-300 ${
            scrolled ? "text-foreground" : "text-white"
          }`}>MOLVIX</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Как работает</a>
          <a href="#features" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Возможности</a>
          <a href="#metrics" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Результаты</a>
          <a href="#pricing" className={`text-sm font-medium transition-colors duration-300 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Стоимость</a>
          <Button asChild size="sm" className={`rounded-full px-6 shadow-sm transition-all duration-300 ${
            !scrolled ? "bg-white text-[#1E1B4B] hover:bg-white/90 border-0" : ""
          }`}>
            <a href="#demo">Запросить демо</a>
          </Button>
        </nav>

        <button
          className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
            scrolled ? "text-foreground hover:bg-foreground/8" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Меню"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className={`md:hidden backdrop-blur-xl border-b px-6 py-4 flex flex-col gap-4 ${
            scrolled ? "bg-background/95 border-border/50" : "bg-[#1E1B4B]/95 border-white/10"
          }`}
        >
          <a href="#how-it-works" onClick={closeMenu} className={`text-sm font-medium transition-colors py-1 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Как работает</a>
          <a href="#features" onClick={closeMenu} className={`text-sm font-medium transition-colors py-1 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Возможности</a>
          <a href="#metrics" onClick={closeMenu} className={`text-sm font-medium transition-colors py-1 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Результаты</a>
          <a href="#pricing" onClick={closeMenu} className={`text-sm font-medium transition-colors py-1 ${scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/70 hover:text-white"}`}>Стоимость</a>
          <Button asChild size="sm" className={`rounded-full w-full mt-1 ${!scrolled ? "bg-white text-[#1E1B4B] hover:bg-white/90 border-0" : ""}`}>
            <a href="#demo" onClick={closeMenu}>Запросить демо</a>
          </Button>
        </motion.div>
      )}
    </header>
  );
}

function HeroSection() {
  const [email, setEmail] = useState("");
  const [eventType, setEventType] = useState("");
  const [participants, setParticipants] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch("/api/event-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, eventType: eventType || undefined, participants: participants || undefined }),
      });
    } catch {
    }
    setLeadSubmitted(true);
  };

  return (
    <section className="relative pt-20 pb-12 flex items-center hero-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm font-medium text-white/70 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Превратите разовое событие в постоянный источник клиентов
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-white leading-[1.2] mb-4">
            Вы платите &gt;4000 ₽ за участника.
            <br />
            <span className="text-white/50">Через неделю не знаете <span className="whitespace-nowrap">ни одного по имени.</span></span>
          </h1>

          <p className="text-xl md:text-2xl font-display font-medium text-white/80 leading-snug max-w-3xl mb-4">
            Событие длится один день. Отношения с аудиторией — годами.
          </p>

          <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-3xl mb-7">
            MOLVIX — платформа, которая превращает разовое событие в постоянную базу контактов. Вы знаете кто вернётся — ещё до следующего события.
          </p>

          <div className="max-w-3xl">
          {leadSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              Заявка принята — свяжемся в ближайшее время
            </motion.div>
          ) : (
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-[0_4px_40px_rgba(0,0,0,0.25)]">
              <p className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">Получить доступ</p>
              <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl bg-white/10 border-white/20 focus-visible:border-white/60 focus-visible:ring-0 flex-1 min-w-0 text-white placeholder:text-white/40"
              />
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger className="h-12 rounded-xl border-white/20 bg-white/10 text-white/80 text-sm sm:w-44 shrink-0 focus:ring-0 focus:border-white/60 [&>svg]:text-white/50">
                  <SelectValue placeholder="Тип события" className="text-white/40" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Конференция">Конференция</SelectItem>
                  <SelectItem value="Форум">Форум</SelectItem>
                  <SelectItem value="Воркшоп">Воркшоп</SelectItem>
                  <SelectItem value="Корпоратив">Корпоратив</SelectItem>
                  <SelectItem value="Концерт / фестиваль">Концерт / фестиваль</SelectItem>
                  <SelectItem value="Другое">Другое</SelectItem>
                </SelectContent>
              </Select>
              <Select value={participants} onValueChange={setParticipants}>
                <SelectTrigger className="h-12 rounded-xl border-white/20 bg-white/10 text-white/80 text-sm sm:w-40 shrink-0 focus:ring-0 focus:border-white/60 [&>svg]:text-white/50">
                  <SelectValue placeholder="Участников" className="text-white/40" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="до 50">до 50</SelectItem>
                  <SelectItem value="50–200">50–200</SelectItem>
                  <SelectItem value="200–500">200–500</SelectItem>
                  <SelectItem value="500–2000">500–2000</SelectItem>
                  <SelectItem value="2000+">2000+</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" size="lg" className="h-12 rounded-xl px-6 text-sm font-semibold shadow-md bg-white text-[#1E1B4B] hover:bg-white/90 border-0 shrink-0">
                Записаться <ArrowRight className="ml-1.5 w-4 h-4" />
              </Button>
            </form>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-white/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              Уже 12 организаторов в листе ожидания
            </p>
            <a href="#how-it-works" className="text-sm text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
              Как это работает <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ForWhoSection() {
  const segments = [
    {
      icon: Users,
      title: "Конференции и форумы",
      pain: "500 участников пришли. Через месяц — тишина.",
      gain: "Знаете кто из них вернётся на следующий форум ещё до анонса."
    },
    {
      icon: Briefcase,
      title: "Корпоративные события",
      pain: "Тимбилдинги и B2B-ивенты без аналитики — деньги в воздух.",
      gain: "Данные об активности каждого участника и готовность к следующему шагу."
    },
    {
      icon: BookOpen,
      title: "Образовательные мероприятия",
      pain: "Слушатели курсов и воркшопов исчезают сразу после события.",
      gain: "Автоматические сегменты: кто прошёл всё, кто выпал, кто готов к следующему модулю."
    },
    {
      icon: Music,
      title: "Концерты и фестивали",
      pain: "Тысячи человек — и ни одного контакта в CRM.",
      gain: "QR-вход превращается в базу лояльных зрителей для следующего сезона."
    },
  ];

  return (
    <section className="py-16 section-dots">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Для кого</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight">
            MOLVIX подходит, если вы проводите <span className="gradient-text">события</span>.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {segments.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Card className="p-6 h-full bg-background border-border/50 hover-elevate flex flex-col">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center mb-4 shrink-0">
                  <s.icon className="w-4.5 h-4.5 text-primary" strokeWidth={1.8} />
                </div>
                <h3 className="text-base font-display font-semibold mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 border-l-2 border-border pl-3">{s.pain}</p>
                <div className="flex items-start gap-2 mt-auto">
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80 leading-relaxed">{s.gain}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Нужно ли участникам скачивать приложение?",
      a: "Да, но это занимает 30 секунд. QR-код для скачивания отправляется за 24 часа до события вместе с программой. По нашей практике, 70–80% участников устанавливают приложение до начала."
    },
    {
      q: "Сколько времени занимает настройка события?",
      a: "20 минут для стандартного события: название, описание, расписание сессий, спикеры, участники. Без разработчика и без интеграций."
    },
    {
      q: "Как долго хранятся данные об аудитории?",
      a: "Бессрочно в рамках вашего тарифа. Все события и аудитории накапливаются в едином профиле организатора — вы всегда видите полную историю взаимодействий."
    },
    {
      q: "Есть ли интеграции с CRM или Bitrix24?",
      a: "В текущей версии — экспорт контактов в CSV и базовый webhook. Прямая интеграция с Bitrix24 и AmoCRM в роадмапе на Q2 2026."
    },
    {
      q: "Что если участник не хочет сканировать QR?",
      a: "Бумажный бейдж остаётся опцией. Но на практике QR-нетворкинг — одна из самых популярных фич: люди обменивают контакты прямо на ивенте без визиток и Telegram."
    },
    {
      q: "Работает ли MOLVIX без интернета на площадке?",
      a: "Программа события и материалы кэшируются в приложении — доступны офлайн. QR-регистрация и нетворкинг требуют соединения. Для крупных площадок рекомендуем отдельную точку Wi-Fi."
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Частые вопросы</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight">
            Разберём <span className="gradient-text">заранее</span>.
          </h2>
        </div>
        <div className="max-w-3xl divide-y divide-border/60">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5">
              <button
                className="w-full flex items-center justify-between gap-4 text-left group"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-base font-medium text-foreground group-hover:text-foreground/80 transition-colors">{faq.q}</span>
                <span className={`shrink-0 w-5 h-5 rounded-full border border-border/60 flex items-center justify-center transition-transform duration-200 ${openIndex === i ? "rotate-45" : ""}`}>
                  <ArrowRight className="w-2.5 h-2.5 -rotate-45" />
                </span>
              </button>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <p className="pt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
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
              Организаторы начинают каждое событие с <span className="gradient-text">нуля</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Вы потратили сотни тысяч рублей на привлечение аудитории. Провели с ней один день. И через неделю не знаете ни одного из них по имени.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Следующее событие начинается с той же точки — заново покупая ту же аудиторию. Это не проблема удержания. Это сломанная механика.
            </p>
            <p className="text-base text-foreground/60 leading-relaxed italic border-l-2 border-border pl-4">
              Удержать аудиторию нельзя «включить» после события — если до и во время ничего не было сделано. MOLVIX работает на всех трёх фазах именно поэтому.
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
      items: ["QR-нетворкинг без визиток и Telegram", "Живая программа с мгновенными изменениями", "Тематические комнаты внутри события", "Материалы докладов — всегда под рукой"],
      icon: Users
    },
    {
      num: "03",
      label: "После события",
      title: "Аудитория не исчезла — она активна.",
      desc: "Аналитика возврата, самые активные участники на виду, приглашения старой аудитории бесплатно. Вы знаете, кто готов прийти снова.",
      items: ["Знаем, кто вернётся — через день, неделю, месяц", "Видим самых активных участников", "Рассылки по интересам — в один клик", "Приглашаем старую аудиторию бесплатно"],
      icon: TrendingUp
    },
  ];

  return (
    <section id="how-it-works" className="py-16 section-dots">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Три фазы жизненного цикла</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
            Аудиторию нельзя удержать после. Это начинается <span className="gradient-text">до</span>.
          </h2>
          <p className="text-xl text-muted-foreground mb-4">
            Каждая фаза — необходимое условие для следующей. Если участник не получил ценность в день события — он не вернётся после.
          </p>
          <p className="text-base text-muted-foreground/60">
            Вот как MOLVIX встраивается в каждый этап — не перестраивая процесс, а закрывая то, чего в нём не хватало.
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
    { title: "QR-нетворкинг", desc: "Сканируешь QR человека — он появляется в контактах с полным профилем. Без визиток, без «напиши мне в Telegram».", img: "/illustrations/qr-networking.png" },
    { title: "Live-дашборд", desc: "Сколько людей активны прямо сейчас, посещаемость сессий, вовлечённость, скачивания — в реальном времени.", img: "/illustrations/dashboard.png" },
    { title: "Push-уведомления", desc: "Изменение зала, важное объявление, пауза — мгновенно всем участникам или выбранной группе.", img: "/illustrations/push.png" },
    { title: "Скоринг аудитории", desc: "Каждый участник получает оценку от 0 до 100 по активности. Вы знаете кто «горячий» и готов к следующей покупке.", img: "/illustrations/scoring.png" },
    { title: "Воронка участника", desc: "Приглашён → открыл → зарегистрировался → подтверждён → пришёл. Полная прозрачность на каждом шаге.", img: "/illustrations/funnel.png" },
    { title: "Безопасный доступ", desc: "Контроль входа в реальном времени, управление доступом к материалам, журнал сканирования QR-кодов.", img: "/illustrations/access.png" },
  ];

  return (
    <section id="features" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Инструменты</p>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              <span className="gradient-text">Два</span> продукта в одном.
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
              className="h-full"
            >
              <Card className="overflow-hidden h-full bg-background/50 hover:bg-background border-border/50 hover-elevate transition-colors duration-300">
                <div className="bg-[#EEEEF8] aspect-[4/3] w-full">
                  <img
                    src={feat.img}
                    alt={feat.title}
                    className="w-full h-full object-cover illustration-brand"
                  />
                </div>
                <div className="px-4 py-3">
                  <h3 className="text-sm font-display font-semibold mb-1 leading-tight">{feat.title}</h3>
                  <p className="text-xs text-muted-foreground leading-snug">{feat.desc}</p>
                </div>
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
    { numericValue: 30, suffix: " дней", label: "после события — отслеживаем возврат", desc: "Знаем, кто вернётся через день, неделю, месяц — ещё до следующего анонса" },
    { numericValue: 0, prefix: "0 ", suffix: "₽", label: "стоит повторное приглашение", desc: "Вся аудитория прошлого события одним кликом — без рекламного бюджета", static: true },
    { numericValue: 20, suffix: " мин", label: "настройка события", desc: "Название, программа, сессии, спикеры, приглашения — без разработчика" },
    { numericValue: null, staticValue: "× N", label: "событий в базе", desc: "Аудитории всех событий накапливаются и сегментируются в едином профиле" },
  ];

  return (
    <section id="metrics" className="py-16 section-dots">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Что получает организатор</p>
          <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-4">
            Аудитория как <span className="gradient-text">актив</span>,<br />а не расход.
          </h2>
          <p className="text-lg text-muted-foreground">
            Событие закончилось. Аудитория — нет.
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
              <p className="text-4xl font-display font-semibold text-foreground mb-1">
                {m.staticValue ? (
                  m.staticValue
                ) : m.static ? (
                  `0 ₽`
                ) : (
                  <AnimatedNumber value={m.numericValue!} suffix={m.suffix ?? ""} />
                )}
              </p>
              <p className="text-sm font-medium text-foreground/70 mb-3 uppercase tracking-wide">{m.label}</p>
              <p className="text-sm text-muted-foreground leading-snug">{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const betaPerks = [
    { label: "Бесплатный доступ", desc: "На всё время бета-тестирования — без оплаты, без карты" },
    { label: "Сохранённый тариф", desc: "После релиза вы платите по специальным партнёрским условиям" },
    { label: "Приоритетная поддержка", desc: "Прямой контакт с командой и влияние на развитие продукта" },
  ];

  return (
    <section id="pricing" className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Бета-доступ</p>
            <h2 className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-6">
              Сейчас — <span className="gradient-text">бесплатно</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-3">
              Мы ищем организаторов профессиональных событий: от&nbsp;20&nbsp;участников, с&nbsp;ближайшим мероприятием в&nbsp;течение 2–3&nbsp;месяцев.
            </p>
            <p className="text-base text-muted-foreground/70 leading-relaxed mb-8">
              Вы получаете полный доступ бесплатно на время беты, а&nbsp;после релиза — статус партнёра: сохранённый тариф и&nbsp;приоритетная поддержка навсегда.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {betaPerks.map((perk) => (
                <div key={perk.label} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/60 px-4 py-3">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-[#1E1B4B] shrink-0" />
                  <div>
                    <p className="text-sm font-semibold font-display leading-tight">{perk.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button asChild size="lg" className="rounded-xl px-8 shadow-md btn-primary-hover">
              <a href="#demo">Стать партнёром беты <ArrowRight className="ml-2 w-4 h-4" /></a>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <img
              src="/illustrations/pricing.png"
              alt="Бета-доступ MOLVIX"
              className="w-full max-w-sm rounded-2xl illustration-brand"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

type InnLookupState = "idle" | "loading" | "found" | "not-found";

function DemoSection() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  const [innLookupState, setInnLookupState] = useState<InnLookupState>("idle");
  const innLookupTimer = useState<ReturnType<typeof setTimeout> | null>(null);

  const form = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", role: "", message: "" },
  });

  const submitMutation = useSubmitDemoRequest();

  const handleCompanyChange = (value: string, onChange: (v: string) => void) => {
    onChange(value);
    if (innLookupTimer[0]) clearTimeout(innLookupTimer[0]);

    const isInn = /^\d{10}$/.test(value.trim()) || /^\d{12}$/.test(value.trim());
    if (!isInn) {
      setInnLookupState("idle");
      return;
    }

    setInnLookupState("loading");
    innLookupTimer[0] = setTimeout(async () => {
      try {
        const resp = await fetch(`/api/company-lookup?inn=${value.trim()}`);
        if (!resp.ok) { setInnLookupState("not-found"); return; }
        const data = await resp.json() as { name?: string };
        if (data.name) {
          onChange(data.name);
          setInnLookupState("found");
        } else {
          setInnLookupState("not-found");
        }
      } catch {
        setInnLookupState("not-found");
      }
    }, 500);
  };

  const onSubmit = (data: DemoFormValues) => {
    submitMutation.mutate(
      { data },
      {
        onSuccess: () => { setIsSuccess(true); form.reset(); setInnLookupState("idle"); },
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
              Станьте одним из <span className="gradient-text">первых</span>.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              MOLVIX — единственная платформа, которая удерживает аудиторию до, во время и после мероприятия. Без нового бюджета на рекламу.
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
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
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

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground/80 font-medium">Телефон</FormLabel>
                          <FormControl>
                            <Input placeholder="+7 (999) 000-00-00" className="h-12 bg-secondary/30 rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground/80 font-medium">
                              Компания
                              {innLookupState === "loading" && (
                                <span className="ml-2 text-xs text-muted-foreground font-normal animate-pulse">Ищем по ИНН…</span>
                              )}
                              {innLookupState === "found" && (
                                <span className="ml-2 text-xs text-green-600 font-normal">✓ Найдено</span>
                              )}
                              {innLookupState === "not-found" && (
                                <span className="ml-2 text-xs text-muted-foreground font-normal">ИНН не найден</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Название/ИНН"
                                className="h-12 bg-secondary/30 rounded-xl"
                                {...field}
                                onChange={(e) => handleCompanyChange(e.target.value, field.onChange)}
                              />
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
                            <FormLabel className="text-foreground/80 font-medium">Должность</FormLabel>
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
  const navLinks = [
    { label: "Как работает", href: "#how-it-works" },
    { label: "Возможности", href: "#features" },
    { label: "Результаты", href: "#metrics" },
    { label: "Стоимость", href: "#pricing" },
    { label: "Запросить демо", href: "#demo" },
  ];

  return (
    <footer className="border-t border-border/40 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <img src="/logo.jpg" alt="MOLVIX" className="w-8 h-8 rounded-md object-contain bg-[#1E1B4B]" />
            <span className="font-display font-semibold tracking-tight text-sm">MOLVIX</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Превращаем разовое событие в постоянную базу контактов.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Навигация</p>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Контакт</p>
          <ul className="space-y-2">
            <li>
              <a href="mailto:info@molvix.ru" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                info@molvix.ru
              </a>
            </li>
            <li>
              <a href="https://t.me/eos_platform" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Telegram: @eos_platform
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/30 max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} MOLVIX. Все права защищены.
        </p>
        <a href="#" className="text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors">
          Политика конфиденциальности
        </a>
      </div>
    </footer>
  );
}
