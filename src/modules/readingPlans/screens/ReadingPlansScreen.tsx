import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  completeReadingPlanDay,
  getReadingPlanDetail,
  getReadingPlans,
  startReadingPlan,
} from '@/modules/readingPlans/repositories/readingPlansRepository';
import {
  ReadingPlan,
  ReadingPlanDay,
  ReadingPlanDetail,
} from '@/modules/readingPlans/types';
import { AppText, BaseCard, Button, ListItem } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function ReadingPlansScreen() {
  const { t } = useTranslation();
  const theme = useThemeTokens();
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlanDetail | null>(null);
  const [selectedDay, setSelectedDay] = useState<ReadingPlanDay | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setPlans(await getReadingPlans());
    } catch {
      setError(t('readingPlans.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const openPlan = useCallback(
    async (planId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        setSelectedPlan(await getReadingPlanDetail(planId));
        setSelectedDay(null);
      } catch {
        setError(t('readingPlans.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const startPlan = useCallback(async () => {
    if (!selectedPlan) {
      return;
    }

    await startReadingPlan(selectedPlan.id);
    await openPlan(selectedPlan.id);
  }, [openPlan, selectedPlan]);

  const completeDay = useCallback(async () => {
    if (!selectedPlan || !selectedDay) {
      return;
    }

    await completeReadingPlanDay(selectedPlan.id, selectedDay.id, selectedDay.dayNumber);
    const detail = await getReadingPlanDetail(selectedPlan.id);
    const day = detail?.days.find((item) => item.id === selectedDay.id);
    setSelectedPlan(detail);
    setSelectedDay(day ?? null);
  }, [selectedDay, selectedPlan]);

  const goBack = useCallback(() => {
    if (selectedDay) {
      setSelectedDay(null);
      return;
    }

    if (selectedPlan) {
      setSelectedPlan(null);
      setPlans((current) => current);
      loadPlans();
    }
  }, [loadPlans, selectedDay, selectedPlan]);

  return (
    <Screen
      subtitle={t('readingPlans.subtitle')}
      title={selectedDay?.title ?? selectedPlan?.title ?? t('readingPlans.title')}
    >
      {selectedPlan ? <Button label={t('common.back')} onPress={goBack} variant="ghost" /> : null}

      {error ? (
        <BaseCard>
          <AppText color="danger">{error}</AppText>
        </BaseCard>
      ) : null}

      {isLoading ? (
        <BaseCard>
          <AppText color="textSecondary">{t('common.loading')}</AppText>
        </BaseCard>
      ) : null}

      {!isLoading && !selectedPlan ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.xs }}>
            <AppText variant="heading">{t('readingPlans.libraryTitle')}</AppText>
            <AppText color="textSecondary">{t('readingPlans.libraryDescription')}</AppText>
          </BaseCard>

          {plans.map((plan) => (
            <ListItem
              description={t('readingPlans.planSummary', {
                days: plan.durationDays,
                minutes: plan.dailyMinutes,
                progress: plan.progressPercent,
              })}
              icon={plan.completedAt ? 'checkmark-circle-outline' : 'calendar-outline'}
              key={plan.id}
              onPress={() => openPlan(plan.id)}
              title={plan.title}
            />
          ))}
        </View>
      ) : null}

      {!isLoading && selectedPlan && !selectedDay ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText>{selectedPlan.description}</AppText>
            <AppText color="textSecondary">{selectedPlan.objective}</AppText>
            <AppText color="textSecondary" variant="caption">
              {t('readingPlans.planMeta', {
                author: selectedPlan.author,
                category: selectedPlan.category,
                days: selectedPlan.durationDays,
                level: t(`readingPlans.levels.${selectedPlan.level}`),
                minutes: selectedPlan.dailyMinutes,
              })}
            </AppText>
            <ProgressLine completed={selectedPlan.completedDays} total={selectedPlan.durationDays} />
            <Button
              label={selectedPlan.isStarted ? t('readingPlans.continuePlan') : t('readingPlans.startPlan')}
              onPress={startPlan}
            />
          </BaseCard>

          {selectedPlan.currentDay ? (
            <BaseCard style={{ gap: theme.spacing.sm }}>
              <AppText variant="heading">{t('readingPlans.todayTitle')}</AppText>
              <ListItem
                description={selectedPlan.currentDay.objective}
                icon={selectedPlan.currentDay.completedAt ? 'checkmark-circle-outline' : 'sunny-outline'}
                onPress={() => setSelectedDay(selectedPlan.currentDay ?? null)}
                title={t('readingPlans.dayTitle', {
                  day: selectedPlan.currentDay.dayNumber,
                  title: selectedPlan.currentDay.title,
                })}
              />
            </BaseCard>
          ) : null}

          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">{t('readingPlans.statsTitle')}</AppText>
            <AppText color="textSecondary">
              {t('readingPlans.statsSummary', {
                completed: selectedPlan.stats.completedDays,
                remaining: selectedPlan.stats.remainingDays,
                streak: selectedPlan.stats.currentStreak,
              })}
            </AppText>
          </BaseCard>

          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText variant="heading">{t('readingPlans.historyTitle')}</AppText>
            {selectedPlan.days.map((day) => (
              <ListItem
                description={day.completedAt ? t('readingPlans.completedDay') : day.objective}
                icon={day.completedAt ? 'checkmark-circle-outline' : 'ellipse-outline'}
                key={day.id}
                onPress={() => setSelectedDay(day)}
                title={t('readingPlans.dayTitle', { day: day.dayNumber, title: day.title })}
              />
            ))}
          </BaseCard>
        </View>
      ) : null}

      {selectedPlan && selectedDay ? (
        <BaseCard style={{ gap: theme.spacing.md }}>
          <AppText color="primary" variant="caption">
            {t('readingPlans.dayNumber', { day: selectedDay.dayNumber })}
          </AppText>
          <AppText color="textSecondary">{selectedDay.objective}</AppText>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
            {selectedDay.readings.map((reference) => (
              <Button key={reference} label={reference} onPress={() => {}} variant="secondary" />
            ))}
          </View>
          <AppText>{selectedDay.reflection}</AppText>
          <AppText color="textSecondary">{selectedDay.prayer}</AppText>
          {selectedDay.questions.map((question) => (
            <AppText color="textSecondary" key={question} variant="caption">
              {question}
            </AppText>
          ))}
          <Button
            label={
              selectedDay.completedAt
                ? t('readingPlans.dayCompleted')
                : t('readingPlans.completeDay')
            }
            onPress={completeDay}
            variant={selectedDay.completedAt ? 'secondary' : 'primary'}
          />
        </BaseCard>
      ) : null}
    </Screen>
  );
}

function ProgressLine({ completed, total }: { completed: number; total: number }) {
  const { t } = useTranslation();

  return (
    <AppText color="textSecondary" variant="caption">
      {t('readingPlans.progress', { completed, total })}
    </AppText>
  );
}
