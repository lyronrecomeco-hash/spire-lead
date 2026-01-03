import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/MainLayout';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { CustomerModal } from '@/components/modals/CustomerModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Pencil,
  Trash2,
  Eye,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientesPage() {
  const { customers, loading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateCustomer = () => {
    setSelectedCustomer(null);
    setModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleSaveCustomer = async (data: Partial<Customer>) => {
    if (selectedCustomer) {
      await updateCustomer(selectedCustomer.id, data);
    } else {
      await createCustomer(data as any);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      await deleteCustomer(selectedCustomer.id);
    }
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
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
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 lg:mb-2">Clientes</h1>
            <p className="text-muted-foreground text-sm lg:text-base">
              Gerencie sua base de clientes ({customers.length})
            </p>
          </div>
          
          <Button onClick={handleCreateCustomer} className="btn-primary gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Novo Cliente
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

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Customers Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="glass-card-hover p-4 lg:p-6 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 lg:gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg lg:text-xl font-bold text-primary-foreground flex-shrink-0">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {customer.name}
                      </h3>
                      {customer.company && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                          <Building className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{customer.company}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-popover border border-border">
                      <DropdownMenuItem onClick={() => handleEditCustomer(customer)} className="cursor-pointer">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditCustomer(customer)} className="cursor-pointer">
                        <Pencil className="w-4 h-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => customer.phone && handleWhatsApp(customer.phone)} className="cursor-pointer">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(customer)} 
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2 mb-4">
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                  {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>Desde {format(new Date(customer.created_at), "MMM/yyyy", { locale: ptBR })}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {customer.source || 'Sem origem'}
                  </span>
                  
                  {customer.phone && (
                    <button 
                      className="p-2 rounded-lg bg-success/20 hover:bg-success/30 text-success transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsApp(customer.phone!);
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>{customers.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}</p>
            {customers.length === 0 && (
              <Button onClick={handleCreateCustomer} className="mt-4 btn-primary gap-2">
                <Plus className="w-5 h-5" />
                Cadastrar primeiro cliente
              </Button>
            )}
          </div>
        )}
      </div>

      <CustomerModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCustomer(null);
        }}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedCustomer(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Excluir Cliente"
        description={`Tem certeza que deseja excluir o cliente "${selectedCustomer?.name}"? Esta ação não pode ser desfeita.`}
      />
    </MainLayout>
  );
}
