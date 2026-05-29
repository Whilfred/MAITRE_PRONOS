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

export default function RegisterScreen({ onNavigateToLogin, onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Validation locale basique
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs du formulaire.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur Mot de passe', 'Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Sécurité', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    setLoading(true);

    try {
      // 2. Envoi de la requête au serveur Laravel
      const response = await api.post('/register', {
        name: name.trim(),
        email: email.trim(),
        password: password,
        password_confirmation: confirmPassword
      });

      // 3. Traitement en cas de succès
      if (response.data && response.data.token) {
        const { token, user } = response.data;

        // Stockage sécurisé du jeton d'authentification
        await SecureStore.setItemAsync('user_token', token);

        Alert.alert('Compte créé !', `Bienvenue sur PronosApp, ${user.name} !`);
        
        if (onRegisterSuccess) {
          onRegisterSuccess(user);
        }
      } else {
        Alert.alert('Erreur', 'Le serveur a renvoyé une réponse incomplète.');
      }

    } catch (error) {
      console.log('[Register Error]:', error);
      
      let errorMessage = "Impossible de finaliser l'inscription. Vérifiez votre connexion.";
      
      if (error.response) {
        // Validation Laravel (ex: e-mail déjà pris)
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Le serveur Laravel ne répond pas. Vérifiez que l'API est active.";
      }

      Alert.alert('Échec de l’inscription', errorMessage);
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
        
        {/* En-tête avec Logo de l'entreprise */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('./assets/icon.png')} 
            style={styles.logoImage}
            resizeMode="contain"
            onError={() => console.log("Logo introuvable dans le dossier assets")}
          />
          <Text style={styles.subtitle}>Créez un compte pour rejoindre l'aventure</Text>
        </View>

        {/* Formulaire de saisie */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nom complet</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Alexandre Silva"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
            editable={!loading}
          />

          <Text style={styles.label}>Adresse e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: alex@pronos.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text style={styles.label}>Mot de passe (8 caractères min.)</Text>
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

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Bouton d'action vert */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister} 
            disabled={loading}
            activeOpacity={0.7}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>S'inscrire</Text>
            )}
          </TouchableOpacity>

          {/* Lien retour vers la connexion */}
          <TouchableOpacity style={styles.linkButton} onPress={onNavigateToLogin} disabled={loading}>
            <Text style={styles.linkText}>
              Déjà inscrit ? <Text style={styles.greenLink}>Se connecter</Text>
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
    marginBottom: 25,
  },
  logoImage: {
    width: '90%',
    height: 140, 
    marginBottom: 10,
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
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2E7D32', // Identité Verte
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
    backgroundColor: '#A5D6A7', // Version atténuée lors du chargement
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