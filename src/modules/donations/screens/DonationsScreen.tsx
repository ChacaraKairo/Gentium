import { useMemo, useState } from 'react';
import { Linking, Share, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { donationConfig, donationFixedAmounts } from '@/config/monetization';
import { createDonationCheckout } from '@/modules/donations/repositories/donationsRepository';
import { DonationPaymentMethod } from '@/modules/donations/types';
import { AppText, BaseCard, Button, TextInput } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

const paymentMethods: DonationPaymentMethod[] = ['pix', 'bankSlip', 'creditCard', 'debitCard'];

export function DonationsScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [selectedAmount, setSelectedAmount] = useState<number>(donationConfig.subscriptionAmount || 5);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<DonationPaymentMethod>('pix');
  const [customAmount, setCustomAmount] = useState('');
  const [error, setError] = useState<string | null>(null);

  const amount = useMemo(() => {
    const parsedAmount = Number(customAmount.replace(',', '.'));

    if (Number.isFinite(parsedAmount) && parsedAmount >= 2) {
      return parsedAmount;
    }

    return selectedAmount;
  }, [customAmount, selectedAmount]);

  async function supportGentium() {
    setError(null);
    const checkout = createDonationCheckout(amount, selectedPaymentMethod);

    if (!checkout.isConfigured || !checkout.checkoutUrl) {
      setError(t('donations.checkoutNotConfigured'));
      await Share.share({
        message: t('donations.shareMessage', {
          amount: checkout.amount.toFixed(2),
          paymentMethod: t(`donations.paymentMethods.${checkout.paymentMethod}`),
        }),
        title: t('donations.shareTitle'),
      });
      return;
    }

    const canOpen = await Linking.canOpenURL(checkout.checkoutUrl);

    if (!canOpen) {
      setError(t('donations.checkoutError'));
      return;
    }

    await Linking.openURL(checkout.checkoutUrl);
  }

  return (
    <Screen subtitle={t('donations.subtitle')} title={t('donations.title')}>
      <BaseCard style={{ gap: theme.spacing.sm }}>
        <AppText variant="heading">{t('donations.heading')}</AppText>
        <AppText color="textSecondary">{t('donations.description')}</AppText>
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('donations.amountTitle')}</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {donationFixedAmounts.map((fixedAmount) => (
            <Button
              key={fixedAmount}
              label={t('donations.fixedAmount', { amount: fixedAmount })}
              onPress={() => {
                setSelectedAmount(fixedAmount);
                setCustomAmount('');
              }}
              variant={!customAmount && selectedAmount === fixedAmount ? 'primary' : 'secondary'}
            />
          ))}
        </View>
        <TextInput
          accessibilityLabel={t('donations.customAmountLabel')}
          keyboardType="decimal-pad"
          onChangeText={setCustomAmount}
          placeholder={t('donations.customAmountPlaceholder')}
          value={customAmount}
        />
        <AppText color="textSecondary" variant="caption">
          {t('donations.selectedAmount', { amount: amount.toFixed(2) })}
        </AppText>
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('donations.paymentMethodTitle')}</AppText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {paymentMethods.map((paymentMethod) => (
            <Button
              key={paymentMethod}
              label={t(`donations.paymentMethods.${paymentMethod}`)}
              onPress={() => setSelectedPaymentMethod(paymentMethod)}
              variant={selectedPaymentMethod === paymentMethod ? 'primary' : 'secondary'}
            />
          ))}
        </View>
        <AppText color="textSecondary" variant="caption">
          {t('donations.paymentMethodDescription')}
        </AppText>
      </BaseCard>

      <BaseCard style={{ gap: theme.spacing.md }}>
        <AppText variant="heading">{t('donations.checkoutTitle')}</AppText>
        <AppText color="textSecondary">
          {t('donations.checkoutSummary', {
            amount: amount.toFixed(2),
            paymentMethod: t(`donations.paymentMethods.${selectedPaymentMethod}`),
          })}
        </AppText>
        {error ? <AppText color="danger">{error}</AppText> : null}
        <Button label={t('donations.action')} onPress={supportGentium} />
      </BaseCard>
    </Screen>
  );
}
