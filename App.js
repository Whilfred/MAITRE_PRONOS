import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, ActivityIndicator, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './LoginScreen'; 
import RegisterScreen from './RegisterScreen'; 
import ProfileScreen from './ProfileScreen'; // <-- Intégration de l'écran Profil validé

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // Gère la bascule 'LOGIN' ou 'REGISTER'
  const [isCheckingToken, setIsCheckingToken] = useState(true); // Gère l'état de chargement initial

  // Auto-connexion : Vérification de l'existence d'un token au démarrage de l'application
  useEffect(() => {
    const checkExistingToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('user_token');
        if (token) {
          // Simulation ou appel API de récupération du profil via le token existant
          // Pour l'instant, on recrée un objet utilisateur basique
          setUser({ token: token, email: 'utilisateur@vip.com' });
        }
      } catch (error) {
        console.log('[SecureStore Init Error]:', error);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkExistingToken();
  }, []);

  // Gestion propre de la déconnexion avec destruction du token physique
  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync('user_token');
    } catch (error) {
      console.log('[SecureStore Error]:', error);
    } finally {
      setUser(null);
      setCurrentScreen('LOGIN');
    }
  };

  // Écran d'attente pendant la lecture du SecureStore au démarrage
  if (isCheckingToken) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Configuration de la barre de statut supérieure */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {!user ? (
        currentScreen === 'LOGIN' ? (
          <LoginScreen 
            onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} 
            onNavigateToRegister={() => setCurrentScreen('REGISTER')} // Relie le bouton "Créer un compte"
          />
        ) : (
          <RegisterScreen 
            onNavigateToLogin={() => setCurrentScreen('LOGIN')} // Relie le bouton "Se connecter"
            onRegisterSuccess={(registeredUser) => setUser(registeredUser)} // Connecte direct après inscription
          />
        )
      ) : (
        // L'écran d'attente basique est remplacé par le profil utilisateur complet (Pays, Langue, Historique)
        <ProfileScreen user={user} onLogout={handleLogout} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});