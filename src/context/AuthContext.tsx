import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Structure ultra complète du profil d'un parieur sérieux (Module 1)
export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  country: string;
  lang: 'Français 🇫🇷' | 'English 🇬🇧' | 'Arabe 🇲🇦' | 'Portugais 🇵🇹';
  level: 'Débutant' | 'Intermédiaire' | 'Expert 🔥';
  predictionsCount: number;
  isVIP: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  authToken: string | null;
  login: (userData: UserProfile, token: string) => Promise<void>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clés de stockage locales sécurisées
const STORAGE_KEY_USER = '@PRONOS_APP_USER_PROFILE';
const STORAGE_KEY_TOKEN = '@PRONOS_APP_AUTH_TOKEN';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Restauration automatique de la session utilisateur au démarrage de l'app
    const bootstrapAsync = async () => {
      try {
        const [savedUser, savedToken] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY_USER),
          AsyncStorage.getItem(STORAGE_KEY_TOKEN)
        ]);

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setAuthToken(savedToken);
        }
      } catch (error) {
        console.error("🚫 [AuthContext] Échec de la récupération des jetons de session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  /**
   * Initialise la session utilisateur après une authentification réussie
   */
  const login = async (userData: UserProfile, token: string) => {
    try {
      setUser(userData);
      setAuthToken(token);
      
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData)),
        AsyncStorage.setItem(STORAGE_KEY_TOKEN, token)
      ]);
      console.log("✅ [AuthContext] Session utilisateur stockée avec succès.");
    } catch (error) {
      console.error("🚫 [AuthContext] Échec de la sauvegarde de la session:", error);
      throw error;
    }
  };

  /**
   * Modifie dynamiquement les données du profil de l'utilisateur (Pays, langue, photo, etc.)
   */
  const updateProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      if (!user) return;

      const updatedProfile = { ...user, ...updatedData };
      setUser(updatedProfile);
      
      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedProfile));
      console.log("🔄 [AuthContext] Profil utilisateur mis à jour localement.");
    } catch (error) {
      console.error("🚫 [AuthContext] Échec de la mise à jour du profil:", error);
      throw error;
    }
  };

  /**
   * Détruit la session locale et déconnecte l'utilisateur
   */
  const logout = async () => {
    try {
      setUser(null);
      setAuthToken(null);
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY_USER),
        AsyncStorage.removeItem(STORAGE_KEY_TOKEN)
      ]);
      console.log("🚪 [AuthContext] Déconnexion effectuée, stockage nettoyé.");
    } catch (error) {
      console.error("🚫 [AuthContext] Échec du nettoyage de la session à la déconnexion:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        authToken,
        login,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("❌ useAuth doit être enveloppé à l'intérieur d'un AuthProvider.");
  }
  return context;
};