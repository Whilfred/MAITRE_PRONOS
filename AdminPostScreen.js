import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  StatusBar,
  Platform 
} from 'react-native';
import { NotificationService } from './src/services/notificationService';

export default function AdminPostScreen() {
  const [loading, setLoading] = useState(false);
  
  // États de saisie des données du match
  const [league, setLeague] = useState('');
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [time, setTime] = useState('');
  
  // États de saisie des métriques du pronostic
  const [prediction, setPrediction] = useState('');
  const [odds, setOdds] = useState('');
  const [confidence, setConfidence] = useState('');
  
  // États de saisie des analyses détaillées
  const [iaPrediction, setIaPrediction] = useState('');
  const [stats, setStats] = useState('');
  const [analysis, setAnalysis] = useState('');
  
  // États des sélecteurs (Types de paris requis & Risques)
  const [selectedType, setSelectedType] = useState('Victoire Domicile');
  const [selectedRisk, setSelectedRisk] = useState('Faible');

  // Alignement strict avec les 11 types demandés au Module 4
  const predictionTypes = [
    'Victoire Domicile', 'Match Nul', 'Victoire Extérieur', 
    'Double Chance', 'BTTS', 'Over/Under', 'Score Exact', 
    'Handicap', 'Nombre de corners', 'Nombre de cartons', 'Buteur'
  ];

  const handlePublish = () => {
    // Validation stricte des données vitales avant soumission
    if (!homeTeam.trim() || !awayTeam.trim() || !prediction.trim() || !odds.trim() || !confidence.trim()) {
      Alert.alert(
        "Données incomplètes", 
        "Veuillez au moins renseigner les équipes, l'option de pronostic, la cote et l'indice de confiance."
      );
      return;
    }

    setLoading(true);

    // Simulation de la requête POST asynchrone vers ton API Laravel
    setTimeout(async () => {
      setLoading(false);
      
      try {
        // Déclenchement automatique du push pour avertir instantanément les clients VIP
        await NotificationService.sendLocalNotification(
          "👑 Nouveau Pronostic VIP !",
          `Alerte combiné : ${homeTeam} vs ${awayTeam} est disponible. Analyse de l'expert en ligne.`
        );
      } catch (error) {
        console.log("Erreur notification :", error);
      }

      Alert.alert(
        "Publication Validée",
        "Le pronostic a été enregistré avec succès et diffusé en temps réel sur les smartphones des abonnés.",
        [{ text: "Continuer", onPress: () => resetForm() }]
      );
    }, 1500);
  };

  const resetForm = () => {
    setLeague('');
    setHomeTeam('');
    setAwayTeam('');
    setTime('');
    setPrediction('');
    setOdds('');
    setConfidence('');
    setIaPrediction('');
    setStats('');
    setAnalysis('');
    setSelectedType('Victoire Domicile');
    setSelectedRisk('Faible');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER DE GESTION ADMIN */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Console d'Administration</Text>
        <Text style={styles.headerSubtitle}>Espace de publication des analyses et pronostics sportifs</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION 1 : BLOC MATCH */}
        <Text style={styles.sectionLabel}>1. Contexte du Match</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Championnat ou Coupe (ex: ⚽ Champions League)" 
          placeholderTextColor="#9CA3AF"
          value={league} 
          onChangeText={setLeague} 
        />
        <View style={styles.rowInputs}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            placeholder="Équipe Domicile" 
            placeholderTextColor="#9CA3AF"
            value={homeTeam} 
            onChangeText={setHomeTeam} 
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Équipe Extérieur" 
            placeholderTextColor="#9CA3AF"
            value={awayTeam} 
            onChangeText={setAwayTeam} 
          />
        </View>
        <TextInput 
          style={styles.input} 
          placeholder="Heure du coup d'envoi (ex: 18:45)" 
          placeholderTextColor="#9CA3AF"
          value={time} 
          onChangeText={setTime} 
        />

        {/* SECTION 2 : CONFIGURATION DU PARI */}
        <Text style={styles.sectionLabel}>2. Type de Pari & Cotes</Text>
        
        <Text style={styles.subLabel}>Sélectionner la catégorie obligatoire :</Text>
        <View style={styles.selectorContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectorScroll}>
            {predictionTypes.map((type) => (
              <TouchableOpacity 
                key={type} 
                style={[styles.selectorChip, selectedType === type && styles.chipActive]}
                onPress={() => setSelectedType(type)}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, selectedType === type && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <TextInput 
          style={styles.input} 
          placeholder="Pronostic exact (ex: Over 2.5, Victoire City, Les deux marquent)" 
          placeholderTextColor="#9CA3AF"
          value={prediction} 
          onChangeText={setPrediction} 
        />

        <View style={styles.rowInputs}>
          <TextInput 
            style={[styles.input, { flex: 1, marginRight: 8 }]} 
            placeholder="Cote du pari (ex: 1.85)" 
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={odds} 
            onChangeText={setOdds} 
          />
          <TextInput 
            style={[styles.input, { flex: 1 }]} 
            placeholder="Confiance globale % (ex: 85)" 
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={confidence} 
            onChangeText={setConfidence} 
          />
        </View>

        <Text style={styles.subLabel}>Évaluation du niveau de risque :</Text>
        <View style={styles.rowInputs}>
          {['Faible', 'Modéré', 'Élevé'].map((risk) => (
            <TouchableOpacity 
              key={risk} 
              style={[styles.riskButton, selectedRisk === risk && styles.riskActive]}
              onPress={() => setSelectedRisk(risk)}
              activeOpacity={0.7}
            >
              <Text style={[styles.riskText, selectedRisk === risk && styles.riskTextActive]}>{risk}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SECTION 3 : DATA & INTELLIGENCE */}
        <Text style={styles.sectionLabel}>3. Data, Contenu & Prédictions Algorithmiques</Text>
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Modélisation et prédiction générée par l'IA..." 
          placeholderTextColor="#9CA3AF"
          multiline={true}
          numberOfLines={3}
          value={iaPrediction} 
          onChangeText={setIaPrediction} 
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Statistiques clés et confrontations directes historiques..." 
          placeholderTextColor="#9CA3AF"
          multiline={true}
          numberOfLines={3}
          value={stats} 
          onChangeText={setStats} 
        />
        <TextInput 
          style={[styles.input, styles.textArea]} 
          placeholder="Analyse globale et éditoriale rédigée par l'expert..." 
          placeholderTextColor="#9CA3AF"
          multiline={true}
          numberOfLines={4}
          value={analysis} 
          onChangeText={setAnalysis} 
        />

        {/* BOUTON D'ACTION PRINCIPAL */}
        <TouchableOpacity 
          style={styles.publishButton} 
          onPress={handlePublish}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.publishButtonText}>Diffuser et Alerter les membres VIP</Text>
          )}
        </TouchableOpacity>

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
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  headerSubtitle: { 
    fontSize: 12, 
    color: '#2E7D32', 
    fontWeight: '600', 
    marginTop: 2,
    textAlign: 'center'
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 40 
  },
  sectionLabel: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    marginTop: 15, 
    marginBottom: 12 
  },
  subLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    color: '#6B7280', 
    marginBottom: 8, 
    marginTop: 4 
  },
  input: { 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 14, 
    color: '#111827', 
    marginBottom: 12 
  },
  rowInputs: { 
    flexDirection: 'row', 
    marginBottom: 4 
  },
  textArea: { 
    height: 75, 
    textAlignVertical: 'top' 
  },
  selectorContainer: {
    marginBottom: 12
  },
  selectorScroll: { 
    flexDirection: 'row'
  },
  selectorChip: { 
    backgroundColor: '#F3F4F6', 
    paddingVertical: 6, 
    paddingHorizontal: 14, 
    borderRadius: 20, 
    marginRight: 8, 
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center'
  },
  chipActive: { 
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32'
  },
  chipText: { 
    fontSize: 12, 
    color: '#4B5563', 
    fontWeight: '600' 
  },
  chipTextActive: { 
    color: '#FFFFFF' 
  },
  riskButton: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: '#E5E7EB', 
    paddingVertical: 10, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginHorizontal: 4, 
    marginBottom: 15 
  },
  riskActive: { 
    backgroundColor: '#2E7D32', 
    borderColor: '#2E7D32' 
  },
  riskText: { 
    fontSize: 13, 
    color: '#4B5563', 
    fontWeight: '600' 
  },
  riskTextActive: { 
    color: '#FFFFFF' 
  },
  publishButton: { 
    backgroundColor: '#2E7D32', 
    borderRadius: 12, 
    padding: 15, 
    alignItems: 'center', 
    marginTop: 15, 
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3
  },
  publishButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: 'bold' 
  }
});