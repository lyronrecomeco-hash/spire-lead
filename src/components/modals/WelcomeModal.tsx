import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Wrench, Sparkles, ChevronLeft, ChevronRight, LayoutDashboard, Users, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'genesis-welcome-shown';

const slides = [
  {
    icon: Rocket,
    title: 'Bem-vindo ao Genesis',
    description: 'Seu CRM profissional para gestão completa de vendas, leads e relacionamento com clientes.',
    features: [
      'Gestão completa de leads e clientes',
      'Pipeline de vendas visual',
      'Acompanhamento em tempo real',
    ],
    gradient: 'from-primary to-accent',
  },
  {
    icon: LayoutDashboard,
    title: 'Dashboard Inteligente',
    description: 'Visualize métricas importantes e acompanhe o desempenho das suas vendas em um só lugar.',
    features: [
      'Métricas de conversão',
      'Gráficos interativos',
      'Resumo financeiro',
    ],
    gradient: 'from-info to-primary',
  },
  {
    icon: Target,
    title: 'Kanban Customizável',
    description: 'Organize seus leads do seu jeito. Crie status personalizados e gerencie seu funil de vendas.',
    features: [
      'Colunas personalizáveis',
      'Arraste e solte leads',
      'Filtros avançados',
    ],
    gradient: 'from-accent to-pink-500',
  },
  {
    icon: Users,
    title: 'Gestão de Equipe',
    description: 'Adicione membros da equipe, atribua tarefas e acompanhe a produtividade de cada um.',
    features: [
      'Cadastro de membros',
      'Atribuição de leads',
      'Controle de atividades',
    ],
    gradient: 'from-success to-emerald-400',
  },
  {
    icon: Wrench,
    title: 'Em Desenvolvimento',
    description: 'Este sistema está em fase beta. Novas funcionalidades são adicionadas constantemente.',
    features: [
      'Atualizações frequentes',
      'Melhorias contínuas',
      'Feedback é bem-vindo!',
    ],
    gradient: 'from-warning to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Pronto para Começar!',
    description: 'Explore todas as funcionalidades e transforme sua gestão de vendas. Bons negócios!',
    features: [
      'Comece criando seus status',
      'Adicione seus clientes',
      'Cadastre seus primeiros leads',
    ],
    gradient: 'from-success to-primary',
  },
];

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem(STORAGE_KEY);
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsOpen(false);
  };

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  if (!isOpen) return null;

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;
  const isLastSlide = currentSlide === slides.length - 1;
  const isFirstSlide = currentSlide === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Progress bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Step counter */}
          <div className="absolute top-4 right-4 text-xs text-muted-foreground font-medium">
            {currentSlide + 1} / {slides.length}
          </div>

          {/* Content */}
          <div className="p-8 pt-10">
            {/* Icon */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${slide.gradient} p-[2px]`}>
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                  <SlideIcon className="w-9 h-9 text-primary" />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center mb-6"
            >
              <h2 className="text-xl font-bold text-foreground mb-2">{slide.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.description}</p>
            </motion.div>

            {/* Features */}
            <motion.div
              key={`features-${currentSlide}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-2 mb-8"
            >
              {slide.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${slide.gradient}`} />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-6 bg-primary' 
                      : index < currentSlide
                        ? 'w-1.5 bg-primary/50'
                        : 'w-1.5 bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={prevSlide}
                disabled={isFirstSlide}
                className="flex-1 gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar
              </Button>
              <Button
                onClick={nextSlide}
                className="flex-1 gap-2 btn-primary"
              >
                {isLastSlide ? (
                  'Começar a Usar'
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
