import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '../components/ScreenHeader';
import { Colors, Typography, Spacing, Radius } from '../theme';
import { APP_VERSION } from '../constants/appVersion';

const SUPPORT_EMAIL = 'calculator@hidroteknik.com.tr';

export const ReportBugScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [screenshotUri, setScreenshotUri] = useState<string | null>(null);

  const pickScreenshot = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('legal.reportBugForm.permissionTitle'), t('legal.reportBugForm.permissionBody'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setScreenshotUri(result.assets[0].uri);
    }
  };

  const submitReport = async () => {
    if (!title.trim() || !steps.trim() || !actual.trim()) {
      Alert.alert(t('legal.reportBugForm.validationTitle'), t('legal.reportBugForm.validationBody'));
      return;
    }

    const isMailAvailable = await MailComposer.isAvailableAsync();
    if (!isMailAvailable) {
      Alert.alert(t('legal.reportBugForm.errorTitle'), t('legal.reportBugForm.errorBody'));
      return;
    }

    const subject = `[Bug] ${title.trim()}`;
    const body = [
      `${t('legal.reportBugForm.emailReporter')}: ${name.trim() || '-'}`,
      `${t('legal.reportBugForm.emailAddress')}: ${email.trim() || '-'}`,
      `${t('legal.reportBugForm.emailPlatform')}: ${Platform.OS} ${String(Platform.Version)}`,
      `${t('legal.reportBugForm.emailAppVersion')}: ${APP_VERSION}`,
      '',
      `${t('legal.reportBugForm.emailStepsHeader')}:`,
      steps.trim(),
      '',
      `${t('legal.reportBugForm.emailExpectedHeader')}:`,
      expected.trim() || '-',
      '',
      `${t('legal.reportBugForm.emailActualHeader')}:`,
      actual.trim(),
    ].join('\n');

    try {
      const result = await MailComposer.composeAsync({
        recipients: [SUPPORT_EMAIL],
        subject,
        body,
        attachments: screenshotUri ? [screenshotUri] : [],
      });

      if (result.status === MailComposer.MailComposerStatus.SENT) {
        Alert.alert(t('legal.reportBugForm.successTitle'), t('legal.reportBugForm.successBody'));
      }
    } catch {
      Alert.alert(t('legal.reportBugForm.errorTitle'), t('legal.reportBugForm.errorBody'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScreenHeader title={t('nav.reportBug')} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Spacing.md + insets.bottom }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>{t('legal.reportBug.title')}</Text>
          <Text style={styles.text}>{t('legal.reportBug.body')}</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t('legal.reportBugForm.formTitle')}</Text>

          <Text style={styles.label}>{t('legal.reportBugForm.name')}</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('legal.reportBugForm.namePlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.email')}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder={t('legal.reportBugForm.emailPlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.title')}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t('legal.reportBugForm.titlePlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.steps')}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={steps}
            onChangeText={setSteps}
            multiline
            textAlignVertical="top"
            placeholder={t('legal.reportBugForm.stepsPlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.expected')}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={expected}
            onChangeText={setExpected}
            multiline
            textAlignVertical="top"
            placeholder={t('legal.reportBugForm.expectedPlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.actual')}</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={actual}
            onChangeText={setActual}
            multiline
            textAlignVertical="top"
            placeholder={t('legal.reportBugForm.actualPlaceholder')}
            placeholderTextColor={Colors.textMuted}
          />

          <Text style={styles.label}>{t('legal.reportBugForm.screenshot')}</Text>
          <TouchableOpacity style={styles.attachButton} onPress={pickScreenshot}>
            <Text style={styles.attachText}>
              {screenshotUri
                ? t('legal.reportBugForm.changeScreenshot')
                : t('legal.reportBugForm.attachScreenshot')}
            </Text>
          </TouchableOpacity>
          {screenshotUri && (
            <Text style={styles.fileInfo}>
              {t('legal.reportBugForm.selected')}: {screenshotUri.split('/').pop()}
            </Text>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
            <Text style={styles.submitText}>{t('legal.reportBugForm.submit')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  text: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  formTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  label: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    minHeight: 90,
  },
  attachButton: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    paddingVertical: 10,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.background,
  },
  attachText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  fileInfo: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 6,
  },
  submitButton: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  submitText: {
    ...Typography.bodyBold,
    color: '#111111',
  },
});
