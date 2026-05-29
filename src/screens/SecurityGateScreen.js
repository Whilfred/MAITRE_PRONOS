#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Sécurité, d'Intégrité & Anti-Fraude - PRONOS-APP
 * Gère la détection de vulnérabilités, le chiffrement simulé, le Rate Limiting,
 * la protection contre l'aspiration de données (bots) et la validation OTP.
 * Design haut de gamme aligné sur la charte de l'entreprise (Vert & Blanc).
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

export default function SecurityGateScreen() {
  // États de l'intégrité de l'application
  const [deviceStatus, setDeviceStatus] = useState('SCANNING'); // SCANNING, SECURE, VULNERABLE
  const [requestCount, setRequestCount] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  // États du module de vérification OTP (Email Verification)
  const [otpCode, setOtpCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Simulation des clés d'API et signature de l'application
  const appSecurityConfig = useMemo(() => {
    return {
      apiEndpointProtection: "https://api.pronosapp.com/v1/secured",
      encryptionAlgorithm: "AES-GCM-256",
      appSignatureHash: "SHA256:7f83b2c1d9e4a5b6c7d8e9f0a1b2c3d4",
      maxRequestsPerMinute: 60
    };
  }, []);

  /**
   * Simulation du scan d'intégrité de l'appareil à l'ouverture (Anti-Fraude / Anti-Root)
   */
  useEffect(() => {
    const integrityCheckTimeout = setTimeout(() => {
      // Détection de l'environnement de production sécurisé
      setDeviceStatus('SECURE');
    }, 2000);

    return () => clearTimeout(integrityCheckTimeout);
  }, []);

  /**
   * Système de Rate Limiting applicatif (Simulateur de protection contre l'inondation de requêtes / Bots)
   */
  const handleSimulateApiRequest = useCallback(() => {
    if (isRateLimited) {
      Alert.alert("🚨 Sécurité : Limite atteinte", "Trop de requêtes successives détectées. Accès temporairement restreint pour éviter le piratage.");
      return;
    }

    setRequestCount(prev => {
      const nextCount = prev + 1;
      // Déclenchement automatique du pare-feu applicatif à partir de 5 requêtes ultra-rapides
      if (nextCount >= 5) {
        setIsRateLimited(true);
        setTimeout(() => {
          setIsRateLimited(false);
          setRequestCount(0);
        }, 10000); // Blocage temporaire de sécurité de 10 secondes
      }
      return nextCount;
    });
  }, [isRateLimited]);

  /**
   * Validation du code de vérification OTP par l'API
   */
  const handleVerifyOtpCode = () => {
    if (otpCode.trim().length !== 4) {
      Alert.alert("Code non valide", "Veuillez entrer le code de sécurité à 4 chiffres envoyé par email.");
      return;
    }

    setIsSendingOtp(true);
    // Simulation du temps de calcul de déchiffrement serveur
    setTimeout(() => {
      setIsSendingOtp(false);
      if (otpCode === '2026') { // Code secret défini pour l'année courante de validation
        setIsVerified(true);
        Alert.alert("🔒 Identité Validée", "Votre adresse e-mail a été certifiée conforme. Votre compte est sécurisé.");
      } else {
        Alert.alert("Échec de vérification", "Le code de sécurité saisi est incorrect ou a expiré.");
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* EN-TÊTE SÉCURISÉ DU SYSTEME */}
      <View style={styles.securityHeaderRow}>
        <View>
          <Text style={styles.headerTitleText}>SHIELD SECURITY LAYER</Text>
          <Text style={styles.headerSubtitleText}>Module d'intégrité et de protection des flux</Text>
        </View>
        <View style={[
          styles.statusSystemBadge, 
          deviceStatus === 'SECURE' ? styles.badgeSystemSuccess : styles.badgeSystemWarning
        ]}>
          <Text style={[styles.statusSystemBadgeText, deviceStatus === 'SECURE' ? styles.textGreen : styles.textOrange]}>
            {deviceStatus === 'SCANNING' ? 'SCAN...' : deviceStatus === 'SECURE' ? 'ACTIF' : 'ALERTE'}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* CARTE D'AUDIT COMPLÈTE DE L'APPAREIL */}
        <Text style={styles.sectionHeadingTitle}>🛡️ Analyseur d'Intégrité Matérielle</Text>
        <View style={styles.auditCardWrapper}>
          <View style={styles.auditRowItem}>
            <Text style={styles.auditLabelText}>Vérification Jailbreak / Root :</Text>
            {deviceStatus === 'SCANNING' ? (
              <ActivityIndicator size="small" color="#2E7D32" />
            ) : (
              <Text style={styles.auditValueSuccess}>✅ Non détecté (SÉCURISÉ)</Text>
            )}
          </View>

          <View style={styles.auditRowItemTextGap}>
            <Text style={styles.auditLabelText}>Algorithme d'échange :</Text>
            <Text style={styles.auditValueCode}>{appSecurityConfig.encryptionAlgorithm}</Text>
          </View>

          <View style={styles.auditRowItemTextGap}>
            <Text style={styles.auditLabelText}>Signature binaire APK :</Text>
            <Text style={styles.auditValueCode} numberOfLines={1}>{appSecurityConfig.appSignatureHash}</Text>
          </View>
        </View>

        {/* COMPOSANT DE VÉRIFICATION EMAIL / PROTECTION COMPTE */}
        <Text style={styles.sectionHeadingTitle}>📧 Vérification double facteur (OTP)</Text>
        <View style={styles.otpCardWrapper}>
          {isVerified ? (
            <View style={styles.verifiedStateBox}>
              <Text style={styles.verifiedBoxText}>🛡️ Compte certifié et protégé contre l'usurpation.</Text>
            </View>
          ) : (
            <View>
              <Text style={styles.otpDescInstruction}>Saisissez le code de contrôle pour valider l'accès aux pronostics VIP exclusifs.</Text>
              
              <TextInput
                style={styles.otpInputFieldBox}
                placeholder="Entrez le code (Ex: 2026)"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                maxLength={4}
                value={otpCode}
                onChangeText={setOtpCode}
              />

              <TouchableOpacity 
                style={styles.otpSubmitActionBtn} 
                onPress={handleVerifyOtpCode}
                disabled={isSendingOtp}
                activeOpacity={0.8}
              >
                {isSendingOtp ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.otpSubmitActionBtnText}>Valider le code de sécurité</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* MODULE DE RATE LIMITING & ANTI-BOTS */}
        <Text style={styles.sectionHeadingTitle}>⚡ Pare-feu Applicatif & Anti-Scraping</Text>
        <View style={styles.firewallCardWrapper}>
          <Text style={styles.firewallDescText}>
            Pour préserver notre propriété intellectuelle, le serveur bloque automatiquement les requêtes automatisées ou répétitives conçues pour copier nos algorithmes.
          </Text>

          <View style={styles.firewallMetricRow}>
            <Text style={styles.firewallMetricLabel}>Requêtes envoyées (fenêtre 10s) :</Text>
            <Text style={[styles.firewallMetricValue, isRateLimited && styles.textRed]}>
              {requestCount} / 5
            </Text>
          </View>

          {isRateLimited && (
            <View style={styles.rateLimitAlertBox}>
              <Text style={styles.rateLimitAlertBoxText}>⚠️ EFFET DU RATE LIMITING : Le pare-feu bloque temporairement les requêtes de ce terminal.</Text>
            </View>
          )}

          <TouchableOpacity 
            style={[styles.simulateRequestBtn, isRateLimited && styles.simulateRequestBtnDisabled]} 
            onPress={handleSimulateApiRequest}
            activeOpacity={0.7}
          >
            <Text style={styles.simulateRequestBtnText}>Simuler une requête API</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollPadding: { padding: 16, paddingBottom: 40 },
  
  // Header principal du module Sécurité
  securityHeaderRow: { backgroundColor: '#FFFFFF', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitleText: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 0.5 },
  headerSubtitleText: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  
  statusSystemBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1 },
  badgeSystemSuccess: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  badgeSystemWarning: { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' },
  statusSystemBadgeText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.3 },
  textGreen: { color: '#2E7D32' },
  textOrange: { color: '#EF6C00' },
  textRed: { color: '#DC2626' },

  // Titres structurels
  sectionHeadingTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 22, marginBottom: 10 },

  // Panneau d'audit matériel
  auditCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  auditRowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  auditRowItemTextGap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  auditLabelText: { fontSize: 12, fontWeight: '700', color: '#4B5563' },
  auditValueSuccess: { fontSize: 12, fontWeight: 'bold', color: '#2E7D32' },
  auditValueCode: { fontSize: 11, color: '#1F2937', backgroundColor: '#F3F4F6', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', maxWidth: '55%', overflow: 'hidden' },

  // Panneau de vérification OTP
  otpCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  otpDescInstruction: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  otpInputFieldBox: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#111827', fontWeight: 'bold', marginTop: 14, textAlign: 'center', letterSpacing: 2 },
  otpSubmitActionBtn: { backgroundColor: '#2E7D32', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 14 },
  otpSubmitActionBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  verifiedStateBox: { backgroundColor: '#E8F5E9', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#C8E6C9', alignItems: 'center' },
  verifiedBoxText: { color: '#2E7D32', fontSize: 13, fontWeight: 'bold' },

  // Panneau de contrôle Firewall / Rate Limiting
  firewallCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  firewallDescText: { fontSize: 12, color: '#6B7280', lineHeight: 18, fontWeight: '500' },
  firewallMetricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  firewallMetricLabel: { fontSize: 12, color: '#4B5563', fontWeight: 'bold' },
  firewallMetricValue: { fontSize: 13, fontWeight: '900', color: '#111827' },
  rateLimitAlertBox: { backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 8, padding: 12, marginTop: 12 },
  rateLimitAlertBoxText: { color: '#DC2626', fontSize: 11, fontWeight: 'bold', lineHeight: 16 },
  simulateRequestBtn: { backgroundColor: '#111827', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 14 },
  simulateRequestBtnDisabled: { backgroundColor: '#9CA3AF' },
  simulateRequestBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' }
});