import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Dimensions,
  Platform
} from 'react-native';

const { width } = Dimensions.get('window');

export default function StatsModule({ homeStats = {}, awayStats = {} }) {
  
  // --- SÉCURISATION DES DONNÉES (FALLBACKS PAR DÉFAUT) ---
  const safeHome = {
    classement: homeStats.classement || '-',
    forme: homeStats.forme || ['-', '-', '-', '-', '-'],
    serieVictoires: homeStats.serieVictoires || '0',
    butsMarques: homeStats.butsMarques || '0.00',
    butsEncaisses: homeStats.butsEncaisses || '0.00',
    cleanSheets: homeStats.cleanSheets || '0',
    bttsPercent: homeStats.bttsPercent || '0',
    over25Percent: homeStats.over25Percent || '0',
    xG: homeStats.xG || '0.00',
    xGA: homeStats.xGA || '0.00',
    possession: homeStats.possession || '50'
  };

  const safeAway = {
    classement: awayStats.classement || '-',
    forme: awayStats.forme || ['-', '-', '-', '-', '-'],
    serieVictoires: awayStats.serieVictoires || '0',
    butsMarques: awayStats.butsMarques || '0.00',
    butsEncaisses: awayStats.butsEncaisses || '0.00',
    cleanSheets: awayStats.cleanSheets || '0',
    bttsPercent: awayStats.bttsPercent || '0',
    over25Percent: awayStats.over25Percent || '0',
    xG: awayStats.xG || '0.00',
    xGA: awayStats.xGA || '0.00',
    possession: awayStats.possession || '50'
  };

  // --- LOGIQUE DE COULEUR POUR LES BADGES DE FORME ---
  const renderFormBadge = (result, index) => {
    let bgColor = '#9CA3AF'; // Gris par défaut (Match nul ou inconnu)
    if (result === 'V') bgColor = '#2E7D32'; // Vert (Victoire)
    if (result === 'D') bgColor = '#DC2626'; // Rouge (Défaite)

    return (
      <View key={index} style={[styles.formBadge, { backgroundColor: bgColor }]}>
        <Text style={styles.formBadgeText}>{result}</Text>
      </View>
    );
  };

  // --- COMPOSANT DE LIGNE GRAPHIQUE COMPARATIVE ---
  const StatRow = ({ label, homeValue, awayValue, isPercentage = false, inverseColors = false }) => {
    const valHome = parseFloat(homeValue) || 0;
    const valAway = parseFloat(awayValue) || 0;
    const total = valHome + valAway;
    
    // Distribution de la jauge (50/50 si le total est nul)
    const homeFlex = total > 0 ? (valHome / total) : 0.5;
    const awayFlex = total > 0 ? (valAway / total) : 0.5;

    // Ajustement de l'indicateur de couleur selon la nature de la métrique
    const homeBarColor = inverseColors ? '#DC2626' : '#2E7D32';
    const awayBarColor = inverseColors ? '#2E7D32' : '#111827';

    return (
      <View style={styles.statRowContainer}>
        <View style={styles.statLabels}>
          <Text style={styles.statValueHome}>{homeValue}{isPercentage ? '%' : ''}</Text>
          <Text style={styles.statLabelText}>{label}</Text>
          <Text style={styles.statValueAway}>{awayValue}{isPercentage ? '%' : ''}</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressSide, { flex: homeFlex, backgroundColor: homeBarColor, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }] || 0} />
          <View style={[styles.progressSide, { flex: awayFlex, backgroundColor: awayBarColor, borderTopRightRadius: 4, borderBottomRightRadius: 4 }] || 0} />
        </View>
      </View>
    );
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      
      {/* SECTION 1 : CLASSEMENT & DYNAMIQUE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📊 Position & Dynamique</Text>
        
        <View style={styles.rowGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridSub}>Classement Dom.</Text>
            <Text style={styles.gridValue}>#{safeHome.classement}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridSub}>Classement Ext.</Text>
            <Text style={[styles.gridValue, { color: '#111827' }]}>#{safeAway.classement}</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formRow}>
            {safeHome.forme.map((res, i) => renderFormBadge(res, i))}
          </View>
          <Text style={styles.formLabelCenter}>Série (5 derniers)</Text>
          <View style={styles.formRow}>
            {safeAway.forme.map((res, i) => renderFormBadge(res, i))}
          </View>
        </View>

        <StatRow 
          label="Série de victoires consécutives" 
          homeValue={safeHome.serieVictoires} 
          awayValue={safeAway.serieVictoires} 
        />
      </View>

      {/* SECTION 2 : PERFORMANCE BUTS & MARCHÉS SOUHAITÉS */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚽ Efficacité Offensive & Défensive</Text>
        <StatRow label="Buts marqués / match" homeValue={safeHome.butsMarques} awayValue={safeAway.butsMarques} />
        <StatRow label="Buts encaissés / match" homeValue={safeHome.butsEn