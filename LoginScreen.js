import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Image, 
  StatusBar 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import api from './src/services/api'; // Point de départ depuis la racine

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validation locale avant d'appeler le serveur
    if (!email.trim() || !password) {
      Alert.alert('Champs requis', "Veuillez remplir l'adresse e-mail et le mot de passe.");
      return;
    }

    setLoading(true);
    
    try {
      // 2. Requête HTTP POST vers le contrôleur Laravel (10.22.20.60:8000)
      const response = await api.post('/login', { 
        email: email.trim(), 
        password: password 
      });

      // 3. Extraction du token et des infos de l'utilisateur
      if (response.data && response.data.token) {
        const { token, user } = response.data;

        // Stockage sécurisé du token dans le smartphone
        await SecureStore.setItemAsync('user_token', token);

        Alert.alert('Connexion réussie', `Bienvenue sur PronosApp, ${user.name} !`);
        
        // Déclenchement du changement d'état global
        if (onLoginSuccess) {
          onLoginSuccess(user);
        }
      } else {
        Alert.alert('Erreur', 'Le serveur a renvoyé un format de réponse invalide.');
      }

    } catch (error) {
      console.log('[Login Error]:', error);

      let errorMessage = 'Impossible de joindre le serveur. Vérifiez votre connexion internet.';
      
      if (error.response) {
        // Erreurs renvoyées par Laravel (ex: 401 Identifiants incorrects)
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Le serveur Laravel ne répond pas. Vérifiez qu'il tourne sur XAMPP à l'adresse 10.22.20.60.";
      }

      Alert.alert('Échec de la connexion', errorMessage);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Section Logo et Identité visuelle */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
            onError={() => console.log("Logo introuvable dans le dossier assets")}
          />
          <Text style={styles.subtitle}>Connectez-vous pour accéder aux meilleurs pronostics</Text>
        </View>

        {/* Section Formulaire de connexion */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: test@test.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Bouton de soumission vert */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin} 
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </TouchableOpacity>

          {/* Lien d'aiguillage vers l'inscription */}
          <TouchableOpacity 
            style={styles.linkButton} 
            onPress={onNavigateToRegister} 
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Nouveau sur PronosApp ? <Text style={styles.greenLink}>Créer un compte</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoImage: {
    width: '90%',
    height: 160, 
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 22,
  },
  button: {
    backgroundColor: '#2E7D32', // Couleur verte de la charte graphique
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#A5D6A7',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 14,
    color: '#666666',
  },
  greenLink: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});