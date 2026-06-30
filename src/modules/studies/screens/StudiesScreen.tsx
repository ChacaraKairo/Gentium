import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import {
  completeStudyLesson,
  getStudyAreas,
  getStudyCategories,
  getStudyCourseDetail,
  getStudyCourses,
  getStudyDashboardStats,
  startStudyCourse,
} from '@/modules/studies/repositories/studiesRepository';
import {
  StudyArea,
  StudyCategory,
  StudyCourse,
  StudyCourseDetail,
  StudyDashboardStats,
  StudyLesson,
} from '@/modules/studies/types';
import { MainTabParamList } from '@/navigation/types';
import { AppText, BaseCard, Button, ListItem } from '@/shared/components';
import { Screen } from '@/shared/layouts/Screen';
import { useThemeTokens } from '@/theme/useThemeTokens';

export function StudiesScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<MainTabParamList>>();
  const theme = useThemeTokens();
  const [areas, setAreas] = useState<StudyArea[]>([]);
  const [categories, setCategories] = useState<StudyCategory[]>([]);
  const [courses, setCourses] = useState<StudyCourse[]>([]);
  const [stats, setStats] = useState<StudyDashboardStats | null>(null);
  const [selectedArea, setSelectedArea] = useState<StudyArea | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<StudyCategory | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<StudyCourseDetail | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<StudyLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAreas = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [areaRows, dashboardStats] = await Promise.all([
        getStudyAreas(),
        getStudyDashboardStats(),
      ]);
      setAreas(areaRows);
      setStats(dashboardStats);
    } catch {
      setError(t('studies.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadAreas();
  }, [loadAreas]);

  const openArea = useCallback(
    async (area: StudyArea) => {
      setIsLoading(true);
      setError(null);

      try {
        setSelectedArea(area);
        setSelectedCategory(null);
        setSelectedCourse(null);
        setSelectedLesson(null);
        setCourses([]);
        setCategories(await getStudyCategories(area.id));
      } catch {
        setError(t('studies.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const openCategory = useCallback(
    async (category: StudyCategory) => {
      setIsLoading(true);
      setError(null);

      try {
        setSelectedCategory(category);
        setSelectedCourse(null);
        setSelectedLesson(null);
        setCourses(await getStudyCourses(category.id));
      } catch {
        setError(t('studies.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const openCourse = useCallback(
    async (courseId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const detail = await getStudyCourseDetail(courseId);
        setSelectedCourse(detail);
        setSelectedLesson(null);
      } catch {
        setError(t('studies.errors.load'));
      } finally {
        setIsLoading(false);
      }
    },
    [t],
  );

  const startCourse = useCallback(async () => {
    if (!selectedCourse) {
      return;
    }

    await startStudyCourse(selectedCourse.id);
    await openCourse(selectedCourse.id);
    setStats(await getStudyDashboardStats());
  }, [openCourse, selectedCourse]);

  const continueStudy = useCallback(async () => {
    if (!stats?.nextLesson) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const detail = await getStudyCourseDetail(stats.nextLesson.courseId);
      const lesson = detail?.modules
        .flatMap((module) => module.lessons)
        .find((item) => item.id === stats.nextLesson?.lessonId);

      setSelectedArea(null);
      setSelectedCategory(null);
      setSelectedCourse(detail);
      setSelectedLesson(lesson ?? null);
    } catch {
      setError(t('studies.errors.load'));
    } finally {
      setIsLoading(false);
    }
  }, [stats?.nextLesson, t]);

  const completeLesson = useCallback(async () => {
    if (!selectedCourse || !selectedLesson) {
      return;
    }

    await completeStudyLesson(selectedCourse.id, selectedLesson.id);
    const detail = await getStudyCourseDetail(selectedCourse.id);
    const lesson = detail?.modules
      .flatMap((module) => module.lessons)
      .find((item) => item.id === selectedLesson.id);
    setSelectedCourse(detail);
    setSelectedLesson(lesson ?? null);
    setStats(await getStudyDashboardStats());
  }, [selectedCourse, selectedLesson]);

  const openBibleReference = useCallback(
    (initialReference: string) => {
      navigation.navigate('Bible', { initialReference });
    },
    [navigation],
  );

  const goBack = useCallback(() => {
    if (selectedLesson) {
      setSelectedLesson(null);
      return;
    }

    if (selectedCourse) {
      setSelectedCourse(null);
      return;
    }

    if (selectedCategory) {
      setSelectedCategory(null);
      setCourses([]);
      return;
    }

    if (selectedArea) {
      setSelectedArea(null);
      setCategories([]);
    }
  }, [selectedArea, selectedCategory, selectedCourse, selectedLesson]);

  const title = selectedLesson?.title ?? selectedCourse?.title ?? selectedCategory?.title ?? selectedArea?.title;

  return (
    <Screen subtitle={t('studies.subtitle')} title={title ?? t('studies.title')}>
      {selectedArea || selectedCourse || selectedLesson ? (
        <Button label={t('common.back')} onPress={goBack} variant="ghost" />
      ) : null}

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

      {!isLoading && !selectedArea ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.xs }}>
            <AppText variant="heading">{t('studies.libraryTitle')}</AppText>
            <AppText color="textSecondary">{t('studies.libraryDescription')}</AppText>
          </BaseCard>
          {stats ? (
            <BaseCard style={{ gap: theme.spacing.sm }}>
              <AppText variant="heading">{t('studies.statsTitle')}</AppText>
              <AppText color="textSecondary">
                {t('studies.statsSummary', {
                  active: stats.activeCourses,
                  completedCourses: stats.completedCourses,
                  completedLessons: stats.completedLessons,
                  courses: stats.totalCourses,
                  lessons: stats.totalLessons,
                  progress: stats.progressPercent,
                })}
              </AppText>
              {stats.nextLesson ? (
                <View style={{ gap: theme.spacing.xs }}>
                  <AppText color="textSecondary" variant="caption">
                    {t('studies.nextLesson', {
                      course: stats.nextLesson.courseTitle,
                      lesson: stats.nextLesson.lessonTitle,
                      progress: stats.nextLesson.progressPercent,
                    })}
                  </AppText>
                  <Button label={t('studies.continueCourse')} onPress={continueStudy} />
                </View>
              ) : null}
            </BaseCard>
          ) : null}
          {areas.map((area) => (
            <ListItem
              description={t('studies.areaSummary', {
                courses: area.courseCount,
                lessons: area.lessonCount,
                progress: area.progressPercent,
              })}
              icon="library-outline"
              key={area.id}
              onPress={() => openArea(area)}
              title={area.title}
            />
          ))}
        </View>
      ) : null}

      {!isLoading && selectedArea && !selectedCategory ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.xs }}>
            <AppText>{selectedArea.description}</AppText>
            <ProgressLine completed={selectedArea.completedLessons} total={selectedArea.lessonCount} />
          </BaseCard>
          {categories.map((category) => (
            <ListItem
              description={t('studies.categorySummary', {
                courses: category.courseCount,
                lessons: category.lessonCount,
                progress: category.progressPercent,
              })}
              icon="folder-open-outline"
              key={category.id}
              onPress={() => openCategory(category)}
              title={category.title}
            />
          ))}
        </View>
      ) : null}

      {!isLoading && selectedCategory && !selectedCourse ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.xs }}>
            <AppText>{selectedCategory.description}</AppText>
            <ProgressLine completed={selectedCategory.completedLessons} total={selectedCategory.lessonCount} />
          </BaseCard>
          {courses.map((course) => (
            <ListItem
              description={t('studies.courseSummary', {
                lessons: course.lessonCount,
                minutes: course.estimatedMinutes,
                progress: course.progressPercent,
              })}
              icon={course.completedAt ? 'checkmark-circle-outline' : 'school-outline'}
              key={course.id}
              onPress={() => openCourse(course.id)}
              title={course.title}
            />
          ))}
        </View>
      ) : null}

      {!isLoading && selectedCourse && !selectedLesson ? (
        <View style={{ gap: theme.spacing.md }}>
          <BaseCard style={{ gap: theme.spacing.sm }}>
            <AppText>{selectedCourse.description}</AppText>
            <AppText color="textSecondary" variant="caption">
              {t('studies.courseMeta', {
                level: t(`studies.levels.${selectedCourse.level}`),
                minutes: selectedCourse.estimatedMinutes,
              })}
            </AppText>
            <ProgressLine completed={selectedCourse.completedLessons} total={selectedCourse.lessonCount} />
            <Button
              label={selectedCourse.isStarted ? t('studies.continueCourse') : t('studies.startCourse')}
              onPress={startCourse}
            />
          </BaseCard>

          {selectedCourse.modules.map((module) => (
            <BaseCard key={module.id} style={{ gap: theme.spacing.sm }}>
              <AppText variant="heading">{module.title}</AppText>
              <AppText color="textSecondary">{module.description}</AppText>
              {module.lessons.map((lesson) => (
                <ListItem
                  description={t('studies.lessonSummary', { minutes: lesson.estimatedMinutes })}
                  icon={lesson.completedAt ? 'checkmark-circle-outline' : 'document-text-outline'}
                  key={lesson.id}
                  onPress={() => setSelectedLesson(lesson)}
                  title={lesson.title}
                />
              ))}
            </BaseCard>
          ))}
        </View>
      ) : null}

      {selectedCourse && selectedLesson ? (
        <BaseCard style={{ gap: theme.spacing.md }}>
          <AppText color="textSecondary">{selectedLesson.summary}</AppText>
          <AppText>{selectedLesson.content}</AppText>
          {selectedLesson.references.length ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
              {selectedLesson.references.map((reference) => (
                <Button
                  key={reference}
                  label={reference}
                  onPress={() => openBibleReference(reference)}
                  variant="secondary"
                />
              ))}
            </View>
          ) : null}
          <Button
            label={
              selectedLesson.completedAt
                ? t('studies.lessonCompleted')
                : t('studies.completeLesson')
            }
            onPress={completeLesson}
            variant={selectedLesson.completedAt ? 'secondary' : 'primary'}
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
      {t('studies.progress', { completed, total })}
    </AppText>
  );
}
