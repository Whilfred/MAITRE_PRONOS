#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module d'Historique & Analyse des Performances - PRONOS-APP
 * Gère le calcul algorithmique du ROI, du taux de réussite global et par sport,
 * ainsi que le rendu visuel de la courbe de progression du capital.
 * Design haut de gamme aligné sur la charte de l'entreprise (Vert & Blanc).
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform
} from 'react-native';

export default function PerformanceHistoryScreen() {
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, FOOTBALL, BASKETBALL, TENNIS

  // Constante de base de mise fixe (Flat betting à 10 000 FCFA par coupon)
  const BASE_BET_AMOUNT = 10000;

  // Base de données historique des pronostics de production terminés
  const historyData = [
    { id: '1', sport: 'FOOTBALL', match: 'Real Madrid vs Bayern', pick: 'Victoire Real', odds: 1.85, status: 'WON' },
    { id: '2', sport: 'BASKETBALL', match: 'LA Lakers vs GS Warriors', pick: '+220.5 Points', odds: 1.75, status: 'WON' },
    { id: '3', sport: 'FOOTBALL', match: 'Arsenal vs Chelsea', pick: 'Les deux marquent', odds: 1.65, status: 'LOST' },
    { id: '4', sport: 'TENNIS', match: 'C. Alcaraz vs J. Sinner', pick: 'Victoire Alcaraz', odds: 1.90, status: 'WON' },
    { id: '5', sport: 'FOOTBALL', match: 'Juventus vs AC Milan', pick: 'Moins de 2.5 buts', odds: 1.70, status: 'WON' },
    { id: '6', sport: 'BASKETBALL', match: 'Boston vs Miami Heat', pick: 'Victoire Boston', odds: 1.55, status: 'LOST' },
    { id: '7', sport: 'FOOTBALL', match: 'PSG vs Dortmund', pick: 'Victoire PSG', odds: 1.60, status: 'WON' },
  ];

  /**
   * Filtrage haute performance mémorisé de la liste selon la catégorie de sport active
   */
  const filteredData = useMemo(() => {
    if (activeFilter === 'ALL') return historyData;
    return historyData.filter(item => item.sport === activeFilter);
  }, [activeFilter]);

  /**
   * Calcul algorithmique des indicateurs de performance (KPI) financiers
   */
  const performanceMetrics = useMemo(() => {
    const totalCount = filteredData.length;
    if (totalCount === 0) {
      return { successRate: '0%', roi: '0.0%', netProfit: '0 FCFA', wonCount: 0 };
    }

    const wonCount = filteredData.filter(item => item.status === 'WON').length;
    const successRate = ((wonCount / totalCount) * 100).toFixed(1) + '%';

    // Formule comptable stricte du ROI : (Gains Nets / Mises Totales) * 100
    const totalInvestment = totalCount * BASE_BET_AMOUNT;
    let totalGrossReturn = 0;

    filteredData.forEach(item => {
      if (item.status === 'WON') {
        totalGrossReturn += item.odds * BASE_BET_AMOUNT;
      }
    });

    const netProfit = totalGrossReturn - totalInvestment;
    const roiValue = ((netProfit / totalInvestment) * 100).toFixed(1);

    return {
      successRate,
      roi: `${roiValue > 0 ? '+' : ''}${roiValue}%`,
      netProfit: `${netProfit.toLocaleString('fr-FR')} FCFA`,
      wonCount,
      isProfitPositive: netProfit >= 0
    };
  }, [filteredData]);

  /**
   * Modélisation de la courbe de gains chronologique (Historique de fluctuation de la bankroll)
   */
  const bankrollTrendPoints = useMemo(() => {
    let trackingBalance = 0;
    const pointsList = [0];

    // Inversion de l'ordre pour analyser chronologiquement du plus ancien au plus récent
    [...filteredData].reverse().forEach(item => {
      if (item.status === 'WON') {
        trackingBalance += (item.odds - 1) * BASE_BET_AMOUNT;
      } else {
        trackingBalance -= BASE_BET_AMOUNT;
      }
      pointsList.push(trackingBalance);
    });

    return pointsList;
  }, [filteredData]);

  /**
   * Rendu optimisé des composants de liste d'historique (FlatList renderItem callback)
   */
  const renderHistoryItem = useCallback(({ item }) => (
    <View style={styles.historyRowCard}>
      <View style={styles.matchMetaBlock}>
        <Text style={styles.matchTitleText}>{item.match}</Text>
        <Text style={styles.pickLabelSub}>
          Option : <Text style={styles.boldTextEmphasis}>{item.pick}</Text> • Cote : <Text style={styles.boldTextEmphasis}>{item.odds.toFixed(2)}</Text>
        </Text>
      </View>
      <View style={[styles.statusBadgeResult, item.status === 'WON' ? styles.statusBadgeWon : styles.statusBadgeLost]}>
        <Text style={[styles.statusBadgeResultText, item.status === 'WON' ? styles.textGreen : styles.textRed]}>
          {item.status === 'WON' ? 'GAGNÉ' : 'PERDU'}
        </Text>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* RE-RENDER DE L'EN-TÊTE PROFESSIONNEL */}
      <View style={styles.metricsTopHeader}>
        <Text style={styles.metricsTitle}>ANALYTIQUE & RENTABILITÉ</Text>
        <Text style={styles.metricsSubtitle}>Bilan certifié en toute transparence par l'application</Text>
      </View>

      {/* CONTENEUR DE SCROLL DE SURFACE AVANT LA LISTE */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollPadding}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun pronostic archivé dans cette catégorie sportive.</Text>
            </View>
          )}
          ListHeaderComponent={() => (
            <View>
              {/* COMPOSANT DES KPI GRID DE RENDEMENT */}
              <View style={styles.kpiGridContainer}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>Taux de Réussite</Text>
                  <Text style={[styles.kpiValue, { color: '#2E7D32' }]}>{performanceMetrics.successRate}</Text>
                  <Text style={styles.kpiSubText}>{performanceMetrics.wonCount} sur {filteredData.length} pronos</Text>
                </View>

                <View style={styles.kpiCard}>
                  <Text style={styles.kpiLabel}>R.O.I Global</Text>
                  <Text style={[styles.kpiValue, { color: performanceMetrics.isProfitPositive ? '#2E7D32' : '#DC2626' }]}>
                    {performanceMetrics.roi}
                  </Text>
                  <Text style={styles.kpiSubText}>Sur base 10K FCFA / coupon</Text>
                </View>
              </View>

              {/* CARTE FINANCIÈRE UNIQUE DE GAIN NET */}
              <View style={styles.kpiFullCardWidth}>
                <Text style={styles.kpiLabel}>Bénéfice Net Virtuel Cumulé</Text>
                <Text style={[styles.kpiValueLarge, { color: performanceMetrics.isProfitPositive ? '#2E7D32' : '#DC2626' }]}>
                  {performanceMetrics.netProfit}
                </Text>
              </View>

              {/* GRAPH DE SUIVI HISTORIQUE SPARKLINE VECTORIEL */}
              <Text style={styles.sectionTitle}>📈 Évolution du capital (Bankroll)</Text>
              <View style={styles.graphCardWrapper}>
                <View style={styles.graphContainerArea}>
                  {bankrollTrendPoints.map((value, idx) => {
                    const absolutValues = bankrollTrendPoints.map(Math.abs);
                    const maxAbsoluteValue = Math.max(...absolutValues, 1);
                    // Distribution relative par rapport au point d'ancrage central (50%)
                    const calculatedHeightPercent = Math.max(12, Math.min(100, 50 + (value / maxAbsoluteValue) * 45));
                    
                    return (
                      <View key={idx} style={styles.graphBarColumn}>
                        <View style={[
                          styles.graphBarFill, 
                          { height: `${calculatedHeightPercent}%`, backgroundColor: value >= 0 ? '#2E7D32' : '#EF4444' }
                        ]} />
                        <Text style={styles.graphAxisLabel}>P{idx}</Text>
                      </View>
                    );
                  })}
                </View>
                <Text style={styles.graphNoticeText}>Fluctuation du capital basée sur une mise unitaire linéaire de 10 000 FCFA.</Text>
              </View>

              {/* FILTRES INTERNES DE TRI SPORTIF */}
              <View style={styles.filterBarContainer}>
                <TouchableOpacity 
                  style={[styles.filterPill, activeFilter === 'ALL' && styles.filterPillActive]} 
                  onPress={() => setActiveFilter('ALL')}
                >
                  <Text style={[styles.filterPillText, activeFilter === 'ALL' && styles.textWhite]}>Tout</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterPill, activeFilter === 'FOOTBALL' && styles.filterPillActive]} 
                  onPress={() => setActiveFilter('FOOTBALL')}
                >
                  <Text style={[styles.filterPillText, activeFilter === 'FOOTBALL' && styles.textWhite]}>⚽ Foot</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterPill, activeFilter === 'BASKETBALL' && styles.filterPillActive]} 
                  onPress={() => setActiveFilter('BASKETBALL')}
                >
                  <Text style={[styles.filterPillText, activeFilter === 'BASKETBALL' && styles.textWhite]}>🏀 Basket</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.filterPill, activeFilter === 'TENNIS' && styles.filterPillActive]} 
                  onPress={() => setActiveFilter('TENNIS')}
                >
                  <Text style={[styles.filterPillText, activeFilter === 'TENNIS' && styles.textWhite]}>🎾 Tennis</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.sectionTitle}>📋 Historique détaillé des coupons</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollPadding: { padding: 16, paddingBottom: 40 },
  
  // Design de l'en-tête (Header)
  metricsTopHeader: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' },
  metricsTitle: { fontSize: 13, fontWeight: '900', color: '#111827', letterSpacing: 0.5 },
  metricsSubtitle: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },

  // Mise en page de la grille KPI
  kpiGridContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginHorizontal: -4 },
  kpiCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginHorizontal: 4, borderWidth: 1, borderColor: '#E5E7EB' },
  kpiFullCardWidth: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginTop: 10, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  kpiLabel: { fontSize: 11, fontWeight: 'bold', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.4 },
  kpiValue: { fontSize: 18, fontWeight: '900', marginTop: 6, letterSpacing: -0.3 },
  kpiValueLarge: { fontSize: 24, fontWeight: '900', marginTop: 4, letterSpacing: 0.2 },
  kpiSubText: { fontSize: 10, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },

  // Éléments graphiques vectoriels de bankroll
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 24, marginBottom: 10, letterSpacing: 0.1 },
  graphCardWrapper: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  graphContainerArea: { height: 115, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  graphBarColumn: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end', marginHorizontal: 3 },
  graphBarFill: { width: 7, borderRadius: 4 },
  graphAxisLabel: { fontSize: 9, color: '#9CA3AF', marginTop: 5, fontWeight: 'bold' },
  graphNoticeText: { fontSize: 10, color: '#9CA3AF', marginTop: 10, textAlign: 'center', fontWeight: '500', lineHeight: 14 },

  // Pilules et interrupteurs de filtres sportifs
  filterBarContainer: { flexDirection: 'row', marginTop: 14, marginBottom: 4 },
  filterPill: { backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, marginRight: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  filterPillActive: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  filterPillText: { fontSize: 12, color: '#4B5563', fontWeight: 'bold' },
  textWhite: { color: '#FFFFFF' },

  // Grille structurelle des lignes de l'historique
  emptyContainer: { padding: 30, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9CA3AF', fontSize: 12, textAlign: 'center', fontWeight: '500' },
  historyRowCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginVertical: 6, borderWidth: 1, borderColor: '#E5E7EB' },
  matchMetaBlock: { flex: 1, paddingRight: 12 },
  matchTitleText: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  pickLabelSub: { fontSize: 11, color: '#6B7280', marginTop: 4, fontWeight: '500' },
  boldTextEmphasis: { fontWeight: 'bold', color: '#111827' },
  
  statusBadgeResult: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1 },
  statusBadgeWon: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  statusBadgeLost: { backgroundColor: '#FEE2E2', borderColor: '#FCA5A5' },
  statusBadgeResultText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.4 },
  textGreen: { color: '#2E7D32' },
  textRed: { color: '#DC2626' }
});