import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import LoginScreen from './LoginScreen'; 
import RegisterScreen from './RegisterScreen'; 
import ProfileScreen from './ProfileScreen'; // <-- Intégration de l'écran Profil validé

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // Gère la bascule 'LOGIN' ou 'REGISTER'

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
});