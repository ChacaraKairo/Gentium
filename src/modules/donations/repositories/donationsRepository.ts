import { donationConfig } from '@/config/monetization';
import {
  DonationCheckout,
  DonationFrequency,
  DonationPaymentMethod,
} from '@/modules/donations/types';

export function createDonationCheckout(
  amount: number,
  paymentMethod: DonationPaymentMethod,
  frequency: DonationFrequency,
): DonationCheckout {
  const normalizedAmount = normalizeDonationAmount(amount);
  const billingType = getAsaasBillingType(paymentMethod);
  const chargeType = frequency === 'recurring' ? 'RECURRENT' : 'DETACHED';

  if (!donationConfig.asaasCheckoutUrl) {
    return {
      amount: normalizedAmount,
      billingType,
      chargeType,
      frequency,
      isConfigured: false,
      paymentMethod,
    };
  }

  try {
    const checkoutUrl = new URL(donationConfig.asaasCheckoutUrl);
    checkoutUrl.searchParams.set('amount', normalizedAmount.toFixed(2));
    checkoutUrl.searchParams.set('billingType', billingType);
    checkoutUrl.searchParams.set('chargeType', chargeType);
    checkoutUrl.searchParams.set('frequency', frequency);
    checkoutUrl.searchParams.set('gateway', donationConfig.paymentGateway);
    checkoutUrl.searchParams.set('paymentMethod', paymentMethod);
    checkoutUrl.searchParams.set('subscriptionCycle', 'MONTHLY');
    checkoutUrl.searchParams.set('source', 'gentium-app');

    return {
      amount: normalizedAmount,
      billingType,
      chargeType,
      checkoutUrl: checkoutUrl.toString(),
      frequency,
      isConfigured: true,
      paymentMethod,
    };
  } catch {
    return {
      amount: normalizedAmount,
      billingType,
      chargeType,
      frequency,
      isConfigured: false,
      paymentMethod,
    };
  }
}

function normalizeDonationAmount(amount: number) {
  if (!Number.isFinite(amount) || amount < 2) {
    return 2;
  }

  return Math.round(amount * 100) / 100;
}

function getAsaasBillingType(paymentMethod: DonationPaymentMethod) {
  if (paymentMethod === 'bankSlip') {
    return 'BOLETO';
  }

  if (paymentMethod === 'creditCard') {
    return 'CREDIT_CARD';
  }

  if (paymentMethod === 'debitCard') {
    return 'UNDEFINED';
  }

  return 'PIX';
}
