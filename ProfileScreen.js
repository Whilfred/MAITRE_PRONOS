import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  Platform,
  StatusBar
} from 'react-native';
import api from './src/services/api';

export default function ProfileScreen({ user, onLogout }) {
  const [name, setName] = useState(user?.name || 'Utilisateur');
  const [email, setEmail] = useState(user?.email || '');
  const [country, setCountry] = useState('Burkina Faso'); 
  const [lang, setLang] = useState('Français');
  const [loading, setLoading] = useState(false);

  // Exemple d'historique de pronostics structuré pour illustrer le module
  const mockHistory = [
    { id: 1, match: 'Real Madrid - FC Barcelone', bet: 'Victoire Real Madrid', status: 'Gagné', date: '24/05/2026' },
    { id: 2, match: 'Chelsea - Arsenal', bet: 'Plus de 2.5 buts', status: 'Perdu', date: '22/05/2026' },
  ];

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert('Champs requis', 'Le nom complet ne peut pas être vide.');
      return;
    }

    setLoading(true);
    try {
      // Simulation ou appel de mise à jour sur ton endpoint Laravel
      // const response = await api.put('/user/update', { name, country, lang });
      
      Alert.alert('Profil mis à jour', 'Vos modifications ont été enregistrées avec succès.');
    } catch (error) {
      console.log('[Profile Update Error]:', error);
      Alert.alert('Erreur', 'Impossible de sauvegarder les modifications sur le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAvatar = () => {
    Alert.alert('Photo de profil', 'L\'intégration de la galerie photo (Expo ImagePicker) sera ajoutée à l\'étape suivante.');
  };

  // Récupération de la première lettre pour l'avatar par défaut
  const avatarLetter = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* EN-TÊTE : AVATAR ET IDENTITÉ */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleSelectAvatar} activeOpacity={0.8} style={styles.avatarWrapper}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </View>
            <View style={styles.editBadge}>
              <Text style={styles.editBadgeText}>+</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
        </View>

        {/* PARAMÈTRES DU PROFIL (PAYS & LANGUE) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Configuration du Profil</Text>

          <Text style={styles.label}>Nom complet</Text>
          <TextInput 
            style={styles.input} 
            value={name} 
            onChangeText={setName} 
            editable={!loading} 
          />

          <Text style={styles.label}>Pays</Text>
          <TextInput 
            style={styles.input} 
            value={country} 
            onChangeText={setCountry} 
            editable={!loading} 
          />

          <Text style={styles.label}>Langue de l'application</Text>
          <TextInput 
            style={styles.input} 
            value={lang} 
            onChangeText={setLang} 
            editable={!loading} 
          />

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]} 
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* HISTORIQUE DES PRONOSTICS */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Historique des Pronostics</Text>
          
          {mockHistory.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyInfo}>
                <Text style={styles.historyMatch}>{item.match}</Text>
                <Text style={styles.historyBet}>Option : {item.bet}</Text>
                <Text style={styles.historyDate}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, item.status === 'Gagné' ? styles.statusWin : styles.statusLose]}>
                <Text style={[styles.statusText, item.status === 'Gagné' ? styles.textWin : styles.textLose]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* BOUTON DÉCONNEXION */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Se déconnecter</Text>
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
  scrollContent: { 
    padding: 20, 
    paddingTop: Platform.OS === 'ios' ? 20 : 10 
  },
  avatarSection: { 
    alignItems: 'center', 
    marginVertical: 25 
  },
  avatarWrapper: { 
    position: 'relative', 
    marginBottom: 12 
  },
  avatarPlaceholder: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: '#2E7D32', // Couleur verte de l'entreprise
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 3,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: { 
    color: '#FFFFFF', 
    fontSize: 36, 
    fontWeight: 'bold' 
  },
  editBadge: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    backgroundColor: '#1A1A1A', 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#FFFFFF' 
  },
  editBadgeText: { 
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginTop: -2 
  },
  userName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  userEmail: { 
    fontSize: 14, 
    color: '#666666', 
    marginTop: 2 
  },
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 20, 
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1A1A1A', 
    marginBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F0F0F0', 
    paddingBottom: 8 
  },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#666666', 
    marginBottom: 6 
  },
  input: { 
    backgroundColor: '#F8F9FA', 
    borderWidth: 1, 
    borderColor: '#EAEAEA', 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 15, 
    color: '#1A1A1A', 
    marginBottom: 14 
  },
  saveButton: { 
    backgroundColor: '#2E7D32', 
    borderRadius: 10, 
    padding: 14, 
    alignItems: 'center', 
    marginTop: 6 
  },
  disabledButton: { 
    backgroundColor: '#A5D6A7' 
  },
  saveButtonText: { 
    color: '#FFFFFF', 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  historyItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  },
  historyInfo: { 
    flex: 1 
  },
  historyMatch: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1A1A1A' 
  },
  historyBet: { 
    fontSize: 13, 
    color: '#666666', 
    marginTop: 2 
  },
  historyDate: { 
    fontSize: 11, 
    color: '#999999', 
    marginTop: 2 
  },
  statusBadge: { 
    paddingVertical: 4, 
    paddingHorizontal: 10, 
    borderRadius: 6 
  },
  statusWin: { 
    backgroundColor: '#E8F5E9' 
  },
  statusLose: { 
    backgroundColor: '#FFEBEE' 
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  textWin: { 
    color: '#2E7D32' 
  },
  textLose: { 
    color: '#C62828' 
  },
  logoutButton: { 
    borderColor: '#D32F2F', 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginBottom: 30, 
    backgroundColor: '#FFFFFF' 
  },
  logoutText: { 
    color: '#D32F2F', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});