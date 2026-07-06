import { donationConfig } from '@/config/monetization';
import { DonationCheckout, DonationPaymentMethod } from '@/modules/donations/types';

export function createDonationCheckout(
  amount: number,
  paymentMethod: DonationPaymentMethod,
): DonationCheckout {
  const normalizedAmount = normalizeDonationAmount(amount);
  const billingType = getAsaasBillingType(paymentMethod);

  if (!donationConfig.asaasCheckoutUrl) {
    return {
      amount: normalizedAmount,
      billingType,
      isConfigured: false,
      paymentMethod,
    };
  }

  try {
    const checkoutUrl = new URL(donationConfig.asaasCheckoutUrl);
    checkoutUrl.searchParams.set('amount', normalizedAmount.toFixed(2));
    checkoutUrl.searchParams.set('billingType', billingType);
    checkoutUrl.searchParams.set('gateway', donationConfig.paymentGateway);
    checkoutUrl.searchParams.set('paymentMethod', paymentMethod);
    checkoutUrl.searchParams.set('source', 'gentium-app');

    return {
      amount: normalizedAmount,
      billingType,
      checkoutUrl: checkoutUrl.toString(),
      isConfigured: true,
      paymentMethod,
    };
  } catch {
    return {
      amount: normalizedAmount,
      billingType,
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
