#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module de Résultats & Statistiques en Direct - PRONOS-APP
 * Gère l'affichage des scores en temps réel, de la possession, des tirs et de la frise chronologique des événements.
 * Design haut de gamme aligné sur la charte de l'entreprise (Vert & Blanc) et optimisé pour la production.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
  SafeAreaView
} from 'react-native';

export default function LiveResultsScreen() {
  // Simulation de l'état d'un match en direct (Manchester City vs Real Madrid)
  const [matchData, setMatchData] = useState({
    homeTeam: 'Man. City',
    awayTeam: 'Real Madrid',
    homeScore: 2,
    awayScore: 1,
    minute: 74,
    status: 'LIVE',
    stats: {
      possessionHome: 58,
      possessionAway: 42,
      shotsOnTargetHome: 6,
      shotsOnTargetAway: 3,
      cornersHome: 7,
      cornersAway: 4,
      foulsHome: 8,
      foulsAway: 11
    },
    timeline: [
      { id: '1', min: 22, type: 'GOAL', team: 'HOME', player: 'E. Haaland', detail: 'Passe de K. De Bruyne' },
      { id: '2', min: 39, type: 'CARD_YELLOW', team: 'AWAY', player: 'Vini Jr.', detail: 'Anti-jeu' },
      { id: '3', min: 55, type: 'GOAL', team: 'AWAY', player: 'J. Bellingham', detail: 'Tir du pied droit' },
      { id: '4', min: 68, type: 'GOAL', team: 'HOME', player: 'P. Foden', detail: 'Frappe lointaine' },
      { id: '5', min: 72, type: 'CARD_RED', team: 'AWAY', player: 'A. Rüdiger', detail: 'Tacle dangereux' },
    ]
  });

  // Émulation d'un flux de données temps réel (Simulation d'une connexion WebSocket de production)
  useEffect(() => {
    const liveUpdateInterval = setInterval(() => {
      setMatchData((prevData) => {
        if (prevData.minute >= 90) {
          clearInterval(liveUpdateInterval);
          return { ...prevData, status: 'FINISHED' };
        }
        
        // Simulation aléatoire d'un fait de match (but ou carte) à la 78ème minute pour l'exemple
        if (prevData.minute === 77) {
          return {
            ...prevData,
            minute: prevData.minute + 1,
            homeScore: prevData.homeScore + 1,
            stats: {
              ...prevData.stats,
              shotsOnTargetHome: prevData.stats.shotsOnTargetHome + 1
            },
            timeline: [
              ...prevData.timeline,
              { id: '6', min: 78, type: 'GOAL', team: 'HOME', player: 'K. De Bruyne', detail: 'Reprise de volée' }
            ]
          };
        }

        return { ...prevData, minute: prevData.minute + 1 };
      });
    }, 8000); // Progression toutes les 8 secondes pour la démonstration

    return () => clearInterval(liveUpdateInterval);
  }, []);

  /**
   * Tri chronologique de la timeline (Tri décroissant pour afficher le fait le plus récent en premier)
   */
  const sortedTimeline = useMemo(() => {
    return [...matchData.timeline].sort((a, b) => b.min - a.min);
  }, [matchData.timeline]);

  /**
   * Composant Barre de Progression personnalisé unifié et performant (Évite les dépendances obsolètes)
   */
  const CustomStatBar = ({ homeValue, awayValue }) => {
    const total = homeValue + awayValue;
    const percentage = total > 0 ? (homeValue / total) * 100 : 50;

    return (
      <View style={styles.barTrack}>
        <View style={[styles.barFillHome, { width: `${percentage}%` }]} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#111827" />

      {/* PANNEAU SCORES STYLE TABLEAU DE BORD STADE (HERO BOARD) */}
      <View style={styles.scoreBoardHero}>
        <View style={styles.liveBadgeRow}>
          <View style={[styles.pulseDot, matchData.status === 'LIVE' && styles.pulseDotActive]} />
          <Text style={styles.liveStatusText}>
            {matchData.status === 'LIVE' ? `DIRECT • ${matchData.minute}'` : 'MATCH TERMINÉ'}
          </Text>
        </View>

        <View style={styles.teamsScoreRow}>
          <View style={styles.teamBlock}>
            <Text style={styles.teamNameTextLeft}>{matchData.homeTeam}</Text>
          </View>

          <View style={styles.scoreDisplayBox}>
            <Text style={styles.scoreValueText}>{matchData.homeScore} - {matchData.awayScore}</Text>
          </View>

          <View style={styles.teamBlock}>
            <Text style={styles.teamNameTextRight}>{matchData.awayTeam}</Text>
          </View>
        </View>
      </View>

      {/* FLUX DES DONNÉES STATISTIQUES ET ÉVÉNEMENTS */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentPadding}>
        
        {/* SECTION STATISTIQUES DES JEUX */}
        <Text style={styles.sectionHeadingTitle}>📊 Statistiques de la rencontre</Text>
        <View style={styles.statsDashboardCard}>
          
          {/* Métrique : Possession */}
          <View style={styles.statMetricContainer}>
            <View style={styles.metricLabelArea}>
              <Text style={styles.metricValueTextLeft}>{matchData.stats.possessionHome}%</Text>
              <Text style={styles.metricNameText}>Possession</Text>
              <Text style={styles.metricValueTextRight}>{matchData.stats.possessionAway}%</Text>
            </View>
            <CustomStatBar homeValue={matchData.stats.possessionHome} awayValue={matchData.stats.possessionAway} />
          </View>

          {/* Métrique : Tirs Cadrés */}
          <View style={styles.statMetricContainer}>
            <View style={styles.metricLabelArea}>
              <Text style={styles.metricValueTextLeft}>{matchData.stats.shotsOnTargetHome}</Text>
              <Text style={styles.metricNameText}>Tirs Cadrés</Text>
              <Text style={styles.metricValueTextRight}>{matchData.stats.shotsOnTargetAway}</Text>
            </View>
            <CustomStatBar homeValue={matchData.stats.shotsOnTargetHome} awayValue={matchData.stats.shotsOnTargetAway} />
          </View>

          {/* Métrique : Corners */}
          <View style={styles.statMetricContainer}>
            <View style={styles.metricLabelArea}>
              <Text style={styles.metricValueTextLeft}>{matchData.stats.cornersHome}</Text>
              <Text style={styles.metricNameText}>Corners</Text>
              <Text style={styles.metricValueTextRight}>{matchData.stats.cornersAway}</Text>
            </View>
            <CustomStatBar homeValue={matchData.stats.cornersHome} awayValue={matchData.stats.cornersAway} />
          </View>

          {/* Métrique : Fautes */}
          <View style={styles.statMetricContainer}>
            <View style={styles.metricLabelArea}>
              <Text style={styles.metricValueTextLeft}>{matchData.stats.foulsHome}</Text>
              <Text style={styles.metricNameText}>Fautes commises</Text>
              <Text style={styles.metricValueTextRight}>{matchData.stats.foulsAway}</Text>
            </View>
            <CustomStatBar homeValue={matchData.stats.foulsAway} awayValue={matchData.stats.foulsHome} /> 
            {/* Note: Inversion logique ici pour que la barre affiche la couleur de l'équipe la plus disciplinée */}
          </View>

        </View>

        {/* SECTION CHRONOLOGIE DES ACTIONS (TIMELINE) */}
        <Text style={styles.sectionHeadingTitle}>⏱️ Fil chronologique des événements</Text>
        <View style={styles.timelineCard}>
          {sortedTimeline.map((event, index) => (
            <View key={event.id} style={styles.timelineEventRow}>
              <View style={styles.timeMinuteBadge}>
                <Text style={styles.timeMinuteText}>{event.min}'</Text>
              </View>
              
              {index !== sortedTimeline.length - 1 && <View style={styles.verticalTimelineConnector} />}

              <View style={[styles.eventDetailsBox, event.team === 'AWAY' && styles.eventDetailsBoxRight]}>
                <Text style={styles.eventPlayerName}>
                  {event.type === 'GOAL' ? '⚽ ' : event.type === 'CARD_RED' ? '🟥 ' : '🟨 '}
                  {event.player}
                </Text>
                <Text style={styles.eventDetailSubText}>{event.detail}</Text>
              </View>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContentPadding: { padding: 16, paddingBottom: 35 },
  
  // Tableau d'affichage supérieur (Hero Scoreboard)
  scoreBoardHero: { backgroundColor: '#111827', padding: 22, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, alignItems: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  liveBadgeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20, marginBottom: 16 },
  pulseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#9CA3AF', marginRight: 8 },
  pulseDotActive: { backgroundColor: '#EF4444' },
  liveStatusText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold', letterSpacing: 0.6 },
  
  teamsScoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
  teamBlock: { flex: 2 },
  teamNameTextLeft: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'left' },
  teamNameTextRight: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  scoreDisplayBox: { flex: 1.4, backgroundColor: '#2E7D32', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, alignItems: 'center' },
  scoreValueText: { color: '#FFFFFF', fontSize: 21, fontWeight: '900', letterSpacing: 0.5 },
  
  // Titres structurels
  sectionHeadingTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginTop: 22, marginBottom: 12, paddingHorizontal: 2, letterSpacing: 0.2 },
  
  // Carte du Dashboard Statistiques
  statsDashboardCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  statMetricContainer: { marginVertical: 12 },
  metricLabelArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  metricValueTextLeft: { fontSize: 13, fontWeight: 'bold', color: '#2E7D32', width: 40, textAlign: 'left' },
  metricValueTextRight: { fontSize: 13, fontWeight: 'bold', color: '#111827', width: 40, textAlign: 'right' },
  metricNameText: { fontSize: 12, color: '#4B5563', fontWeight: '700' },
  
  // Conception de la jauge statistique unifiée
  barTrack: { height: 6, width: '100%', backgroundColor: '#111827', borderRadius: 3, overflow: 'hidden' },
  barFillHome: { height: '100%', backgroundColor: '#2E7D32', borderRadius: 3 },

  // Conception de la Frise Chronologique (Timeline)
  timelineCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  timelineEventRow: { flexDirection: 'row', alignItems: 'center', minHeight: 60, position: 'relative' },
  timeMinuteBadge: { width: 34, height: 34, backgroundColor: '#F3F4F6', borderRadius: 17, justifyContent: 'center', alignItems: 'center', zIndex: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  timeMinuteText: { fontSize: 11, fontWeight: 'bold', color: '#374151' },
  verticalTimelineConnector: { width: 2, backgroundColor: '#E5E7EB', position: 'absolute', left: 16, top: 34, bottom: -26, zIndex: 1 },
  eventDetailsBox: { flex: 1, marginLeft: 16, backgroundColor: '#F9FAFB', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  eventDetailsBoxRight: { borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
  eventPlayerName: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  eventDetailSubText: { fontSize: 11, color: '#6B7280', marginTop: 2, fontWeight: '500' }
});