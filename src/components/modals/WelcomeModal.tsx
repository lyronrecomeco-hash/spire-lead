import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Rocket, Wrench, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'genesis-welcome-shown';

const slides = [
  {
    icon: Rocket,
    title: 'Bem-vindo ao Genesis',
    description: 'Seu novo CRM profissional para gestão completa de vendas, leads e relacionamento com clientes.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Wrench,
    title: 'Em Desenvolvimento',
    description: 'Este sistema está em fase de desenvolvimento ativo. Novas funcionalidades são adicionadas constantemente.',
    gradient: 'from-warning to-orange-500',
  },
  {
    icon: Sparkles,
    title: 'Aproveite!',
    description: 'Explore as funcionalidades disponíveis e acompanhe as melhorias. Sua experiência é nossa prioridade.',
    gradient: 'from-success to-emerald-400',
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Content */}
          <div className="p-8 pt-12">
            {/* Icon */}
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-center mb-6"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${slide.gradient} p-[1px]`}>
                <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                  <SlideIcon className={`w-9 h-9 bg-gradient-to-br ${slide.gradient} bg-clip-text text-transparent`} style={{ color: 'hsl(var(--primary))' }} />
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center mb-8"
            >
              <h2 className="text-xl font-bold text-foreground mb-3">{slide.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{slide.description}</p>
            </motion.div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'w-6 bg-primary' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              {currentSlide > 0 ? (
                <Button
                  variant="outline"
                  onClick={prevSlide}
                  className="flex-1 gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  className="flex-1 text-muted-foreground"
                >
                  Pular
                </Button>
              )}
              <Button
                onClick={nextSlide}
                className="flex-1 gap-2 btn-primary"
              >
                {currentSlide < slides.length - 1 ? (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  'Começar'
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
