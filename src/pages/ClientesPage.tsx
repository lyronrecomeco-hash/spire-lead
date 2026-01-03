import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockCustomers } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Building,
  Calendar,
  MessageCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Clientes</h1>
            <p className="text-muted-foreground">
              Gerencie sua base de clientes
            </p>
          </div>
          
          <Button className="btn-primary gap-2">
            <Plus className="w-5 h-5" />
            Novo Cliente
          </Button>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar clientes..."
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

        {/* Customers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredCustomers.map((customer, index) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-card-hover p-6 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-primary-foreground">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {customer.name}
                    </h3>
                    {customer.company && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {customer.company}
                      </p>
                    )}
                  </div>
                </div>
                
                <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Desde {format(customer.createdAt, "MMM/yyyy", { locale: ptBR })}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                  {customer.source}
                </span>
                
                <button 
                  className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://wa.me/${customer.phone.replace(/\D/g, '')}`, '_blank');
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
