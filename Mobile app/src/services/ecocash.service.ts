import api from './api';

export interface EcoCashPayment {
  id: number;
  customer_msisdn: string;
  amount: number;
  currency: 'USD' | 'ZIG';
  currency_display: string;
  reason: string;
  source_reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  status_display: string;
  ecocash_transaction_id?: string;
  response_data?: any;
  error_message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface SendMoneyRequest {
  recipient_msisdn: string;
  amount: number;
  reason?: string;
  currency?: 'USD' | 'ZIG';
}

export interface BuyAirtimeRequest {
  phone_number: string;
  amount: number;
  currency?: 'USD' | 'ZIG';
}

export interface PayMerchantRequest {
  merchant_code: string;
  amount: number;
  reason?: string;
  currency?: 'USD' | 'ZIG';
}

export interface ManualPaymentRequest {
  customer_msisdn: string;
  amount: number;
  reason?: string;
  currency?: 'USD' | 'ZIG';
}

export interface AutomaticBillPayment {
  id: number;
  bill_name: string;
  recipient_msisdn: string;
  amount: number;
  currency: 'USD' | 'ZIG';
  currency_display: string;
  reason: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  frequency_display: string;
  next_payment_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

class EcoCashService {
  private baseUrl = '/ecocash';

  /**
   * Send money to another EcoCash user
   */
  async sendMoney(data: SendMoneyRequest): Promise<EcoCashPayment> {
    const response = await api.post(`${this.baseUrl}/send-money/`, data);
    return response.data;
  }

  /**
   * Buy airtime using EcoCash
   */
  async buyAirtime(data: BuyAirtimeRequest): Promise<EcoCashPayment> {
    const response = await api.post(`${this.baseUrl}/buy-airtime/`, data);
    return response.data;
  }

  /**
   * Pay merchant using EcoCash
   */
  async payMerchant(data: PayMerchantRequest): Promise<EcoCashPayment> {
    const response = await api.post(`${this.baseUrl}/pay-merchant/`, data);
    return response.data;
  }

  /**
   * Manual EcoCash payment
   */
  async manualPayment(data: ManualPaymentRequest): Promise<EcoCashPayment> {
    const response = await api.post(`${this.baseUrl}/manual-payment/`, data);
    return response.data;
  }

  /**
   * Get all EcoCash payments for current user
   */
  async getPayments(): Promise<EcoCashPayment[]> {
    const response = await api.get(`${this.baseUrl}/payments/`);
    return response.data.results || response.data;
  }

  /**
   * Get payment status by source reference
   */
  async getPaymentStatus(sourceReference: string): Promise<EcoCashPayment> {
    const response = await api.get(`${this.baseUrl}/payment-status/${sourceReference}/`);
    return response.data;
  }

  /**
   * Get all automatic bill payments
   */
  async getAutomaticPayments(): Promise<AutomaticBillPayment[]> {
    const response = await api.get(`${this.baseUrl}/auto-payments/`);
    return response.data.results || response.data;
  }

  /**
   * Create automatic bill payment
   */
  async createAutomaticPayment(data: Partial<AutomaticBillPayment>): Promise<AutomaticBillPayment> {
    const response = await api.post(`${this.baseUrl}/auto-payments/`, data);
    return response.data;
  }

  /**
   * Update automatic bill payment
   */
  async updateAutomaticPayment(id: number, data: Partial<AutomaticBillPayment>): Promise<AutomaticBillPayment> {
    const response = await api.patch(`${this.baseUrl}/auto-payments/${id}/`, data);
    return response.data;
  }

  /**
   * Delete automatic bill payment
   */
  async deleteAutomaticPayment(id: number): Promise<void> {
    await api.delete(`${this.baseUrl}/auto-payments/${id}/`);
  }

  /**
   * Format phone number for EcoCash (ensure 263 prefix)
   */
  static formatPhoneNumber(phone: string): string {
    // Remove any spaces or special characters
    phone = phone.replace(/[\s\-\(\)]/g, '');
    
    // Handle different formats
    if (phone.startsWith('+263')) {
      return phone.substring(1); // Remove +
    } else if (phone.startsWith('263')) {
      return phone; // Already correct
    } else if (phone.startsWith('0')) {
      return '263' + phone.substring(1); // Replace 0 with 263
    } else if (phone.length === 9) {
      return '263' + phone; // Add 263 prefix
    }
    
    return phone; // Return as is if format unclear
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const formatted = this.formatPhoneNumber(phone);
    // Zimbabwe phone numbers: 263 + 9 digits (77, 78, 71, 73, 74, etc.)
    return /^263[0-9]{9}$/.test(formatted);
  }

  /**
   * Get payment status color for UI
   */
  static getStatusColor(status: string): string {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'processing':
        return 'text-blue-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }

  /**
   * Get currency symbol
   */
  static getCurrencySymbol(currency: string): string {
    switch (currency) {
      case 'USD':
        return '$';
      case 'ZIG':
        return 'ZG';
      default:
        return currency;
    }
  }
}

export { EcoCashService };
export default new EcoCashService();