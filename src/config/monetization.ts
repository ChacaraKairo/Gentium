export const donationFixedAmounts = [2, 5, 10, 20, 30, 50, 70, 100, 150, 200] as const;

export const donationConfig = {
  asaasBillingType: process.env.EXPO_PUBLIC_ASAAS_BILLING_TYPE ?? 'PIX',
  asaasCheckoutUrl: process.env.EXPO_PUBLIC_ASAAS_DONATION_CHECKOUT_URL ?? '',
  asaasEnvironment: process.env.EXPO_PUBLIC_ASAAS_ENVIRONMENT ?? 'sandbox',
  asaasPaymentLinks: {
    recurring: {
      bankSlip: process.env.EXPO_PUBLIC_ASAAS_DONATION_RECURRING_BOLETO_URL ?? '',
      creditCard: process.env.EXPO_PUBLIC_ASAAS_DONATION_RECURRING_CREDIT_CARD_URL ?? '',
      debitCard: process.env.EXPO_PUBLIC_ASAAS_DONATION_RECURRING_DEBIT_CARD_URL ?? '',
      pix: process.env.EXPO_PUBLIC_ASAAS_DONATION_RECURRING_PIX_URL ?? '',
    },
    single: {
      bankSlip: process.env.EXPO_PUBLIC_ASAAS_DONATION_SINGLE_BOLETO_URL ?? '',
      creditCard: process.env.EXPO_PUBLIC_ASAAS_DONATION_SINGLE_CREDIT_CARD_URL ?? '',
      debitCard: process.env.EXPO_PUBLIC_ASAAS_DONATION_SINGLE_DEBIT_CARD_URL ?? '',
      pix: process.env.EXPO_PUBLIC_ASAAS_DONATION_SINGLE_PIX_URL ?? '',
    },
  },
  paymentGateway: process.env.EXPO_PUBLIC_PAYMENT_GATEWAY ?? 'asaas',
  supportEmail: process.env.EXPO_PUBLIC_GENTIUM_SUPPORT_EMAIL ?? '',
  subscriptionAmount: Number(process.env.EXPO_PUBLIC_ASSINATURA_VALOR ?? '5.00'),
};
