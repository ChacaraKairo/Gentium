import { donationConfig } from '@/config/monetization';
import { DonationCheckout } from '@/modules/donations/types';

export function createDonationCheckout(amount: number): DonationCheckout {
  const normalizedAmount = normalizeDonationAmount(amount);

  if (!donationConfig.asaasCheckoutUrl) {
    return {
      amount: normalizedAmount,
      isConfigured: false,
    };
  }

  try {
    const checkoutUrl = new URL(donationConfig.asaasCheckoutUrl);
    checkoutUrl.searchParams.set('amount', normalizedAmount.toFixed(2));
    checkoutUrl.searchParams.set('source', 'gentium-app');

    return {
      amount: normalizedAmount,
      checkoutUrl: checkoutUrl.toString(),
      isConfigured: true,
    };
  } catch {
    return {
      amount: normalizedAmount,
      isConfigured: false,
    };
  }
}

function normalizeDonationAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < 2) {
    return 2;
  }

  return Math.round(amount * 100) / 100;
}
