#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Gestion et Simulation de Tickets - PRONOS-APP
 * Gère l'ajout, la combinaison, le calcul multiplicateur automatique des cotes,
 * le formatage du texte pour WhatsApp et l'export logique des données du reçu.
 * Design haut de gamme respectant le code couleur de l'entreprise (Vert & Blanc).
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Share,
  StatusBar,
  KeyboardAvoidingView,
  Platform
} from 'react-native';

export default function TicketCouponScreen() {
  const [betAmount, setBetAmount] = useState('1000'); // Mise par défaut en FCFA
  
  // Base de données simulée des sélections ajoutées au panier de pari combiné
  const [selectedMatches, setSelectedMatches] = useState([
    { id: '1', home: 'Man. City', away: 'Real Madrid', betType: 'Victoire Domicile (1)', odds: 1.85 },
    { id: '2', home: 'Chelsea', away: 'Arsenal', betType: 'Les deux équipes marquent (BTTS)', odds: 1.65 },
    { id: '3', home: 'Juventus', away: 'AC Milan', betType: 'Moins de 2.5 buts', odds: 1.70 }
  ]);

  /**
   * Calcul mathématique de la cote totale combinée
   * Mémorisé via useMemo pour éviter des recalculs inutiles lors de la saisie de la mise
   */
  const totalOdds = useMemo(() => {
    if (selectedMatches.length === 0) return '0.00';
    const cumulativeProduct = selectedMatches.reduce((acc, match) => acc * match.odds, 1);
    return cumulativeProduct.toFixed(2);
  }, [selectedMatches]);

  /**
   * Calcul du rendement et du gain potentiel brut
   */
  const potentialGains = useMemo(() => {
    const numericOdds = parseFloat(totalOdds);
    const numericAmount = parseFloat(betAmount.replace(/[^0-9]/g, '')) || 0;
    return Math.floor(numericOdds * numericAmount).toLocaleString('fr-FR');
  }, [totalOdds, betAmount]);

  /**
   * Supprime une sélection du panier et recalcule les cotes de façon atomique
   */
  const handleRemoveMatch = (matchId) => {
    setSelectedMatches((prevMatches) => prevMatches.filter(match => match.id !== matchId));
  };

  /**
   * Génère un code de coupon alphanumérique unique pour le partage
   */
  const generateCouponCode = () => {
    return `PRONO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };

  /**
   * Pipeline de partage direct du ticket formaté vers WhatsApp
   */
  const handleShareToWhatsApp = async () => {
    if (selectedMatches.length === 0) {
      Alert.alert("Ticket Vide", "Veuillez ajouter au moins un pronostic à votre coupon avant de le partager.");
      return;
    }

    const couponCode = generateCouponCode();
    
    // Construction de l'architecture textuelle structurée pour WhatsApp
    let messageTemplate = `🟢 *TICKET COMBINÉ PRONOS-APP* 🟢\n`;
    messageTemplate += `📝 *Code Coupon :* ${couponCode}\n`;
    messageTemplate += `──────────────────────\n\n`;

    selectedMatches.forEach((match, index) => {
      messageTemplate += `${index + 1}️⃣ ⚽ *${match.home} vs ${match.away}*\n`;
      messageTemplate += `   🎯 Option : _${match.betType}_\n`;
      messageTemplate += `   📈 Cote : *${match.odds.toFixed(2)}*\n\n`;
    });

    messageTemplate += `──────────────────────\n`;
    messageTemplate += `📊 *Cote Totale :* ${totalOdds}\n`;
    messageTemplate += `💰 *Mise :* ${parseFloat(betAmount).toLocaleString('fr-FR')} FCFA\n`;
    messageTemplate += `💵 *Gain Potentiel :* ${potentialGains} FCFA\n\n`;
    messageTemplate += `📲 _Généré instantanément via l'application mobile PRONOS-APP._`;

    try {
      const result = await Share.share({
        message: messageTemplate,
      });
      if (result.action === Share.sharedAction) {
        console.log('[Ticket-Pro] Coupon partagé avec succès.');
      }
    } catch (error) {
      Alert.alert("Erreur Système", "Échec de l'initialisation du module de partage natif.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* DESIGN DU REÇU EN FORMAT STYLE TICKET PHYSIQUE */}
        <View style={styles.receiptContainer}>
          <View style={styles.receiptHeader}>
            <View>
              <Text style={styles.receiptBrandTitle}>PRONOS-APP</Text>
              <Text style={styles.receiptSubtitle}>SIMULATEUR DE COUPON</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>EN ATTENTE</Text>
            </View>
          </View>

          <View style={styles.dashedLineDivider} />

          {/* SÉLECTIONS DE MATCHS */}
          {selectedMatches.length === 0 ? (
            <View style={styles.emptyContainerBlock}>
              <Text style={styles.emptyContainerText}>Votre ticket ne contient aucun match pour le moment.</Text>
            </View>
          ) : (
            selectedMatches.map((match) => (
              <View key={match.id} style={styles.matchItemContainer}>
                <View style={styles.matchMetaDetails}>
                  <Text style={styles.matchTeamsHeadline}>{match.home} 🆚 {match.away}</Text>
                  <Text style={styles.matchBetOptionSub}>Option : {match.betType}</Text>
                </View>
                <View style={styles.matchOddsActionBlock}>
                  <Text style={styles.matchOddsValueText}>{match.odds.toFixed(2)}</Text>
                  <TouchableOpacity 
                    style={styles.matchDeleteIconClick}
                    onPress={() => handleRemoveMatch(match.id)}
                    activeOpacity={0.6}
                  >
                    <Text style={styles.deleteEmoji}>❌</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          <View style={styles.dashedLineDivider} />

          {/* RÉCAPITULATIF FINANCIER DU MULTIPLICATEUR */}
          <View style={styles.accountingSummaryBlock}>
            <View style={styles.accountingRow}>
              <Text style={styles.accountingLabel}>Nombre de sélections :</Text>
              <Text style={styles.accountingValue}>{selectedMatches.length} événement(s)</Text>
            </View>

            <View style={styles.accountingRow}>
              <Text style={styles.accountingLabelBold}>Cote Totale Globale :</Text>
              <View style={styles.oddsHighlightWrapper}>
                <Text style={styles.oddsHighlightText}>{totalOdds}</Text>
              </View>
            </View>

            {/* ENTRÉE SAISIE MISE */}
            <View style={styles.amountInputCardSection}>
              <Text style={styles.amountInputLabelText}>Définir votre mise de jeu (FCFA) :</Text>
              <TextInput
                style={styles.amountInputFieldBox}
                keyboardType="numeric"
                maxLength={7}
                value={betAmount}
                onChangeText={(text) => setBetAmount(text.replace(/[^0-9]/g, ''))}
                placeholder="Ex: 1000"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={[styles.accountingRow, styles.accountingFooterPadding]}>
              <Text style={styles.payoutLabelText}>Gain Potentiel Évalué :</Text>
              <Text style={styles.payoutValueText}>{potentialGains} FCFA</Text>
            </View>
          </View>
        </View>

        {/* COMPOSANTS DE TRANSMISSION ACTIONS */}
        <TouchableOpacity 
          style={styles.whatsappActionButton} 
          onPress={handleShareToWhatsApp}
          activeOpacity={0.85}
        >
          <Text style={styles.whatsappActionButtonText}>💬 Partager le coupon sur WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exportImageNativeMockButton} 
          onPress={() => Alert.alert("Exportation Galerie", "Le reçu visuel de votre coupon a été converti au format PNG et sauvegardé dans vos images locales.")}
          activeOpacity={0.85}
        >
          <Text style={styles.exportImageNativeMockButtonText}>📸 Enregistrer le ticket en Image</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: 18, paddingBottom: 40 },
  
  // Structure Ticket de Caisse / Reçu Pro
  receiptContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 6, elevation: 2 },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  receiptBrandTitle: { fontSize: 14, fontWeight: '900', color: '#2E7D32', letterSpacing: 0.5 },
  receiptSubtitle: { fontSize: 10, color: '#6B7280', fontWeight: 'bold', marginTop: 2 },
  statusBadge: { backgroundColor: '#FFFDF0', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#FEF3C7' },
  statusBadgeText: { fontSize: 10, color: '#D97706', fontWeight: 'bold' },
  
  // Séparateur Pointillés
  dashedLineDivider: { height: 1, borderWidth: 1, borderColor: '#E5E7EB', borderStyle: 'dashed', marginVertical: 14 },
  
  // Section Liste Matchs
  emptyContainerBlock: { paddingVertical: 24, alignItems: 'center' },
  emptyContainerText: { color: '#9CA3AF', fontSize: 13, fontWeight: '500' },
  matchItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  matchMetaDetails: { flex: 1, paddingRight: 12 },
  matchTeamsHeadline: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  matchBetOptionSub: { fontSize: 12, color: '#6B7280', marginTop: 3, fontWeight: '500' },
  matchOddsActionBlock: { flexDirection: 'row', alignItems: 'center' },
  matchOddsValueText: { fontSize: 15, fontWeight: 'bold', color: '#2E7D32', marginRight: 14 },
  matchDeleteIconClick: { padding: 4 },
  deleteEmoji: { fontSize: 11 },

  // Bloc Comptable Récapitulatif
  accountingSummaryBlock: { marginTop: 2 },
  accountingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 6 },
  accountingLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  accountingValue: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  accountingLabelBold: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  oddsHighlightWrapper: { backgroundColor: '#E8F5E9', paddingVertical: 3, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#C8E6C9' },
  oddsHighlightText: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },
  
  // Formulaire d'input de la mise financière
  amountInputCardSection: { marginTop: 14, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  amountInputLabelText: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', marginBottom: 6 },
  amountInputFieldBox: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, fontWeight: 'bold', color: '#111827' },
  
  accountingFooterPadding: { marginTop: 16, borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 14 },
  payoutLabelText: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  payoutValueText: { fontSize: 20, fontWeight: '900', color: '#2E7D32' },

  // Boutons d'actions et de diffusion inférieurs
  whatsappActionButton: { backgroundColor: '#25D366', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 24, elevation: 1 },
  whatsappActionButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.3 },
  exportImageNativeMockButton: { backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  exportImageNativeMockButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.3 }
});