import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTasks, Task } from '@/hooks/useTasks';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

export function TaskModal({ isOpen, onClose, task }: TaskModalProps) {
  const { createTask, updateTask } = useTasks();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    due_date: task?.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    due_time: task?.due_date ? new Date(task.due_date).toTimeString().slice(0, 5) : '09:00',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    assigned_to: task?.assigned_to || '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
        due_time: task.due_date ? new Date(task.due_date).toTimeString().slice(0, 5) : '09:00',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        assigned_to: task.assigned_to || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        due_time: '09:00',
        priority: 'medium',
        status: 'pending',
        assigned_to: '',
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const dueDateTime = new Date(`${formData.due_date}T${formData.due_time}`).toISOString();

    const taskData = {
      title: formData.title,
      description: formData.description || null,
      due_date: dueDateTime,
      priority: formData.priority,
      status: formData.status,
      assigned_to: formData.assigned_to || null,
      lead_id: task?.lead_id || null,
      customer_id: task?.customer_id || null,
    };

    try {
      if (task) {
        await updateTask(task.id, taskData);
      } else {
        await createTask(taskData);
      }
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-card w-full max-w-lg p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              {task ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="input-field mt-1"
                required
              />
            </div>

            <div>
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input-field mt-1"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                  className="input-field mt-1"
                  required
                />
              </div>

              <div>
                <Label>Horário</Label>
                <Input
                  type="time"
                  value={formData.due_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_time: e.target.value }))}
                  className="input-field mt-1"
                />
              </div>

              <div>
                <Label>Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, priority: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData(prev => ({ ...prev, status: v }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="in_progress">Em Andamento</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Responsável</Label>
              <Input
                value={formData.assigned_to}
                onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                className="input-field mt-1"
                placeholder="Nome do responsável"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 btn-primary"
                disabled={loading || !formData.title || !formData.due_date}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  task ? 'Salvar' : 'Criar Tarefa'
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
