import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useTasks, Task } from '@/hooks/useTasks';
import { TaskModal } from '@/components/modals/TaskModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Calendar,
  Loader2,
} from 'lucide-react';
import { format, isBefore, startOfDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const priorityColors: Record<string, string> = {
  low: 'border-l-muted-foreground',
  medium: 'border-l-info',
  high: 'border-l-warning',
  urgent: 'border-l-destructive',
};

const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusIcons: Record<string, any> = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  cancelled: AlertCircle,
};

export default function TarefasPage() {
  const { tasks, loading, updateTask, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const today = startOfDay(new Date());

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingTasks = filteredTasks.filter(t => t.status === 'pending' || t.status === 'in_progress');
  const completedTasks = filteredTasks.filter(t => t.status === 'completed');

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { 
      status: newStatus, 
      completed_at: newStatus === 'completed' ? new Date().toISOString() : null 
    });
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleDeleteTask = async () => {
    if (selectedTask) {
      await deleteTask(selectedTask.id);
    }
  };

  const TaskCard = ({ task }: { task: Task }) => {
    const dueDate = new Date(task.due_date);
    const isOverdue = isBefore(dueDate, today) && task.status !== 'completed';
    const isTodayTask = isToday(dueDate);
    const StatusIcon = statusIcons[task.status] || Circle;

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          'glass-card p-3 lg:p-4 border-l-4 group cursor-pointer hover:border-l-primary transition-all',
          priorityColors[task.priority] || 'border-l-muted-foreground',
          task.status === 'completed' && 'opacity-60'
        )}
        onClick={() => handleEditTask(task)}
      >
        <div className="flex items-start gap-3 lg:gap-4">
          <button
            onClick={(e) => { e.stopPropagation(); toggleTaskStatus(task); }}
            className={cn(
              'p-1 rounded-full transition-colors flex-shrink-0 mt-0.5',
              task.status === 'completed'
                ? 'text-success'
                : 'text-muted-foreground hover:text-primary'
            )}
          >
            <StatusIcon className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'font-medium text-foreground group-hover:text-primary transition-colors text-sm lg:text-base',
              task.status === 'completed' && 'line-through'
            )}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-xs lg:text-sm text-muted-foreground mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2 lg:gap-4 mt-2 lg:mt-3">
              <span className={cn(
                'text-xs flex items-center gap-1',
                isOverdue ? 'text-destructive' : isTodayTask ? 'text-warning' : 'text-muted-foreground'
              )}>
                <Calendar className="w-3 h-3" />
                {isOverdue ? 'Atrasada' : isTodayTask ? 'Hoje' : format(dueDate, "dd/MM", { locale: ptBR })}
              </span>

              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                task.priority === 'urgent' && 'bg-destructive/20 text-destructive',
                task.priority === 'high' && 'bg-warning/20 text-warning',
                task.priority === 'medium' && 'bg-info/20 text-info',
                task.priority === 'low' && 'bg-muted text-muted-foreground'
              )}>
                {priorityLabels[task.priority] || task.priority}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-4 lg:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Tarefas</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Gerencie suas tarefas e follow-ups ({tasks.length})
            </p>
          </div>
          
          <Button onClick={handleCreateTask} className="btn-primary gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Nova Tarefa
          </Button>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <Button variant="outline" className="btn-secondary gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Tasks Lists */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Pending Tasks */}
            <div>
              <h2 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pendentes
                <span className="text-sm font-normal text-muted-foreground">
                  ({pendingTasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {pendingTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground glass-card">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa pendente</p>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Tasks */}
            <div>
              <h2 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Concluídas
                <span className="text-sm font-normal text-muted-foreground">
                  ({completedTasks.length})
                </span>
              </h2>
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
                {completedTasks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground glass-card">
                    <Circle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa concluída</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedTask(null);
        }}
        onConfirm={handleDeleteTask}
        title="Excluir Tarefa"
        description={`Tem certeza que deseja excluir a tarefa "${selectedTask?.title}"?`}
      />
    </MainLayout>
  );
}
