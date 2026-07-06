export type DonationFrequency = 'recurring' | 'single';

export type DonationPaymentMethod = 'bankSlip' | 'creditCard' | 'debitCard' | 'pix';

export type DonationCheckout = {
  amount: number;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  chargeType: 'DETACHED' | 'RECURRENT';
  checkoutUrl?: string;
  frequency: DonationFrequency;
  isConfigured: boolean;
  paymentMethod: DonationPaymentMethod;
};
