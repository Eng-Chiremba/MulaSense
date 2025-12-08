interface Debtor {
  name: string;
  phone_number?: string;
  amount_remaining: number;
  due_date: string;
}

export const generateWhatsAppLink = (debtor: Debtor): string => {
  const message = `Hello ${debtor.name}, reminder from Mula Sense: You owe $${debtor.amount_remaining.toFixed(2)} due on ${new Date(debtor.due_date).toLocaleDateString()}. Please pay via EcoCash.`;
  const encodedMessage = encodeURIComponent(message);
  
  if (debtor.phone_number) {
    const cleanPhone = debtor.phone_number.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  
  return `https://wa.me/?text=${encodedMessage}`;
};
