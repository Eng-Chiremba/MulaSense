import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, FileText, Tag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { transactionAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export default function TransactionDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await transactionAPI.getAll();
      const allTxns = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      const found = allTxns.find((t: any) => t.id == id);
      setTransaction(found);
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      await transactionAPI.delete(id!);
      toast({
        title: 'Transaction deleted',
      });
      navigate('/transactions');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Transaction not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Transaction Details</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="w-5 h-5 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-lg mx-auto">
        {/* Amount Card */}
        <div className={`p-6 rounded-2xl ${
          transaction.transaction_type === 'income' 
            ? 'bg-success/10 border border-success/20' 
            : 'bg-destructive/10 border border-destructive/20'
        }`}>
          <p className="text-sm text-muted-foreground mb-2">Amount</p>
          <h2 className={`text-4xl font-bold ${
            transaction.transaction_type === 'income' ? 'text-success' : 'text-destructive'
          }`}>
            {transaction.transaction_type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 capitalize">
            {transaction.transaction_type}
          </p>
        </div>

        {/* Details */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="font-medium">{transaction.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="font-medium">{transaction.category_name || transaction.category?.name || 'Uncategorized'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="font-medium">
                {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {transaction.notes && (
            <div className="flex items-start gap-3 pt-3 border-t border-border">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{transaction.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              transaction.status === 'completed' 
                ? 'bg-success/10 text-success' 
                : 'bg-warning/10 text-warning'
            }`}>
              {transaction.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
