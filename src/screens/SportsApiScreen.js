#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Gestion & Centralisation des APIs Sportives - PRONOS-APP
 * Interface d'administration pour monitorer les connecteurs de données :
 * API-Football (Scores & Cotes), SportMonks (Analyses) et TheSportsDB (Logos/Medias).
 * Contient un émulateur de requêtes asynchrones JSON et de statut de latence (Ping).
 * Design haut de gamme aligné sur la charte de l'entreprise (Vert & Blanc).
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';

export default function SportsApiScreen() {
  // États de chargement et d'analyse des flux
  const [activeSyncProvider, setActiveSyncProvider] = useState(null);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState('Jamais synchronisé');
  const [selectedJsonPreview, setSelectedJsonPreview] = useState('FOOTBALL_LIVE');

  // Configuration immuable des fournisseurs de données sportives (APIs)
  const apiProviders = useMemo(() => [
    {
      id: 'API_FOOTBALL',
      name: 'API-Football (RapidAPI)',
      purpose: 'Cotes en direct, scores live & événements de matchs',
      status: 'ONLINE',
      ping: '42 ms',
      quota: '7 420 / 10 000 requêtes',
      accentColor: '#0284C7'
    },
    {
      id: 'SPORT_MONKS',
      name: 'SportMonks API',
      purpose: 'Statistiques avancées d\'équipes & historiques de performances',
      status: 'ONLINE',
      ping: '58 ms',
      quota: '1 250 / 5 000 requêtes',
      accentColor: '#8B5CF6'
    },
    {
      id: 'THE_SPORTS_DB',
      name: 'TheSportsDB Engine',
      purpose: 'Métadonnées, logos des championnats & visuels des clubs',
      status: 'MAINTENANCE',
      ping: '999 ms',
      quota: 'Illimité (Clé Donateur)',
      accentColor: '#F59E0B'
    }
  ], []);

  // Simulation de payloads JSON reçus en temps réel depuis les terminaux API
  const mockJsonPayloads = useMemo(() => {
    return {
      FOOTBALL_LIVE: {
        status: "success",
        results: 1,
        paging: { current: 1, total: 1 },
        response: [{
          fixture: { id: 862415, status: { long: "Match in Progress", short: "2H", elapsed: 74 } },
          teams: { home: { name: "Real Madrid" }, away: { name: "Bayern Munich" } },
          goals: { home: 2, away: 1 },
          live_odds: { market: "1X2", home_odds: 1.45, draw_odds: 3.80, away_odds: 6.50 }
        }]
      },
      THE_SPORTS_DB: {
        teams: [{
          idTeam: "133604",
          strTeam: "Real Madrid CF",
          strAlternate: "Los Blancos",
          intFormedYear: "1902",
          strLeague: "La Liga",
          strTeamBadge: "https://www.thesportsdb.com/images/media/team/badge/7f83b2.png"
        }]
      }
    };
  }, []);

  /**
   * Gestionnaire asynchrone de synchronisation manuelle des passerelles API
   */
  const handleTriggerSync = useCallback((providerId, providerName) => {
    if (providerId === 'THE_SPORTS_DB') {
      Alert.alert("🛑 Canal Indisponible", "Le serveur de TheSportsDB est actuellement en maintenance planifiée. Impossible de forcer la liaison.");
      return;
    }

    setActiveSyncProvider(providerId);

    // Simulation d'un appel réseau Fetch/Axios avec délai d'attente
    setTimeout(() => {
      setActiveSyncProvider(null);
      const currentTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSyncTimestamp(currentTime);
      
      Alert.alert(
        "🔄 Flux Synchronisé",
        `La liaison avec ${providerName} a été rafraîchie avec succès. Les structures de données locales sont à jour.`,
        [{ text: "Terminer" }]
      );
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER DE SURVEILLANCE DES APIS */}
      <View style={styles.apiMonitorHeader}>
        <View>
          <Text style={styles.headerTitleText}>DATA CORE FEED INTEGRATION</Text>
          <Text style={styles.headerSubtitleText}>Console de supervision des passerelles et flux sportifs</Text>
        </View>
        <View style={styles.globalStatusBadge}>
          <Text style={styles.globalStatusBadgeText}>SYNC STABLE</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
        
        {/* BANDEAU HISTORIQUE DE MISE À JOUR */}
        <View style={styles.lastSyncInfoBanner}>
          <Text style={styles.lastSyncLabel}>Dernière mise à jour générale des cotes :</Text>
          <Text style={styles.lastSyncValue}>{lastSyncTimestamp}</Text>
        </View>

        {/* LISTE DES CONNECTEURS RECOMMANDÉS */}
        <Text style={styles.sectionHeadingTitle}>🔌 État des Connecteurs de Données</Text>
        
        {apiProviders.map((provider) => {
          const isSyncingThis = activeSyncProvider === provider.id;
          const isOnline = provider.status === 'ONLINE';

          return (
            <View key={provider.id} style={styles.apiProviderCard}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.providerInfoBlock}>
                  <Text style={styles.providerNameText}>{provider.name}</Text>
                  <Text style={styles.providerPurposeText}>{provider.purpose}</Text>
                </View>
                <View style={[styles.statusBadge, isOnline ? styles.statusBadgeOnline : styles.statusBadgeMaintenance]}>
                  <Text style={[styles.statusBadgeText, isOnline ? styles.textGreen : styles.textOrange]}>
                    {provider.status}
                  </Text>
                </View>
              </View>

              {/* GRILLE TECHNIQUE INFRASTRUCTURE */}
              <View style={styles.techMetricsGrid}>
                <View style={styles.techMetricCell}>
                  <Text style={styles.techCellLabel}>Latence API</Text>
                  <Text style={[styles.techCellValue, !isOnline && styles.textMuted]}>{provider.ping}</Text>
                </View>
                <View style={styles.techMetricCell}>
                  <Text style={styles.techCellLabel}>Consommation Mensuelle</Text>
                  <Text style={styles.techCellValue}>{provider.quota}</Text>
                </View>
              </View>

              {/* BOUTON D'ACTION DE SYNCHRONISATION */}
              <TouchableOpacity
                style={[
                  styles.syncTriggerButton, 
                  { backgroundColor: isOnline ? '#2E7D32' : '#9CA3AF' }
                ]}
                onPress={() => handleTriggerSync(provider.id, provider.name)}
                disabled={activeSyncProvider !== null}
                activeOpacity={0.8}
              >
                {isSyncingThis ? (
                  <View style={styles.loaderInlineRow}>
                    <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.syncTriggerButtonText}>Téléchargement du JSON...</Text>
                  </View>
                ) : (
                  <Text style={styles.syncTriggerButtonText}>
                    {isOnline ? `Forcer la liaison de données` : `Serveur indisponible`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        {/* COMPOSANT DE PREVIEW DE COMPOSANT INCOMING DATA (JSON) */}
        <Text style={styles.sectionHeadingTitle}>📂 Inspecteur de Terminal (Flux JSON)</Text>
        <View style={styles.jsonInspectorWrapper}>
          <View style={styles.jsonSelectorTabsRow}>
            <TouchableOpacity 
              style={[styles.jsonTabBtn, selectedJsonPreview === 'FOOTBALL_LIVE' && styles.jsonTabBtnActive]}
              onPress={() => setSelectedJsonPreview('FOOTBALL_LIVE')}
            >
              <Text style={[styles.jsonTabBtnText, selectedJsonPreview === 'FOOTBALL_LIVE' && styles.jsonTabBtnTextActive]}>
                ⚽ API-Football Live
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.jsonTabBtn, selectedJsonPreview === 'THE_SPORTS_DB' && styles.jsonTabBtnActive]}
              onPress={() => setSelectedJsonPreview('THE_SPORTS_DB')}
            >
              <Text style={[styles.jsonTabBtnText, selectedJsonPreview === 'THE_SPORTS_DB' && styles.jsonTabBtnTextActive]}>
                🖼️ TheSportsDB Assets
              </Text>
            </TouchableOpacity>
          </View>

          {/* CODE BLOCK EMULATED VIEW */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.codeTerminalScrollContainer}>
            <Text style={styles.codeTerminalText}>
              {JSON.stringify(mockJsonPayloads[selectedJsonPreview], null, 2)}
            </Text>
          </ScrollView>
          <Text style={styles.terminalNoticeText}>Ce flux JSON est parsé nativement par l'application pour générer l'UI des pronostics.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollPadding: { padding: 16, paddingBottom: 40 },

  // En-tête principal du moniteur
  apiMonitorHeader: { backgroundColor: '#FFFFFF', padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  headerTitleText: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 0.5 },
  headerSubtitleText: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  globalStatusBadge: { backgroundColor: '#E8F5E9', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#C8E6C9' },
  globalStatusBadgeText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.3 },

  // Bandeau informatif de dernière synchronisation
  lastSyncInfoBanner: { backgroundColor: '#111827', borderRadius: 12, padding: 14, marginVertical: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastSyncLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '500' },
  lastSyncValue: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' },

  // Titres des sections de la page
  sectionHeadingTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 22, marginBottom: 10 },

  // Cartes descriptives des connecteurs d'APIs
  apiProviderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  providerInfoBlock: { flex: 1, paddingRight: 10 },
  providerNameText: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  providerPurposeText: { fontSize: 11, color: '#6B7280', marginTop: 4, lineHeight: 15, fontWeight: '500' },
  
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1 },
  statusBadgeOnline: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  statusBadgeMaintenance: { backgroundColor: '#FFF3E0', borderColor: '#FFE0B2' },
  statusBadgeText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.3 },
  textGreen: { color: '#2E7D32' },
  textOrange: { color: '#EF6C00' },
  textMuted: { color: '#9CA3AF' },

  // Grille technique interne
  techMetricsGrid: { flexDirection: 'row', backgroundColor: '#F9FAFB', borderRadius: 10, padding: 12, marginTop: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  techMetricCell: { flex: 1 },
  techCellLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' },
  techCellValue: { fontSize: 12, color: '#111827', fontWeight: 'bold', marginTop: 3 },

  // Boutons de déclenchement d'appels réseaux API
  syncTriggerButton: { borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 14 },
  syncTriggerButtonText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  loaderInlineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },

  // Inspecteur JSON Terminal
  jsonInspectorWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  jsonSelectorTabsRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E7EB', paddingBottom: 10, marginBottom: 12 },
  jsonTabBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, marginRight: 8, backgroundColor: '#F3F4F6' },
  jsonTabBtnActive: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#C8E6C9' },
  jsonTabBtnText: { fontSize: 11, color: '#4B5563', fontWeight: '700' },
  jsonTabBtnTextActive: { color: '#2E7D32', fontWeight: 'bold' },
  
  codeTerminalScrollContainer: { backgroundColor: '#1E293B', borderRadius: 10, padding: 12, maxHeight: 180 },
  codeTerminalText: { color: '#38BDF8', fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', lineHeight: 16 },
  terminalNoticeText: { fontSize: 10, color: '#9CA3AF', marginTop: 10, textAlign: 'center', fontWeight: '500', lineHeight: 14 }
});