import { MainLayout } from '@/components/layout/MainLayout';
import { useTasks } from '@/hooks/useTasks';
import { useMemo, useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, ChevronLeft, ChevronRight, CalendarDays, ListTodo, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, isSameDay, isToday, isPast, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { TaskModal } from '@/components/modals/TaskModal';

type ViewMode = 'week' | 'month' | 'list';

export default function AgendaPage() {
  const { tasks, updateTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('week');

  const currentWeekStart = startOfWeek(currentDate, { locale: ptBR });

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  }, [currentWeekStart]);

  const monthDays = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const startWeek = startOfWeek(start, { locale: ptBR });
    const endWeek = addDays(startOfWeek(end, { locale: ptBR }), 6);
    return eachDayOfInterval({ start: startWeek, end: endWeek });
  }, [currentDate]);

  const tasksByDay = useMemo(() => {
    const grouped: Record<string, typeof tasks> = {};
    tasks.forEach(task => {
      const dayKey = format(new Date(task.due_date), 'yyyy-MM-dd');
      if (!grouped[dayKey]) grouped[dayKey] = [];
      grouped[dayKey].push(task);
    });
    return grouped;
  }, [tasks]);

  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
    overdue: tasks.filter(t => isPast(new Date(t.due_date)) && t.status !== 'completed').length,
  }), [tasks]);

  const navigate = (direction: number) => {
    if (viewMode === 'week') {
      setCurrentDate(prev => addDays(prev, direction * 7));
    } else {
      setCurrentDate(prev => direction > 0 ? addMonths(prev, 1) : subMonths(prev, 1));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await updateTask(taskId, { status: newStatus, completed_at: newStatus === 'completed' ? new Date().toISOString() : null });
  };

  const renderDayCell = (day: Date, isCompact = false) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    const dayTasks = tasksByDay[dayKey] || [];
    const isCurrentDay = isToday(day);
    const isCurrentMonth = isSameMonth(day, currentDate);

    return (
      <div 
        key={dayKey} 
        className={cn(
          'glass-card p-3 min-h-[140px]',
          isCurrentDay && 'ring-2 ring-primary',
          !isCurrentMonth && viewMode === 'month' && 'opacity-50'
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className={cn(
              'text-xs font-medium uppercase',
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
            className="p-1.5 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5">
          {dayTasks.slice(0, isCompact ? 2 : 4).map((task) => {
            const isCompleted = task.status === 'completed';
            const isOverdue = isPast(new Date(task.due_date)) && !isCompleted;

            return (
              <div 
                key={task.id}
                className={cn(
                  'p-2 rounded-lg text-xs cursor-pointer',
                  isCompleted ? 'bg-success/20 text-success' : 
                  isOverdue ? 'bg-destructive/20 text-destructive' : 
                  'bg-muted/50 text-foreground hover:bg-muted'
                )}
                onClick={() => handleToggleTask(task.id, task.status)}
              >
                <div className="flex items-center gap-1.5">
                  {isCompleted ? (
                    <CheckCircle className="w-3 h-3 flex-shrink-0" />
                  ) : isOverdue ? (
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <Clock className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span className={cn('truncate', isCompleted && 'line-through')}>{task.title}</span>
                </div>
              </div>
            );
          })}
          {dayTasks.length > (isCompact ? 2 : 4) && (
            <p className="text-xs text-muted-foreground text-center">+{dayTasks.length - (isCompact ? 2 : 4)} mais</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Agenda</h1>
            <p className="text-muted-foreground text-sm">Gerencie suas tarefas e compromissos</p>
          </div>
          <Button className="btn-primary gap-2" onClick={() => { setSelectedDate(new Date()); setIsTaskModalOpen(true); }}>
            <Plus className="w-4 h-4" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-success">{stats.completed}</p>
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/20">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-warning">{stats.pending}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/20">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-destructive">{stats.overdue}</p>
              <p className="text-xs text-muted-foreground">Atrasadas</p>
            </div>
          </div>
        </div>

        {/* Navigation & View Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="font-semibold text-foreground min-w-[200px] text-center">
              {viewMode === 'week' 
                ? `${format(currentWeekStart, "dd 'de' MMMM", { locale: ptBR })} - ${format(addDays(currentWeekStart, 6), "dd 'de' MMMM", { locale: ptBR })}`
                : format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })
              }
            </span>
            <Button variant="ghost" size="icon" onClick={() => navigate(1)}>
              <ChevronRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToToday} className="ml-2">
              Hoje
            </Button>
          </div>
          
          <div className="flex gap-1 p-1 rounded-lg bg-muted/30">
            <button
              onClick={() => setViewMode('week')}
              className={cn('px-3 py-1.5 rounded text-sm font-medium', viewMode === 'week' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Semana
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={cn('px-3 py-1.5 rounded text-sm font-medium', viewMode === 'month' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <LayoutGrid className="w-4 h-4 inline mr-1" />
              Mês
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('px-3 py-1.5 rounded text-sm font-medium', viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}
            >
              <ListTodo className="w-4 h-4 inline mr-1" />
              Lista
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        {viewMode === 'week' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {weekDays.map((day) => renderDayCell(day))}
          </div>
        )}

        {viewMode === 'month' && (
          <div className="grid grid-cols-7 gap-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
            ))}
            {monthDays.map((day) => renderDayCell(day, true))}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">Nenhuma tarefa encontrada</div>
            ) : (
              tasks.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).map((task) => {
                const isCompleted = task.status === 'completed';
                const isOverdue = isPast(new Date(task.due_date)) && !isCompleted;
                const isTodays = isToday(new Date(task.due_date));

                return (
                  <div 
                    key={task.id}
                    className="glass-card p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-primary/30"
                    onClick={() => handleToggleTask(task.id, task.status)}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={cn(
                        'p-2 rounded-lg',
                        isCompleted ? 'bg-success/20' : isOverdue ? 'bg-destructive/20' : 'bg-muted/50'
                      )}>
                        {isCompleted ? (
                          <CheckCircle className={cn('w-5 h-5', 'text-success')} />
                        ) : isOverdue ? (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium text-foreground truncate', isCompleted && 'line-through text-muted-foreground')}>{task.title}</p>
                        {task.description && <p className="text-sm text-muted-foreground truncate">{task.description}</p>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={cn(
                        'text-sm font-medium',
                        isTodays ? 'text-primary' : isOverdue ? 'text-destructive' : 'text-muted-foreground'
                      )}>
                        {format(new Date(task.due_date), "dd/MM", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(task.due_date), "HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => { setIsTaskModalOpen(false); setSelectedDate(null); }} 
      />
    </MainLayout>
  );
}