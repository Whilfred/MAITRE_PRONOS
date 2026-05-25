import React from 'react';
import { SafeAreaView, StatusBar, ActivityIndicator, View, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { AuthScreen } from './src/screens/auth/AuthScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';

/**
 * Le Wrapper de Navigation gère dynamiquement l'affichage 
 * selon l'état de la session de l'utilisateur (Module 1).
 */
function NavigationWrapper() {
  const { isAuthenticated, isLoading } = useAuth();

  // Écran de chargement professionnel pendant la lecture d'AsyncStorage
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  // Redirection : Si connecté -> Profil (Dashboard au Module 2), Sinon -> Connexion
  return isAuthenticated ? <ProfileScreen /> : <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.rootContainer}>
        {/* Configuration de la barre de statut du téléphone */}
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <NavigationWrapper />
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
});
