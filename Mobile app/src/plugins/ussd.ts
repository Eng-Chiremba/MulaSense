import { registerPlugin } from '@capacitor/core';

export interface UssdPlugin {
  executeUssd(options: { ussdCode: string }): Promise<{ success: boolean; response?: string }>;
}

const UssdPlugin = registerPlugin<UssdPlugin>('UssdPlugin');

export default UssdPlugin;
