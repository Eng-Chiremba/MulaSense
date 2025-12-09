import { Capacitor } from '@capacitor/core';
import UssdPlugin from '@/plugins/ussd';
import ecocashService from './ecocash.service';

export interface USSDTransaction {
  type: 'send_money' | 'buy_airtime' | 'pay_merchant' | 'balance_inquiry';
  amount?: number;
  recipient?: string;
  merchant_code?: string;
  currency?: 'USD' | 'ZIG';
  reason?: string;
}

export const ussdService = {
  /**
   * Execute USSD code directly (legacy method)
   */
  async executeUSSD(ussdCode: string): Promise<{ success: boolean; response?: string }> {
    if (Capacitor.getPlatform() === 'android') {
      try {
        const permCheck = await UssdPlugin.checkPermission();
        if (!permCheck.granted) {
          const permResult = await UssdPlugin.requestPermission();
          if (!permResult.granted) {
            throw new Error('CALL_PHONE permission denied');
          }
        }
        const result = await UssdPlugin.executeUssd({ ussdCode });
        return result;
      } catch (e: any) {
        throw new Error(e.message || 'USSD execution failed');
      }
    } else {
      throw new Error('USSD is only supported on Android');
    }
  },

  /**
   * Execute EcoCash transaction using API (recommended method)
   */
  async executeEcoCashTransaction(transaction: USSDTransaction): Promise<any> {
    try {
      switch (transaction.type) {
        case 'send_money':
          if (!transaction.recipient || !transaction.amount) {
            throw new Error('Recipient and amount are required for send money');
          }
          return await ecocashService.sendMoney({
            recipient_msisdn: ecocashService.constructor.formatPhoneNumber(transaction.recipient),
            amount: transaction.amount,
            reason: transaction.reason || 'Money transfer',
            currency: transaction.currency || 'USD'
          });

        case 'buy_airtime':
          if (!transaction.recipient || !transaction.amount) {
            throw new Error('Phone number and amount are required for airtime');
          }
          return await ecocashService.buyAirtime({
            phone_number: ecocashService.constructor.formatPhoneNumber(transaction.recipient),
            amount: transaction.amount,
            currency: transaction.currency || 'USD'
          });

        case 'pay_merchant':
          if (!transaction.merchant_code || !transaction.amount) {
            throw new Error('Merchant code and amount are required for merchant payment');
          }
          return await ecocashService.payMerchant({
            merchant_code: transaction.merchant_code,
            amount: transaction.amount,
            reason: transaction.reason || 'Merchant payment',
            currency: transaction.currency || 'USD'
          });

        default:
          throw new Error(`Unsupported transaction type: ${transaction.type}`);
      }
    } catch (error: any) {
      throw new Error(`EcoCash transaction failed: ${error.message}`);
    }
  },

  /**
   * Send money via EcoCash API
   */
  async sendMoney(recipient: string, amount: number, reason?: string, currency: 'USD' | 'ZIG' = 'USD') {
    return this.executeEcoCashTransaction({
      type: 'send_money',
      recipient,
      amount,
      reason,
      currency
    });
  },

  /**
   * Buy airtime via EcoCash API
   */
  async buyAirtime(phoneNumber: string, amount: number, currency: 'USD' | 'ZIG' = 'USD') {
    return this.executeEcoCashTransaction({
      type: 'buy_airtime',
      recipient: phoneNumber,
      amount,
      currency
    });
  },

  /**
   * Pay merchant via EcoCash API
   */
  async payMerchant(merchantCode: string, amount: number, reason?: string, currency: 'USD' | 'ZIG' = 'USD') {
    return this.executeEcoCashTransaction({
      type: 'pay_merchant',
      merchant_code: merchantCode,
      amount,
      reason,
      currency
    });
  },

  /**
   * Generate USSD codes for manual dialing (fallback)
   */
  generateUSSDCodes: {
    sendMoney: (recipient: string, amount: number) => `*151*1*1*${recipient}*${amount}#`,
    buyAirtime: (phoneNumber: string, amount: number) => `*151*2*1*${phoneNumber}*${amount}#`,
    payMerchant: (merchantCode: string, amount: number) => `*151*3*${merchantCode}*${amount}#`,
    balanceInquiry: () => '*151*0#',
    miniStatement: () => '*151*6#'
  },

  /**
   * Hybrid approach: Try API first, fallback to USSD
   */
  async executeHybridTransaction(transaction: USSDTransaction): Promise<any> {
    try {
      // Try API first
      return await this.executeEcoCashTransaction(transaction);
    } catch (apiError) {
      console.warn('API transaction failed, falling back to USSD:', apiError);
      
      // Fallback to USSD
      let ussdCode: string;
      switch (transaction.type) {
        case 'send_money':
          ussdCode = this.generateUSSDCodes.sendMoney(transaction.recipient!, transaction.amount!);
          break;
        case 'buy_airtime':
          ussdCode = this.generateUSSDCodes.buyAirtime(transaction.recipient!, transaction.amount!);
          break;
        case 'pay_merchant':
          ussdCode = this.generateUSSDCodes.payMerchant(transaction.merchant_code!, transaction.amount!);
          break;
        default:
          throw new Error(`Unsupported transaction type for USSD: ${transaction.type}`);
      }
      
      return await this.executeUSSD(ussdCode);
    }
  }
};