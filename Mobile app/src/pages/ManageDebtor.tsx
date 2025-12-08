import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface Item {
  id?: number;
  description: string;
  quantity: number;
  unit_price: number | string;
  total_price: number | string;
}

export default function ManageDebtor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDebtor();
    }
  }, [id]);

  const fetchDebtor = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/`, {
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setName(data.name);
      setPhone(data.phone || '');
      setEmail(data.email || '');
      setAddress(data.address || '');
      setDueDate(data.due_date);
      if (data.items && data.items.length > 0) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to fetch debtor:', error);
      toast({
        title: 'Error',
        description: 'Failed to load debtor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total_price = Number(newItems[index].quantity) * Number(newItems[index].unit_price);
    }
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const total_amount = items.reduce((sum, item) => sum + Number(item.total_price), 0);
    const payload = {
      name,
      phone,
      email,
      address,
      total_amount,
      due_date: dueDate,
      items: items.map(item => ({
        description: item.description,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        total_price: Number(item.total_price)
      }))
    };

    try {
      const res = await fetch(`http://localhost:8000/api/debtors/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Debtor updated successfully',
        });
        navigate('/debt-book');
      } else {
        const data = await res.json();
        toast({
          title: 'Error',
          description: data?.detail || 'Failed to update debtor',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
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
        navigate('/debt-book');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete debtor',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: error?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Debtor</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDeleteConfirm(true)}
          className="text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              Add Item
            </Button>
          </div>

          {items.map((item, index) => (
            <div key={index} className="space-y-2 mb-4 p-3 border rounded">
              <Input
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">${Number(item.total_price).toFixed(2)}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-3 rounded">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold">${items.reduce((sum, item) => sum + Number(item.total_price), 0).toFixed(2)}</p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'Saving...' : 'Update Debtor'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/debt-book')}>
            Cancel
          </Button>
        </div>
      </form>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteConfirm(false)}>
          <div className="bg-background rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Delete Debtor?</h2>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold">{name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => handleDelete()}
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
