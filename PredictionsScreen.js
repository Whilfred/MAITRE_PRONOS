import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform 
} from 'react-native';

export default function PredictionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('TOUS');
  const [expandedMatch, setExpandedMatch] = useState(null);

  // Configuration stricte des 11 types de pronostics requis + l'option globale
  const predictionTypes = [
    'TOUS', 'Victoire Domicile', 'Match Nul', 'Victoire Extérieur', 
    'Double Chance', 'BTTS', 'Over/Under', 'Score Exact', 
    'Handicap', 'Nombre de corners', 'Nombre de cartons', 'Buteur'
  ];

  // Base de données simulée version pro contenant l'intégralité des métriques exigées
  const pronosData = [
    {
      id: 1,
      homeTeam: 'Manchester City',
      awayTeam: 'Arsenal',
      league: '⚽ Premier League',
      time: '19:45',
      type: 'Over/Under',
      prediction: 'Over 2.5 Buts',
      confidence: 87,
      odds: '1.68',
      risk: 'Faible',
      iaPrediction: "L'algorithme neuronal détecte une probabilité de 89.4% de dépassement de la barre des 2.5 buts, basée sur les blocs hauts récents des deux techniciens. Score simulé par l'IA : 3-1.",
      stats: 'Manchester City inscrit en moyenne 2.41 buts par match à domicile. Arsenal a trouvé le chemin des filets lors de 91% de ses déplacements cette saison.',
      analysis: "Un choc au sommet déterminant pour l'issue du titre de champion. Les deux formations affichent des lignes offensives complètes et performantes. Manchester City se doit d'attaquer à domicile, laissant des espaces pour les transitions rapides de l'adversaire."
    },
    {
      id: 2,
      homeTeam: 'Real Madrid',
      awayTeam: 'FC Barcelone',
      league: '⚽ LaLiga',
      time: '21:00',
      type: 'BTTS',
      prediction: 'Oui (Les deux équipes marquent)',
      confidence: 82,
      odds: '1.55',
      risk: 'Faible',
      iaPrediction: "91.8% de chances de voir les deux filets trembler selon la base historique croisée des 12 derniers Clasicos officiels.",
      stats: '8 des 10 derniers Clasicos toutes compétitions confondues se sont conclus avec la validation du BTTS.',
      analysis: "La Maison Blanche est redoutable à domicile mais concède régulièrement des occasions. Le secteur offensif catalan est en pleine confiance, garantissant un match ouvert et rythmé."
    },
    {
      id: 3,
      homeTeam: 'Marseille',
      awayTeam: 'Paris SG',
      league: '⚽ Ligue 1',
      time: '20:45',
      type: 'Nombre de cartons',
      prediction: 'Plus de 4.5 Cartons',
      confidence: 79,
      odds: '1.75',
      risk: 'Modéré',
      iaPrediction: "L'intensité physique du Classico associée au profil de l'arbitre désigné projette une moyenne statistique de 5.2 cartons distribués.",
      stats: 'Moyenne de 5.4 cartons par match sur les confrontations directes au Vélodrome ces 3 dernières années.',
      analysis: "Un match à haute tension où la rivalité historique prend le pas sur la tactique pure. Les duels au milieu de terrain s'annoncent rugueux dès le premier quart d'heure."
    }
  ];

  // Gestion du filtrage intelligent sans conflits de casse ou d'espaces indésirables
  const filteredPronos = selectedFilter === 'TOUS' 
    ? pronosData 
    : pronosData.filter(prono => prono.type.trim().toLowerCase() === selectedFilter.trim().toLowerCase());

  const toggleExpand = (id) => {
    setExpandedMatch(expandedMatch === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* EN-TÊTE PROFESSIONNEL */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pronostics VIP</Text>
        <Text style={styles.headerSubtitle}>Analyses d'experts, métriques avancées et prédictions IA</Text>
      </View>

      {/* BARRE HORIZONTALE DE FILTRES DYNAMIQUES */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {predictionTypes.map((type) => (
            <TouchableOpacity 
              key={type} 
              style={[styles.filterButton, selectedFilter === type && styles.filterButtonActive]}
              onPress={() => setSelectedFilter(type)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterButtonText, selectedFilter === type && styles.filterButtonTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* FLUX PRINCIPAL DES PRONOSTICS */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredPronos.length > 0 ? (
          filteredPronos.map((item) => (
            <View key={item.id} style={styles.pronoCard}>
              
              {/* Infos Ligue et Horaire */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.leagueText}>{item.league}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>

              {/* Match */}
              <Text style={styles.teamsText}>
                {item.homeTeam} <Text style={styles.vsText}>vs</Text> {item.awayTeam}
              </Text>
              
              {/* Encadré Principal Pronostic & Cote */}
              <View style={styles.mainInfoRow}>
                <View style={styles.pronoWrapper}>
                  <Text style={styles.pronoLabel}>Pronostic : </Text>
                  <Text style={styles.pronoValue}>{item.prediction}</Text>
                </View>
                <View style={styles.oddsWrapper}>
                  <Text style={styles.oddsText}>Cote : {item.odds}</Text>
                </View>
              </View>

              {/* Ligne des Métriques Spécifiques */}
              <View style={styles.metricsRow}>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Confiance</Text>
                  <Text style={styles.metricValue}>{item.confidence}%</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Risque</Text>
                  <Text style={[
                    styles.metricValue, 
                    item.risk === 'Faible' ? styles.riskLow : styles.riskMedium
                  ]}>
                    {item.risk}
                  </Text>
                </View>
                <View style={styles.metricBox}>
                  <Text style={styles.metricLabel}>Type de Pari</Text>
                  <Text style={styles.metricValueText} numberOfLines={1}>{item.type}</Text>
                </View>
              </View>

              {/* Bouton d'action pour dérouler les détails */}
              <TouchableOpacity 
                style={styles.expandButton} 
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.expandButtonText}>
                  {expandedMatch === item.id ? "Masquer les détails" : "Voir l'analyse détaillée & IA"}
                </Text>
              </TouchableOpacity>

              {/* CONTENU EXTENSIBLE (COMPLÈTEMENT DÉTAILLÉ) */}
              {expandedMatch === item.id && (
                <View style={styles.expandedContent}>
                  <View style={styles.divider} />
                  
                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>🤖 Prediction IA</Text>
                    <Text style={styles.detailBody}>{item.iaPrediction}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>📊 Statistiques</Text>
                    <Text style={styles.detailBody}>{item.stats}</Text>
                  </View>

                  <View style={styles.detailSection}>
                    <Text style={styles.detailTitle}>📝 Analyse</Text>
                    <Text style={styles.detailBody}>{item.analysis}</Text>
                  </View>
                </View>
              )}

            </View>
          ))
        ) : (
          <View style={styles.noDataWrapper}>
            <Text style={styles.noDataText}>Aucun pronostic disponible dans la catégorie "{selectedFilter}" pour le moment.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  header: { 
    backgroundColor: '#FFFFFF', 
    paddingHorizontal: 20, 
    paddingTop: Platform.OS === 'ios' ? 25 : 15, 
    paddingBottom: 15, 
    borderBottomWidth: 1, 
    borderColor: '#EAEAEA',
    alignItems: 'center'
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#2E7D32' 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: '#666666', 
    textAlign: 'center', 
    marginTop: 4,
    lineHeight: 16
  },
  filterContainer: { 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderColor: '#EAEAEA' 
  },
  filterScroll: { 
    paddingHorizontal: 15 
  },
  filterButton: { 
    backgroundColor: '#F3F4F6', 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 20, 
    marginRight: 8, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  filterButtonActive: { 
    backgroundColor: '#2E7D32', 
    borderColor: '#2E7D32' 
  },
  filterButtonText: { 
    fontSize: 13, 
    color: '#4B5563', 
    fontWeight: '600' 
  },
  filterButtonTextActive: { 
    color: '#FFFFFF' 
  },
  scrollContent: { 
    padding: 16 
  },
  pronoCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    elevation: 2, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 0.04, 
    shadowRadius: 3 
  },
  cardHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  leagueText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#6B7280' 
  },
  timeText: { 
    fontSize: 12, 
    color: '#9CA3AF' 
  },
  teamsText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#111827', 
    marginBottom: 12 
  },
  vsText: { 
    color: '#2E7D32', 
    fontWeight: '400' 
  },
  mainInfoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#F9FAFB', 
    padding: 12, 
    borderRadius: 12, 
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  pronoWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    flex: 1,
    paddingRight: 8
  },
  pronoLabel: { 
    fontSize: 14, 
    color: '#4B5563' 
  },
  pronoValue: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  oddsWrapper: { 
    backgroundColor: '#E8F5E9', 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 8 
  },
  oddsText: { 
    color: '#2E7D32', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  metricsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 14 
  },
  metricBox: { 
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: '#FAFAFA', 
    paddingVertical: 8, 
    borderRadius: 8, 
    marginHorizontal: 4, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  metricLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    marginBottom: 4 
  },
  metricValue: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  metricValueText: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#111827', 
    textAlign: 'center',
    paddingHorizontal: 2
  },
  riskLow: { 
    color: '#2E7D32' 
  },
  riskMedium: { 
    color: '#D97706' 
  },
  expandButton: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#2E7D32', 
    borderRadius: 10, 
    padding: 11, 
    alignItems: 'center' 
  },
  expandButtonText: { 
    color: '#2E7D32', 
    fontSize: 13, 
    fontWeight: 'bold' 
  },
  expandedContent: { 
    marginTop: 4 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#E5E7EB', 
    marginVertical: 12 
  },
  detailSection: { 
    marginBottom: 12 
  },
  detailTitle: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    marginBottom: 4 
  },
  detailBody: { 
    fontSize: 13, 
    color: '#374151', 
    lineHeight: 18, 
    textAlign: 'justify' 
  },
  noDataWrapper: {
    paddingVertical: 40,
    alignItems: 'center'
  },
  noDataText: { 
    textAlign: 'center', 
    color: '#9CA3AF', 
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 20
  }
});