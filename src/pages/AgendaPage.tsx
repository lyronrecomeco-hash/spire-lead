import { MainLayout } from '@/components/layout/MainLayout';
import { useTasks } from '@/hooks/useTasks';
import { useMemo, useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay, isToday, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TaskModal } from '@/components/modals/TaskModal';

export default function AgendaPage() {
  const { tasks, updateTask } = useTasks();
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { locale: ptBR }));
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const tasksByDay = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {};
    weekDays.forEach(day => {
      const dayKey = format(day, 'yyyy-MM-dd');
      grouped[dayKey] = tasks.filter(task => {
        const taskDate = format(new Date(task.due_date), 'yyyy-MM-dd');
        return taskDate === dayKey;
      });
    });
    return grouped;
  }, [tasks, weekDays]);

  const goToPrevWeek = () => setCurrentWeekStart(prev => addDays(prev, -7));
  const goToNextWeek = () => setCurrentWeekStart(prev => addDays(prev, 7));
  const goToToday = () => setCurrentWeekStart(startOfWeek(new Date(), { locale: ptBR }));

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Agenda</h1>
            <p className="text-muted-foreground text-sm">Visualize suas tarefas e compromissos</p>
          </div>
          <Button className="btn-primary gap-2" onClick={() => { setSelectedDate(new Date()); setIsTaskModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between glass-card p-4">
          <Button variant="ghost" size="icon" onClick={goToPrevWeek}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-foreground">
              {format(currentWeekStart, "dd 'de' MMMM", { locale: ptBR })} - {format(addDays(currentWeekStart, 6), "dd 'de' MMMM", { locale: ptBR })}
            </span>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Hoje
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Week Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayKey = format(day, 'yyyy-MM-dd');
            const dayTasks = tasksByDay[dayKey] || [];
            const isCurrentDay = isToday(day);

            return (
              <div 
                key={dayKey} 
                className={cn(
                  'glass-card p-4 min-h-[200px]',
                  isCurrentDay && 'ring-2 ring-primary'
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={cn(
                      'text-sm font-medium',
                      isCurrentDay ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {format(day, 'EEE', { locale: ptBR })}
                    </p>
                    <p className={cn(
                      'text-xl font-bold',
                      isCurrentDay ? 'text-primary' : 'text-foreground'
                    )}>
                      {format(day, 'd')}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setSelectedDate(day); setIsTaskModalOpen(true); }}
                    className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  {dayTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    const isOverdue = isPast(new Date(task.due_date)) && !isCompleted;

                    return (
                      <div 
                        key={task.id}
                        className={cn(
                          'p-2 rounded-lg text-xs cursor-pointer transition-colors',
                          isCompleted ? 'bg-success/20 text-success' : 
                          isOverdue ? 'bg-destructive/20 text-destructive' : 
                          'bg-muted/50 text-foreground hover:bg-muted'
                        )}
                        onClick={() => handleToggleTask(task.id, task.status)}
                      >
                        <div className="flex items-start gap-2">
                          {isCompleted ? (
                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          ) : isOverdue ? (
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          ) : (
                            <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={cn('line-clamp-2', isCompleted && 'line-through')}>{task.title}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setSelectedDate(null); }} 
      />
    </MainLayout>
  );
}
