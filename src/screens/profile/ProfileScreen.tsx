import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  Alert
} from 'react-native';
import { useAuth, UserProfile } from '../../context/AuthContext';

// Simulation de données réelles pour l'historique des pronostics (Module 1)
const MOCK_PRONOS_HISTORY = [
  { id: 't1', match: 'Real Madrid vs Man. City', prediction: 'Victoire Real Madrid', status: 'GAGNÉ', odds: '2.40', date: '25/05/2026', stake: '10 000 F CFA' },
  { id: 't2', match: 'Arsenal vs Chelsea', prediction: 'Plus de 2.5 buts', status: 'GAGNÉ', odds: '1.65', date: '25/05/2026', stake: '5 000 F CFA' },
  { id: 't3', match: 'FC Barcelone vs Atletico', prediction: 'Les deux équipes marquent', status: 'PERDU', odds: '1.80', date: '24/05/2026', stake: '2 500 F CFA' },
];

export const ProfileScreen = () => {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profil' | 'historique'>('profil');

  // Valeurs de repli au cas où le contexte n'est pas encore totalement alimenté
  const currentProfile = user || {
    fullName: "Utilisateur Premium",
    email: "premium@pronosapp.com",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    country: "Burkina Faso 🇧🇫",
    lang: "Français 🇫🇷",
    level: "Expert 🔥",
    predictionsCount: MOCK_PRONOS_HISTORY.length,
    isVIP: true
  };

  /**
   * Permet de modifier le pays via une boîte de dialogue
   */
  const handleSelectCountry = () => {
    Alert.alert(
      "Sélectionner votre pays",
      "Choisissez votre zone de paris principale :",
      [
        { text: "Burkina Faso 🇧🇫", onPress: () => updateProfile({ country: "Burkina Faso 🇧🇫" }) },
        { text: "Côte d'Ivoire 🇨🇮", onPress: () => updateProfile({ country: "Côte d'Ivoire 🇨🇮" }) },
        { text: "Sénégal 🇸🇳", onPress: () => updateProfile({ country: "Sénégal 🇸🇳" }) },
        { text: "International 🌍", onPress: () => updateProfile({ country: "International 🌍" }) },
      ],
      { cancelable: true }
    );
  };

  /**
   * Permet de modifier la langue de l'application de façon réactive
   */
  const handleSelectLanguage = () => {
    Alert.alert(
      "Langue de l'application",
      "Sélectionnez votre langue de préférence :",
      [
        { text: "Français 🇫🇷", onPress: () => updateProfile({ lang: "Français 🇫🇷" }) },
        { text: "English 🇬🇧", onPress: () => updateProfile({ lang: "English 🇬🇧" }) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 👤 En-tête du profil utilisateur */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: currentProfile.avatarUrl }} style={styles.avatarImg} />
          {currentProfile.isVIP && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
        </View>
        <Text style={styles.userName}>{currentProfile.fullName}</Text>
        <Text style={styles.userEmail}>{currentProfile.email}</Text>
        
        <View style={styles.levelBadgeContainer}>
          <Text style={styles.levelBadgeText}>Rang : {currentProfile.level}</Text>
        </View>
      </View>

      {/* 🎛️ Barre d'onglets de navigation interne */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={[styles.tabButton, activeTab === 'profil' && styles.tabButtonActive]} 
          onPress={() => setActiveTab('profil')}
        >
          <Text style={[styles.tabLabel, activeTab === 'profil' && styles.tabLabelActive]}>Mon Profil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.7} 
          style={[styles.tabButton, activeTab === 'historique' && styles.tabButtonActive]} 
          onPress={() => setActiveTab('historique')}
        >
          <Text style={[styles.tabLabel, activeTab === 'historique' && styles.tabLabelActive]}>
            Historique ({MOCK_PRONOS_HISTORY.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 📑 Contenu dynamique selon l'onglet actif */}
      {activeTab === 'profil' ? (
        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.sectionTitle}>Préférences générales</Text>
          
          <TouchableOpacity activeOpacity={0.7} onPress={handleSelectCountry} style={styles.settingRow}>
            <Text style={styles.settingLabel}>Pays de résidence</Text>
            <Text style={styles.settingValue}>{currentProfile.country}</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleSelectLanguage} style={styles.settingRow}>
            <Text style={styles.settingLabel}>Langue d'affichage</Text>
            <Text style={styles.settingValue}>{currentProfile.lang}</Text>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Pronostics validés</Text>
            <Text style={[styles.settingValue, { color: '#16A34A', fontWeight: 'bold' }]}>
              {currentProfile.predictionsCount} tickets
            </Text>
          </View>

          {/* Action de déconnexion */}
          <TouchableOpacity activeOpacity={0.8} onPress={logout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Se déconnecter du compte</Text>
          </TouchableOpacity>
          
        </ScrollView>
      ) : (
        <FlatList
          data={MOCK_PRONOS_HISTORY}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.ticketCard}>
              <View style={styles.ticketMainInfo}>
                <Text style={styles.ticketMatchName}>{item.match}</Text>
                <Text style={styles.ticketPrediction}>
                  Prono : <Text style={styles.ticketHighlight}>{item.prediction}</Text>
                </Text>
                <View style={styles.ticketMetaRow}>
                  <Text style={styles.ticketMetaText}>Cote : {item.odds}</Text>
                  <Text style={styles.ticketMetaDivider}>•</Text>
                  <Text style={styles.ticketMetaText}>Mise : {item.stake}</Text>
                </View>
                <Text style={styles.ticketDate}>{item.date}</Text>
              </View>

              {/* Statut Gagné / Perdu */}
              <View style={[styles.statusBadge, item.status === 'GAGNÉ' ? styles.statusGagne : styles.statusPerdu]}>
                <Text style={[styles.statusText, item.status === 'GAGNÉ' ? styles.statusTextGagne : styles.statusTextPerdu]}>
                  {item.status}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#16A34A', // Vert entreprise
  },
  vipBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#F59E0B', // Or / Ambre pour le statut VIP
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vipText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  levelBadgeContainer: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  levelBadgeText: {
    color: '#16A34A',
    fontSize: 12,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#16A34A',
  },
  tabLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#16A34A',
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 15,
  },
  listContent: {
    padding: 20,
  },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  ticketMainInfo: {
    flex: 1,
  },
  ticketMatchName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  ticketPrediction: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  ticketHighlight: {
    fontWeight: '600',
    color: '#111827',
  },
  ticketMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ticketMetaText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  ticketMetaDivider: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  ticketDate: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusGagne: {
    backgroundColor: '#DCFCE7',
  },
  statusPerdu: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextGagne: {
    color: '#15803D',
  },
  statusTextPerdu: {
    color: '#B91C1C',
  },
});