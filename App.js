import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import LoginScreen from './LoginScreen'; 
import RegisterScreen from './RegisterScreen'; // <-- Ajouté pour l'inscription pro

export default function App() {
  const [user, setUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // Gère la bascule entre 'LOGIN' et 'REGISTER'

  return (
    <SafeAreaView style={styles.container}>
      {/* Configuration propre de la barre de statut du téléphone */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {!user ? (
        currentScreen === 'LOGIN' ? (
          <LoginScreen 
            onLoginSuccess={(loggedInUser) => setUser(loggedInUser)} 
            onNavigateToRegister={() => setCurrentScreen('REGISTER')} // Permet d'ouvrir l'inscription
          />
        ) : (
          <RegisterScreen 
            onNavigateToLogin={() => setCurrentScreen('LOGIN')} // Permet de revenir à la connexion
            onRegisterSuccess={(registeredUser) => setUser(registeredUser)} // Connecte après inscription
          />
        )
      ) : (
        // Si la connexion ou l'inscription réussit, on affiche ton Dashboard Pro
        <View style={styles.dashboardContainer}>
          <Text style={styles.welcomeText}>Bienvenue, {user.name} !</Text>
          <Text style={styles.successSubtitle}>Connexion au serveur Laravel établie avec succès.</Text>
          
          {/* Bouton de déconnexion pour pouvoir retester facilement */}
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => {
              setUser(null);
              setCurrentScreen('LOGIN');
            }}
          >
            <Text style={styles.logoutButtonText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dashboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32', // Rappel du vert de l'entreprise
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#C62828',
    fontWeight: 'bold',
    fontSize: 16,
  },
});