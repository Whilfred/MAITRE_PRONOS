#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Monétisation & Gestion VIP - PRONOS-APP
 * Gère l'interface de souscription aux abonnements premium et l'intégration des passerelles Mobile Money.
 * Flux graphiques alignés sur la charte de l'entreprise (Vert & Blanc).
 */

import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert, 
  ActivityIndicator, 
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function SubscriptionScreen({ onSubscriptionSuccess }) {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ORANGE'); // Options: ORANGE, MOOV, MTN, CARD
  
  // Constantes économiques de l'application
  const SUBSCRIPTION_PRICE = "5 000 FCFA";

  const vipAdvantages = [
    "🚀 Accès instantané aux pronostics exclusifs de l'IA",
    "📊 Combinés du jour à forte probabilité (>85%)",
    "🔔 Notifications Push en temps réel (Buts, Cartons, Lives)",
    "🧪 Statistiques avancées et analyses NLP détaillées",
    "🎧 Support prioritaire 7j/7 par l'équipe d'experts"
  ];

  /**
   * Valide le format du numéro selon l'opérateur sélectionné
   * Accepte les formats locaux standards (8 à 10 chiffres selon les pays)
   */
  const validatePhoneNumber = (number) => {
    const cleanNumber = number.replace(/\s+/g, ''); // Supprime les espaces
    const phoneRegex = /^[0-9]{8,10}$/;
    return phoneRegex.test(cleanNumber);
  };

  /**
   * Déclenche le pipeline de traitement de la transaction financière
   */
  const handlePaymentProcessing = () => {
    // 1. Validation de sécurité pour Mobile Money
    if (selectedMethod !== 'CARD') {
      if (!phoneNumber.trim()) {
        Alert.alert("Champ obligatoire", "Veuillez saisir votre numéro de compte Mobile Money pour recevoir la demande de débit.");
        return;
      }
      if (!validatePhoneNumber(phoneNumber)) {
        Alert.alert("Format invalide", "Le numéro de téléphone saisi ne correspond pas à un format cellulaire valide (8 à 10 chiffres requis).");
        return;
      }
    }

    setLoading(true);

    // 2. Simulation d'appel à la passerelle de paiement (ex: CinetPay, Bizao, Fedapay ou Wave API)
    setTimeout(() => {
      setLoading(false);
      
      Alert.alert(
        "👑 Accès VIP Activé",
        `Votre transaction via ${selectedMethod} a été approuvée avec succès. Votre compte est maintenant configuré en mode Premium.`,
        [
          { 
            text: "Ouvrir le tableau de bord", 
            onPress: () => {
              if (typeof onSubscriptionSuccess === 'function') {
                onSubscriptionSuccess(); // Met à jour l'état global de l'utilisateur dans App.js
              }
            } 
          }
        ],
        { cancelable: false }
      );
    }, 3000); // 3 secondes de traitement réseau simulé
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* BLOC MARKETING AVANTAGES */}
        <View style={styles.heroSection}>
          <View style={styles.vipBadgeContainer}>
            <Text style={styles.vipBadgeText}>MEMBRE PREMIUM</Text>
          </View>
          <Text style={styles.heroTitle}>Abonnement PRONOS-APP</Text>
          <Text style={styles.heroSubtitle}>Débloquez la puissance du machine learning appliqué aux analyses sportives.</Text>
          
          <View style={styles.priceTag}>
            <Text style={styles.priceMain}>{SUBSCRIPTION_PRICE}</Text>
            <Text style={styles.priceDuration}> / 30 jours</Text>
          </View>
        </View>

        {/* COMPOSANT LISTE DES DROITS ACCÈS */}
        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Avantages de la formule complète :</Text>
          {vipAdvantages.map((advantage, index) => (
            <View key={index} style={styles.featureItemRow}>
              <Text style={styles.featureItemText}>{advantage}</Text>
            </View>
          ))}
        </View>

        {/* GRILLE DE SÉLECTION DES FOURNISSEURS PAIEMENT */}
        <Text style={styles.gridHeading}>Sélectionnez votre passerelle sécurisée :</Text>
        
        <View style={styles.paymentGridRow}>
          <TouchableOpacity 
            style={[styles.gridButton, selectedMethod === 'ORANGE' && styles.activeOrange]}
            onPress={() => setSelectedMethod('ORANGE')}
            activeOpacity={0.85}
          >
            <Text style={[styles.gridButtonText, selectedMethod === 'ORANGE' && styles.textWhite]}>Orange Money</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridButton, selectedMethod === 'MOOV' && styles.activeMoov]}
            onPress={() => setSelectedMethod('MOOV')}
            activeOpacity={0.85}
          >
            <Text style={[styles.gridButtonText, selectedMethod === 'MOOV' && styles.textWhite]}>Moov Money</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.paymentGridRow}>
          <TouchableOpacity 
            style={[styles.gridButton, selectedMethod === 'MTN' && styles.activeMtn]}
            onPress={() => setSelectedMethod('MTN')}
            activeOpacity={0.85}
          >
            <Text style={[styles.gridButtonText, selectedMethod === 'MTN' && styles.textWhite]}>MTN Money</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.gridButton, selectedMethod === 'CARD' && styles.activeCard]}
            onPress={() => setSelectedMethod('CARD')}
            activeOpacity={0.85}
          >
            <Text style={[styles.gridButtonText, selectedMethod === 'CARD' && styles.textWhite]}>💳 Carte Bancaire</Text>
          </TouchableOpacity>
        </View>

        {/* INPUT FORMULAIRE DYNAMIQUE */}
        {selectedMethod !== 'CARD' ? (
          <View style={styles.formInputBlock}>
            <Text style={styles.formInputLabel}>Numéro de téléphone associé au compte :</Text>
            <TextInput
              style={styles.textInputField}
              placeholder="Ex: 70000000"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <Text style={styles.formInputHint}>
              Une notification contextuelle ou un pop-up USSD de validation vous demandera d'entrer votre code PIN secret sur votre terminal mobile.
            </Text>
          </View>
        ) : (
          <View style={styles.formInputBlock}>
            <Text style={styles.cardPaymentTitle}>🔒 Passerelle Web3 / PCI-DSS Compliant</Text>
            <Text style={styles.formInputHint}>
              Vous allez être redirigé vers l'interface de paiement bancaire cryptée en SSL 256 bits pour finaliser le dépôt par Carte Visa ou Mastercard.
            </Text>
          </View>
        )}

        {/* BOUTON D'ACTION PRINCIPAL DE SOUUMISSION */}
        <TouchableOpacity 
          style={styles.submitActionButton} 
          onPress={handlePaymentProcessing}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitActionButtonText}>
              {selectedMethod === 'CARD' ? "Procéder à la transaction carte" : `Payer ${SUBSCRIPTION_PRICE} via ${selectedMethod}`}
            </Text>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  // Section Header / Marketing Hero
  heroSection: { alignItems: 'center', marginTop: 10, marginBottom: 5 },
  vipBadgeContainer: { backgroundColor: '#111827', paddingVertical: 5, paddingHorizontal: 14, borderRadius: 20, marginBottom: 12 },
  vipBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  heroSubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 6, paddingHorizontal: 10, lineHeight: 18 },
  
  // Tag tarifaire
  priceTag: { flexDirection: 'row', alignItems: 'baseline', marginTop: 15, backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 50, borderWidth: 1, borderColor: '#E5E7EB' },
  priceMain: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  priceDuration: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  
  // Bloc Avantages
  featuresCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginVertical: 15, borderWidth: 1, borderColor: '#E5E7EB' },
  featuresTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  featureItemRow: { marginVertical: 5 },
  featureItemText: { fontSize: 13, color: '#374151', fontWeight: '500' },
  
  // Grille sélecteurs
  gridHeading: { fontSize: 14, fontWeight: 'bold', color: '#2E7D32', marginTop: 5, marginBottom: 12 },
  paymentGridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  gridButton: { flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 4, justifyContent: 'center' },
  gridButtonText: { fontSize: 13, fontWeight: 'bold', color: '#4B5563' },
  textWhite: { color: '#FFFFFF' },
  
  // Couleurs dynamiques opérateurs
  activeOrange: { backgroundColor: '#FF6600', borderColor: '#FF6600' },
  activeMoov: { backgroundColor: '#0066A4', borderColor: '#0066A4' },
  activeMtn: { backgroundColor: '#FFCC00', borderColor: '#FFCC00' },
  activeCard: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  
  // Bloc Formulaire
  formInputBlock: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  formInputLabel: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', marginBottom: 8 },
  textInputField: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 15, color: '#111827', fontWeight: '600' },
  formInputHint: { fontSize: 11, color: '#6B7280', marginTop: 8, lineHeight: 15, fontWeight: '400' },
  cardPaymentTitle: { fontSize: 13, fontWeight: 'bold', color: '#111827' },

  // Bouton validation
  submitActionButton: { backgroundColor: '#2E7D32', borderRadius: 12, padding: 15, alignItems: 'center', marginTop: 25, elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3 },
  submitActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: 'bold' }
});