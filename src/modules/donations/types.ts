export type DonationPaymentMethod = 'bankSlip' | 'creditCard' | 'debitCard' | 'pix';

export type DonationCheckout = {
  amount: number;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  checkoutUrl?: string;
  isConfigured: boolean;
  paymentMethod: DonationPaymentMethod;
};
