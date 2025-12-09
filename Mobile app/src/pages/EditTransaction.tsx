import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, DollarSign, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { transactionAPI } from '@/services/api';
import axios from 'axios';

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    transaction_type: 'expense',
    category: '',
    transaction_date: '',
    notes: '',
  });

  useEffect(() => {
    fetchCategories();
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    const txn = location.state?.transaction;
    if (txn) {
      setFormData({
        description: txn.description || '',
        amount: txn.amount?.toString() || '',
        transaction_type: txn.transaction_type || 'expense',
        category: txn.category || '',
        transaction_date: txn.transaction_date || '',
        notes: txn.notes || '',
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const response = await axios.get(`${baseURL}/accounting/categories/`, {
        headers: token ? { Authorization: `Token ${token}` } : {}
      });
      const data = response.data.results || response.data || [];
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);
    try {
      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        transaction_type: formData.transaction_type,
        category: formData.category,
        transaction_date: formData.transaction_date,
        notes: formData.notes || '',
        status: 'completed',
      };

      await transactionAPI.update(id!, transactionData);
      
      toast({
        title: 'Success',
        description: 'Transaction updated successfully',
      });
      
      navigate('/transactions');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = Array.isArray(categories) 
    ? categories.filter(cat => cat.category_type === formData.transaction_type)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Edit Transaction</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {['income', 'expense', 'transfer'].map((type) => (
              <Button
                key={type}
                type="button"
                variant={formData.transaction_type === type ? 'default' : 'outline'}
                onClick={() => setFormData({ ...formData, transaction_type: type, category: '' })}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            required
          >
            <option value="">Select category</option>
            {filteredCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              id="description"
              placeholder="e.g., Grocery shopping"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="date"
              type="date"
              value={formData.transaction_date}
              onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Updating...' : 'Update Transaction'}
        </Button>
      </form>
    </div>
  );
}
