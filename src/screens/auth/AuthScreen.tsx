import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { CustomInput } from '../../components/CustomInput';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

export const AuthScreen = () => {
  const { login } = useAuth();
  
  // États de l'interface
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // États des champs de saisie
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  
  // Gestion des erreurs de validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  /**
   * Validation stricte du formulaire côté client avant envoi
   */
  const validateForm = (): boolean => {
    let currentErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      currentErrors.email = "L'adresse email est requise.";
    } else if (!emailRegex.test(email.trim())) {
      currentErrors.email = "Veuillez entrer une adresse email valide.";
    }

    if (!password) {
      currentErrors.password = "Le mot de passe est requis.";
    } else if (password.length < 6) {
      currentErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (!isLogin && !fullName.trim()) {
      currentErrors.fullName = "Le nom complet est requis pour l'inscription.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  /**
   * Soumission du formulaire
   */
  const handleAuthSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulation d'un délai réseau de l'API (Sera lié au backend Laravel plus tard)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser = {
        uid: 'user_' + Date.now(),
        email: email.trim().toLowerCase(),
        fullName: isLogin ? 'Expert Tipster' : fullName.trim(),
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        country: 'Burkina Faso 🇧🇫',
        lang: 'Français 🇫🇷' as const,
        level: 'Expert 🔥' as const,
        predictionsCount: 12,
        isVIP: false
      };

      // Initialisation de la session globale (JWT Token fictif pour le moment)
      await login(mockUser, 'PRONOS_APP_SECURE_JWT_TOKEN');
    } catch (error) {
      console.error("🚫 Échec de l'authentification:", error);
      setErrors({ server: "Une erreur est survenue. Veuillez réessayer." });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Gestionnaires pour l'authentification tierce (OAuth)
   */
  const handleSocialAuth = (provider: 'Google' | 'Apple' | 'Facebook') => {
    if (isSubmitting) return;
    console.log(`📡 Lancement du flux OAuth natif pour: ${provider}`);
    // Intégration future avec Expo AuthSession / Firebase Social Auth
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          
          {/* Logo & En-tête de la marque */}
          <View style={styles.brandHeader}>
            <Text style={styles.brandLogo}>
              PRONOS<Text style={styles.brandAccent}>~APP</Text>
            </Text>
            <Text style={styles.brandSubtitle}>
              {isLogin ? 'Accédez aux meilleures analyses de la communauté' : 'Créez votre compte et rejoignez l’élite'}
            </Text>
          </View>

          {/* Formulaire principal */}
          <View style={styles.formContainer}>
            {errors.server && <Text style={styles.serverErrorText}>{errors.server}</Text>}

            {!isLogin && (
              <CustomInput
                placeholder="Nom complet"
                value={fullName}
                onChangeText={setFullName}
                error={errors.fullName}
                editable={!isSubmitting}
              />
            )}

            <CustomInput
              placeholder="Adresse Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
              editable={!isSubmitting}
            />

            <CustomInput
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              error={errors.password}
              editable={!isSubmitting}
            />

            {isLogin && (
              <TouchableOpacity 
                activeOpacity={0.7} 
                style={styles.forgotPasswordBtn}
                disabled={isSubmitting}
              >
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            )}

            {/* Bouton d'action principal */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleAuthSubmit}
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLogin ? 'Se connecter' : "S'inscrire"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Séparateur pour options alternatives */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou continuer avec</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Boutons d'authentification sociale */}
          <View style={styles.socialAuthRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocialAuth('Google')}
              style={styles.socialButton}
              disabled={isSubmitting}
            >
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocialAuth('Apple')}
              style={styles.socialButton}
              disabled={isSubmitting}
            >
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSocialAuth('Facebook')}
              style={styles.socialButton}
              disabled={isSubmitting}
            >
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Pied de page : Bascule d'état */}
          <View style={styles.switchModeRow}>
            <Text style={styles.switchModeLabel}>
              {isLogin ? "Vous n'avez pas de compte ?" : "Vous faites déjà partie de l'élite ?"}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              disabled={isSubmitting}
            >
              <Text style={styles.switchModeAction}>
                {isLogin ? " S'inscrire" : ' Se connecter'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB', // Fond gris clair moderne et épuré
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandLogo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: 1.5,
    ...Platform.select({
      ios: { fontFamily: 'Helvetica Neue' },
      android: { fontFamily: 'sans-serif-condensed' },
    }),
  },
  brandAccent: {
    color: '#16A34A', // Le vert emblématique de la charte de l'entreprise
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 15,
    lineHeight: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  forgotPasswordBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#16A34A',
    fontWeight: '600',
  },
  submitButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#16A34A',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#16A34A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  serverErrorText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    paddingHorizontal: 14,
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  socialAuthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  socialButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  switchModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchModeLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  switchModeAction: {
    fontSize: 14,
    color: '#16A34A',
    fontWeight: '700',
  },
});