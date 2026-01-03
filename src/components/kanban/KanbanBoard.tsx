import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { KanbanColumn as KanbanColumnType, Lead, LeadStatus } from '@/types/crm';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
  columns: KanbanColumnType[];
  onLeadMove?: (leadId: string, newStatus: LeadStatus) => void;
  onCardClick?: (leadId: string) => void;
}

export function KanbanBoard({ columns: initialColumns, onLeadMove, onCardClick }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findLeadById = (id: string): Lead | undefined => {
    for (const column of columns) {
      const lead = column.leads.find(l => l.id === id);
      if (lead) return lead;
    }
    return undefined;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the source and destination columns
    let sourceColumn: KanbanColumnType | undefined;
    let destColumn: KanbanColumnType | undefined;
    let activeLead: Lead | undefined;

    for (const column of columns) {
      const lead = column.leads.find(l => l.id === activeId);
      if (lead) {
        sourceColumn = column;
        activeLead = lead;
        break;
      }
    }

    // Check if we're dropping on a column or another card
    destColumn = columns.find(col => col.id === overId);
    
    if (!destColumn) {
      // We might be dropping on another card, find its column
      for (const column of columns) {
        if (column.leads.some(l => l.id === overId)) {
          destColumn = column;
          break;
        }
      }
    }

    if (!sourceColumn || !destColumn || !activeLead) {
      setActiveId(null);
      return;
    }

    if (sourceColumn.id !== destColumn.id) {
      // Move lead to new column
      const newColumns = columns.map(col => {
        if (col.id === sourceColumn!.id) {
          return {
            ...col,
            leads: col.leads.filter(l => l.id !== activeId),
          };
        }
        if (col.id === destColumn!.id) {
          const updatedLead = { ...activeLead!, status: destColumn!.id };
          return {
            ...col,
            leads: [...col.leads, updatedLead],
          };
        }
        return col;
      });

      setColumns(newColumns);
      onLeadMove?.(activeId, destColumn.id);
    }

    setActiveId(null);
  };

  const filteredColumns = columns.map(col => ({
    ...col,
    leads: col.leads.filter(lead =>
      lead.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const activeLead = activeId ? findLeadById(activeId) : null;

  return (
    <div className="h-full">
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 input-field"
          />
        </div>
        
        <Button variant="outline" className="btn-secondary gap-2">
          <Filter className="w-4 h-4" />
          Filtros
        </Button>
        
        <Button variant="outline" className="btn-secondary gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Ordenar
        </Button>
      </motion.div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onCardClick={onCardClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="rotate-3 opacity-90">
              <KanbanCard lead={activeLead} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
