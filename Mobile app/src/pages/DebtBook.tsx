import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Loader2, Trash2, Pencil, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { generateWhatsAppLink } from '@/lib/whatsappHelper';

interface CustomerDebt {
  id: number;
  name: string;
  phone?: string;
  total_amount: number;
  amount_paid: number;
  amount_remaining: number;
  percentage_paid: number;
  due_date: string;
  status: string;
  items?: any[];
}

const formatPhone = (phone: string | undefined) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  if (cleaned.length === 11) return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  return phone;
};

export default function DebtBook() {
  const navigate = useNavigate();
  const [debts, setDebts] = useState<CustomerDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDebt, setSelectedDebt] = useState<CustomerDebt | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/debtors/', {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setDebts(data.data || []);
    } catch (error) {
      console.error('Failed to fetch debts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Debtor deleted successfully',
        });
        setDeleteConfirm(null);
        setSelectedDebt(null);
        fetchDebts();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete debtor',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to delete debtor:', error);
      toast({
        title: 'Error',
        description: 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (debt: CustomerDebt) => {
    setSelectedDebt(null);
    navigate(`/debtors/${debt.id}/edit`);
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const summary = {
    total_debtors: debts.length,
    active_debtors: debts.filter(d => d.status === 'active').length,
    total_owed: debts.reduce((sum, d) => sum + d.amount_remaining, 0)
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold">Debt Book</h1>
          <p className="text-sm text-muted-foreground">Track customer debts</p>
        </div>
        <Button 
          size="icon"
          onClick={() => navigate('/debtors/add')}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-3 animate-fade-up stagger-1">
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Total Debtors</p>
          <p className="text-xl font-bold mt-1">{summary.total_debtors}</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-xl font-bold text-warning mt-1">{summary.active_debtors}</p>
        </div>
        <div className="p-3 rounded-xl bg-card shadow-card border border-border/50 text-center">
          <p className="text-xs text-muted-foreground">Total Owed</p>
          <p className="text-xl font-bold text-destructive mt-1">${summary.total_owed.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-3 animate-fade-up stagger-2">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : debts.length > 0 ? (
          <div className="bg-card rounded-2xl shadow-card border border-border/50 divide-y divide-border">
            {debts.map((debt) => (
              <div 
                key={debt.id} 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setSelectedDebt(debt)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">{debt.name}</h3>
                    {debt.phone && (
                      <p className="text-xs text-muted-foreground mt-0.5">{formatPhone(debt.phone)}</p>
                    )}
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0",
                    debt.status === 'paid' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-warning/10 text-warning'
                  )}>
                    {debt.status}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary transition-all duration-300" 
                      style={{ width: `${debt.percentage_paid}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      ${debt.amount_paid.toLocaleString()} / ${debt.total_amount.toLocaleString()}
                    </span>
                    <span className={cn(
                      "font-medium",
                      isOverdue(debt.due_date) ? 'text-destructive' : 'text-muted-foreground'
                    )}>
                      Due: {new Date(debt.due_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <TrendingUp className="w-12 h-12 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-muted-foreground">No debtors yet</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/debtors/add')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Debtor
            </Button>
          </div>
        )}
      </div>

      {selectedDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedDebt(null)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Debt Details</h2>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEdit(selectedDebt)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setDeleteConfirm({ id: selectedDebt.id, name: selectedDebt.name })}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setSelectedDebt(null)}>
                  <span className="text-2xl">&times;</span>
                </Button>
              </div>
            </div>
            
            <div className="p-6 rounded-xl mb-4 bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-muted-foreground mb-1">Amount Owed</p>
              <h3 className="text-3xl font-bold text-destructive">
                ${selectedDebt.amount_remaining.toLocaleString()}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                Paid: ${selectedDebt.amount_paid.toLocaleString()} ({Math.round(selectedDebt.percentage_paid)}%)
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{selectedDebt.name}</p>
              </div>
              
              {selectedDebt.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{formatPhone(selectedDebt.phone)}</p>
                </div>
              )}
              
              <div>
                <p className="text-xs text-muted-foreground">Total Amount</p>
                <p className="font-medium">${selectedDebt.total_amount.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Due Date</p>
                <p className={cn(
                  "font-medium",
                  isOverdue(selectedDebt.due_date) ? 'text-destructive' : ''
                )}>
                  {new Date(selectedDebt.due_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn(
                  "inline-block px-3 py-1 rounded-full text-xs font-medium capitalize",
                  selectedDebt.status === 'paid' 
                    ? 'bg-success/10 text-success' 
                    : 'bg-warning/10 text-warning'
                )}>
                  {selectedDebt.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mt-6">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.open(generateWhatsAppLink({ name: selectedDebt.name, phone_number: selectedDebt.phone, amount_remaining: selectedDebt.amount_remaining, due_date: selectedDebt.due_date }), '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Reminder via WhatsApp
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  setSelectedDebt(null);
                  navigate(`/debtors/${selectedDebt.id}/manage`);
                }}
              >
                View Full Details
              </Button>
              <Button 
                className="w-full"
                onClick={() => {
                  setSelectedDebt(null);
                  navigate(`/debtors/${selectedDebt.id}/payment`);
                }}
              >
                Record Payment
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Delete Debtor?</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirm.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting === deleteConfirm.id}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
