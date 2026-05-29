#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Publicité & Monétisation - PRONOS-APP
 * Centralise l'affichage des régies publicitaires (AdMob, bannières internes),
 * les liens d'affiliation des bookmakers, et les passerelles de conversion VIP.
 * Design haut de gamme respectant la charte graphique (Vert & Blanc) et optimisé pour le ROI.
 */

import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Clipboard,
  Share,
  StatusBar,
  SafeAreaView
} from 'react-native';

export default function MonetizationScreen() {
  // Simule le statut de l'utilisateur actuel ('FREE' ou 'VIP')
  const [userTier, setUserTier] = useState('FREE');

  // Base de données interne des campagnes d'affiliation et sponsoring
  const bookmakerCampaigns = [
    {
      id: '1',
      name: '1XBET',
      bonus: 'Bonus de 200% sur le 1er dépôt',
      codePromo: 'PRONOS226',
      affiliateUrl: 'https://1xbet.com',
      badgeColor: '#1E3A8A'
    },
    {
      id: '2',
      name: 'BETANO',
      bonus: '100% de Bonus jusqu\'à 50 000 FCFA',
      codePromo: 'VIPAPP',
      affiliateUrl: 'https://betano.com',
      badgeColor: '#E05300'
    }
  ];

  /**
   * Action de copie sécurisée du code promo dans le presse-papiers
   */
  const handleCopyPromoCode = (code, bookmaker) => {
    Clipboard.setString(code);
    Alert.alert(
      "📋 Code copié !",
      `Le code promo "${code}" a été copié. Utilisez-le lors de votre inscription sur ${bookmaker} pour débloquer votre bonus exclusif.`,
      [{ text: "Parfait" }]
    );
  };

  /**
   * Redirection simulée vers l'URL d'affiliation du partenaire
   */
  const handleRedirectToBookmaker = (url, name) => {
    Alert.alert(
      "🔗 Redirection Partenaire",
      `Vous allez être redirigé vers le site officiel de ${name} via notre lien de parrainage certifié.`,
      [
        { text: "Annuler", style: "cancel" },
        { text: "Y aller", onPress: () => console.log(`[Affiliation] Ouverture du lien : ${url}`) }
      ]
    );
  };

  /**
   * Partage du lien de parrainage de l'application
   */
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: "Rejoins-moi sur PRONOS-APP pour encaisser un maximum de gains grâce aux analyses de l'IA et des meilleurs experts ! Télécharge l'application ici : https://pronosapp.com",
      });
    } catch (error) {
      console.log("Erreur lors du partage", error);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER DE PROFIL DE MONÉTISATION */}
      <View style={styles.monetizationHeader}>
        <View>
          <Text style={styles.headerTitle}>PRONOS-APP MONETIZATION</Text>
          <Text style={styles.headerSubtitle}>
            Statut actuel : <Text style={userTier === 'VIP' ? styles.badgeVipText : styles.badgeFreeText}>{userTier === 'VIP' ? '👑 MEMBRE VIP' : '🔓 VERSION GRATUITE'}</Text>
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.toggleTierButton} 
          onPress={() => setUserTier(prev => prev === 'FREE' ? 'VIP' : 'FREE')}
        >
          <Text style={styles.toggleTierButtonText}>Tester mode {userTier === 'FREE' ? 'VIP' : 'Free'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* BANNIÈRE DE SPONSORING PREMIUM (Visible par tous) */}
        <View style={styles.sponsorshipBannerCard}>
          <View style={styles.sponsorBadge}>
            <Text style={styles.sponsorBadgeText}>SPONSORISÉ</Text>
          </View>
          <Text style={styles.sponsorTitle}>MOOV MONEY / ORANGE MONEY</Text>
          <Text style={styles.sponsorTagline}>Rechargez votre compte VIP instantanément et en toute sécurité via vos moyens de paiement locaux.</Text>
        </View>

        {/* CONDITIONNEL : RENDER DE LA MONÉTISATION PUBLICITAIRE POUR LES COMPTES GRATUITS */}
        {userTier === 'FREE' && (
          <View style={styles.admobContainerSection}>
            <Text style={styles.sectionTitle}>📺 Espace Publicitaire Google AdMob</Text>
            <Text style={styles.sectionDesc}>Ces bannières et annonces de transition s'effacent automatiquement pour nos abonnés VIP.</Text>
            
            {/* Simulation Emplacement Bannière Native */}
            <View style={styles.admobMockBanner}>
              <Text style={styles.admobMockText}>[ GOOGLE ADMOB BANNER ADS - READY ]</Text>
              <Text style={styles.admobMockSubText}>Identifiant de bloc : ca-app-pub-3940256099942544/6300978111</Text>
            </View>
          </View>
        )}

        {/* SECTION AFFILIATION BOOKMAKERS */}
        <Text style={styles.sectionTitle}>⚽ Liens de Parrainage & Bonus Offerts</Text>
        <Text style={styles.sectionDesc}>Inscrivez-vous chez nos partenaires officiels avec nos codes privilèges pour valider vos coupons combinés.</Text>

        {bookmakerCampaigns.map((camp) => (
          <View key={camp.id} style={styles.bookmakerCard}>
            <View style={styles.bookmakerHeaderRow}>
              <View style={[styles.bookmakerLogoBadge, { backgroundColor: camp.badgeColor }]}>
                <Text style={styles.bookmakerLogoText}>{camp.name}</Text>
              </View>
              <Text style={styles.bonusTextHighlight}>{camp.bonus}</Text>
            </View>

            <View style={styles.promoCodeBoxAction}>
              <View style={styles.codeTextWrapper}>
                <Text style={styles.labelCodeTitle}>CODE PROMO :</Text>
                <Text style={styles.valueCodeText}>{camp.codePromo}</Text>
              </View>
              <TouchableOpacity 
                style={styles.copyButtonPill}
                onPress={() => handleCopyPromoCode(camp.codePromo, camp.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.copyButtonText}>Copier</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.linkDirectButton, { borderColor: camp.badgeColor }]}
              onPress={() => handleRedirectToBookmaker(camp.affiliateUrl, camp.name)}
              activeOpacity={0.8}
            >
              <Text style={[styles.linkDirectButtonText, { color: camp.badgeColor }]}>
                S'inscrire sur {camp.name} et parier 🚀
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        {/* PARPASSERELLE DE CONVERSION DE L'ABONNEMENT VIP */}
        {userTier === 'FREE' && (
          <View style={styles.conversionVipBox}>
            <Text style={styles.conversionTitle}>👑 Devenez Membre VIP pour 5 000 FCFA</Text>
            <Text style={styles.conversionDesc}>
              Supprimez définitivement toutes les publicités Google AdMob, débloquez 100% des pronostics exclusifs de l'IA et accédez au chat communautaire privé.
            </Text>
            <TouchableOpacity 
              style={styles.conversionButtonSubmit}
              onPress={() => Alert.alert("Abonnement VIP", "Ouverture du guichet de paiement de 5 000 FCFA.")}
              activeOpacity={0.85}
            >
              <Text style={styles.conversionButtonSubmitText}>Activer mon accès VIP Premium</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MODULE DE PARRAINAGE VIRAL (GROWTH HACKING) */}
        <TouchableOpacity 
          style={styles.viralShareButton}
          onPress={handleShareApp}
          activeOpacity={0.85}
        >
          <Text style={styles.viralShareButtonText}>📢 Partager l'application à des amis</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollPadding: { padding: 16, paddingBottom: 40 },
  
  // Header principal du module financière
  monetizationHeader: { backgroundColor: '#FFFFFF', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitle: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '600' },
  badgeVipText: { color: '#2E7D32', fontWeight: 'bold' },
  badgeFreeText: { color: '#DC2626', fontWeight: 'bold' },
  toggleTierButton: { backgroundColor: '#111827', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
  toggleTierButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },
  
  // Bannière Sponsoring Premium
  sponsorshipBannerCard: { backgroundColor: '#111827', borderRadius: 16, padding: 16, marginBottom: 20, position: 'relative', overflow: 'hidden' },
  sponsorBadge: { backgroundColor: '#2E7D32', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, alignSelf: 'flex-start', marginBottom: 10 },
  sponsorBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: 'bold', letterSpacing: 0.5 },
  sponsorTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.3 },
  sponsorTagline: { color: '#9CA3AF', fontSize: 11, marginTop: 4, lineHeight: 16, fontWeight: '500' },

  // Sections structurelles
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 14 },
  sectionDesc: { fontSize: 11, color: '#6B7280', marginTop: 3, marginBottom: 14, lineHeight: 16, fontWeight: '500' },

  // Bloc Simulation Google AdMob
  admobContainerSection: { marginBottom: 10 },
  admobMockBanner: { backgroundColor: '#E5E7EB', borderRadius: 12, padding: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed' },
  admobMockText: { fontSize: 12, fontWeight: 'bold', color: '#4B5563', letterSpacing: 0.5 },
  admobMockSubText: { fontSize: 9, color: '#9CA3AF', marginTop: 4, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  // Cartes d'affiliation des Bookmakers
  bookmakerCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginVertical: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  bookmakerHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  bookmakerLogoBadge: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 8 },
  bookmakerLogoText: { color: '#FFFFFF', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  bonusTextHighlight: { fontSize: 11, fontWeight: 'bold', color: '#2E7D32', flex: 1, textAlign: 'right', paddingLeft: 10 },
  
  promoCodeBoxAction: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  codeTextWrapper: { flexDirection: 'row', alignItems: 'center' },
  labelCodeTitle: { fontSize: 11, color: '#6B7280', fontWeight: '700' },
  valueCodeText: { fontSize: 14, fontWeight: '900', color: '#111827', marginLeft: 8, letterSpacing: 0.5 },
  copyButtonPill: { backgroundColor: '#2E7D32', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  copyButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  
  linkDirectButton: { marginTop: 12, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderStyle: 'solid' },
  linkDirectButtonText: { fontSize: 12, fontWeight: 'bold' },

  // Boîte conversion vers l'offre VIP (5000 FCFA)
  conversionVipBox: { backgroundColor: '#E8F5E9', borderRadius: 16, padding: 18, marginTop: 24, borderWidth: 1, borderColor: '#C8E6C9', shadowColor: '#2E7D32', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  conversionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1B5E20' },
  conversionDesc: { fontSize: 12, color: '#374151', marginTop: 6, lineHeight: 18, fontWeight: '500' },
  conversionButtonSubmit: { backgroundColor: '#2E7D32', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 16 },
  conversionButtonSubmitText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.2 },

  // Bouton de diffusion virale
  viralShareButton: { backgroundColor: '#111827', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  viralShareButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.2 }
});