import { Capacitor } from '@capacitor/core';
import UssdPlugin from '@/plugins/ussd';

export const ussdService = {
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
  }
};
