#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module d'Internationalisation & Multi-langues (i18n) - PRONOS-APP
 * Gère les dictionnaires de traduction pour le Français, l'Anglais, l'Arabe et le Portugais.
 * Intègre la détection et la logique de bascule dynamique d'interface (LTR / RTL).
 * Design épuré respectant la charte graphique de l'entreprise (Vert & Blanc).
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  SafeAreaView,
  I18nManager,
  Platform
} from 'react-native';

export default function LocalizationScreen() {
  // Langue active par défaut de l'application : 'FR' (Français)
  const [selectedLanguage, setSelectedLanguage] = useState('FR'); // FR, EN, AR, PT

  // Base de données locale de traductions (Dictionnaires i18n mémorisés pour la performance)
  const translations = useMemo(() => {
    return {
      FR: {
        title: "PARAMÈTRES DE LANGUE",
        subtitle: "Choisissez votre langue préférée pour l'affichage",
        welcome: "Bienvenue sur PRONOS-APP",
        vipBadge: "👑 ACCÈS VIP PREMIUM",
        homeLabel: "Tableau de bord",
        activeProno: "Pronostics du jour",
        saveBtn: "Enregistrer la configuration",
        alertSuccess: "Configuration enregistrée en Français !"
      },
      EN: {
        title: "LANGUAGE SETTINGS",
        subtitle: "Choose your preferred display language",
        welcome: "Welcome to PRONOS-APP",
        vipBadge: "👑 PREMIUM VIP ACCESS",
        homeLabel: "Main Dashboard",
        activeProno: "Today's Predictions",
        saveBtn: "Save Configuration",
        alertSuccess: "Configuration successfully saved in English!"
      },
      AR: {
        title: "إعدادات اللغة",
        subtitle: "اختر لغة العرض المفضلة لديك",
        welcome: "مرحبًا بكم في PRONOS-APP",
        vipBadge: "👑 وصول كبار الشخصيات المميز",
        homeLabel: "لوحة القيادة الرئيسية",
        activeProno: "توقعات اليوم الحالية",
        saveBtn: "حفظ الإعدادات",
        alertSuccess: "تم حفظ الإعدادات بنجاح باللغة العربية!"
      },
      PT: {
        title: "CONFIGURAÇÕES DE IDIOMA",
        subtitle: "Escolha o seu idioma de exibição preferido",
        welcome: "Bem-vindo ao PRONOS-APP",
        vipBadge: "👑 ACESSO VIP PREMIUM",
        homeLabel: "Painel Principal",
        activeProno: "Prognósticos de hoje",
        saveBtn: "Salvar Configuração",
        alertSuccess: "Configuração salva com sucesso em Português!"
      }
    };
  }, []);

  // Liste immuable des langues supportées avec indicateurs culturels et métadonnées d'orientation
  const languagesList = useMemo(() => [
    { code: 'FR', label: 'Français', flag: '🇫🇷', isRtl: false },
    { code: 'EN', label: 'English', flag: '🇬🇧', isRtl: false },
    { code: 'AR', label: 'العربية (Arabe)', flag: '🇸🇦', isRtl: true },
    { code: 'PT', label: 'Português', flag: '🇵🇹', isRtl: false }
  ], []);

  /**
   * Gestionnaire atomique de changement de langue avec détection de la mise en page Droite-à-Gauche (RTL)
   */
  const handleLanguageChange = useCallback((langCode, isRtl) => {
    setSelectedLanguage(langCode);
    
    // Logique native pour forcer le basculement d'interface pour la langue Arabe (RTL)
    if (I18nManager.isRTL !== isRtl) {
      const isSystemAndroid = Platform.OS === 'android';
      Alert.alert(
        langCode === 'AR' ? "تغيير المخطط" : "Changement de disposition",
        langCode === 'AR' 
          ? "يتطلب تغيير اللغة إلى العربية إعادة تشغيل التطبيق لتطبيق اتجاه النص الجديد."
          : "Le changement de langue nécessite un redémarrage pour appliquer la direction de lecture.",
        [
          { 
            text: "OK", 
            onPress: () => {
              I18nManager.forceRTL(isRtl);
              // Sur Android, un redémarrage de l'activité ou bundle est fortement conseillé en production
              console.log(`[i18n] Direction de lecture modifiée. RTL: ${isRtl}`);
            } 
          }
        ]
      );
    }
  }, []);

  /**
   * Action de validation et de persistance des préférences linguistiques de l'utilisateur
   */
  const handleSavePreferences = useCallback(() => {
    const currentDict = translations[selectedLanguage];
    Alert.alert("🌐 Configuration i18n", currentDict.alertSuccess, [{ text: "Fermer" }]);
  }, [selectedLanguage, translations]);

  // Extraction dynamique des libellés du dictionnaire selon la clé d'état active
  const currentText = translations[selectedLanguage];
  const isCurrentLanguageRtl = selectedLanguage === 'AR';

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* EN-TÊTE CONFIGURATION LOCALE */}
      <View style={styles.localizationHeader}>
        <Text style={[styles.headerTitle, isCurrentLanguageRtl && styles.textRightAlign]}>
          {currentText.title}
        </Text>
        <Text style={[styles.headerSubtitle, isCurrentLanguageRtl && styles.textRightAlign]}>
          {currentText.subtitle}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* GRILLE DES PILULES DE SÉLECTION DE LANGUES */}
        <View style={styles.languagesGroupContainer}>
          {languagesList.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.languagePillCard, isSelected && styles.languagePillCardActive]}
                onPress={() => handleLanguageChange(lang.code, lang.isRtl)}
                activeOpacity={0.75}
              >
                <View style={styles.languageMetaInfoRow}>
                  <Text style={styles.flagIconText}>{lang.flag}</Text>
                  <Text style={[styles.languageLabelName, isSelected && styles.languageLabelNameActive]}>
                    {lang.label}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.checkedIndicatorCircle}>
                    <View style={styles.checkedIndicatorDot} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* COMPOSANT DE PREVIEW DYNAMIQUE POUR LE VALIDATION DE FLUX TEXTE */}
        <Text style={[styles.sectionDividerTitle, isCurrentLanguageRtl && styles.textRightAlign]}>
          {isCurrentLanguageRtl ? 'معاينة حية ومباشرة' : 'Aperçu en temps réel'}
        </Text>
        
        <View style={styles.previewComponentMockCard}>
          <View style={[styles.premiumVipBadgeRow, isCurrentLanguageRtl && { alignSelf: 'flex-end' }]}>
            <Text style={styles.premiumVipBadgeRowText}>{currentText.vipBadge}</Text>
          </View>
          
          <Text style={[styles.previewWelcomeTitle, isCurrentLanguageRtl && styles.textRightAlign]}>
            {currentText.welcome}
          </Text>
          
          <View style={[styles.previewMetaItemRow, isCurrentLanguageRtl && styles.rowReverseDirection]}>
            <Text style={styles.previewMetaItemLabel}>{currentText.homeLabel} :</Text>
            <Text style={styles.previewMetaItemValue}>📊 En ligne</Text>
          </View>

          <View style={[styles.previewMetaItemRow, isCurrentLanguageRtl && styles.rowReverseDirection]}>
            <Text style={styles.previewMetaItemLabel}>{currentText.activeProno} :</Text>
            <Text style={styles.previewMetaItemValueHighlight}>🟢 Cote 2.50</Text>
          </View>
        </View>

        {/* BOUTON D'ACTION DE PERSISTANCE DES PRÉFÉRENCES GLOBAL */}
        <TouchableOpacity 
          style={styles.saveSettingsSubmitBtn}
          onPress={handleSavePreferences}
          activeOpacity={0.85}
        >
          <Text style={styles.saveSettingsSubmitBtnText}>{currentText.saveBtn}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollPadding: { padding: 16, paddingBottom: 40 },
  
  // Alignements contextuels pour la gestion des écritures de Droite à Gauche (RTL)
  textRightAlign: { textAlign: 'right' },
  rowReverseDirection: { flexDirection: 'row-reverse' },
  
  // Section Structurelle En-tête (Header)
  localizationHeader: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 0.6 },
  headerSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },

  // Grille des lignes des langues
  languagesGroupContainer: { marginVertical: 6 },
  languagePillCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  languagePillCardActive: { borderColor: '#2E7D32', backgroundColor: '#E8F5E9' },
  languageMetaInfoRow: { flexDirection: 'row', alignItems: 'center' },
  flagIconText: { fontSize: 18 },
  languageLabelName: { fontSize: 13, fontWeight: '700', color: '#4B5563', marginLeft: 14 },
  languageLabelNameActive: { color: '#2E7D32', fontWeight: 'bold' },
  
  // Indicateurs de type Bouton Radio (Sélection active)
  checkedIndicatorCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  checkedIndicatorDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' },

  // Boîte d'aperçu de dictionnaire en direct (Live UI Preview)
  sectionDividerTitle: { fontSize: 11, fontWeight: '900', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 24, marginBottom: 12 },
  previewComponentMockCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  premiumVipBadgeRow: { backgroundColor: '#111827', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 14 },
  premiumVipBadgeRowText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.3 },
  previewWelcomeTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827', marginBottom: 12 },
  
  previewMetaItemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  previewMetaItemLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  previewMetaItemValue: { fontSize: 12, color: '#111827', fontWeight: '700' },
  previewMetaItemValueHighlight: { fontSize: 12, color: '#2E7D32', fontWeight: 'bold' },

  // Bouton de validation global
  saveSettingsSubmitBtn: { backgroundColor: '#2E7D32', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 28, shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
  saveSettingsSubmitBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.2 }
});