interface Debtor {
  name: string;
  phone_number?: string;
  amount_remaining: number;
  due_date: string;
}

export function generateWhatsAppLink(debtor: Debtor, userPhone?: string): string {
  const message = `Hello ${debtor.name}, this is a friendly reminder from Mula Sense regarding your outstanding balance of $${debtor.amount_remaining.toFixed(2)}. The due date is ${new Date(debtor.due_date).toLocaleDateString()}. Please kindly make the payment via EcoCash to ${userPhone || 'the provided number'}. Thank you!`;
  
  const encodedMessage = encodeURIComponent(message);
  
  if (debtor.phone_number) {
    const cleanPhone = debtor.phone_number.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  
  return `https://wa.me/?text=${encodedMessage}`;
}
