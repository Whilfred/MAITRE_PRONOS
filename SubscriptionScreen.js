import React, { useState, useEffect } from 'react'; // <-- Ajout de useEffect
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  StatusBar,
  Platform
} from 'react-native';
import { NotificationService } from './src/services/notificationService'; // <-- Intégration du service de notification

export default function SubscriptionScreen() {
  const [loadingPlan, setLoadingPlan] = useState(null);

  // Demande automatique des permissions de notifications au chargement de l'écran
  useEffect(() => {
    NotificationService.requestPermissions();
  }, []);

  // Liste des offres VIP adaptées au marché ouest-africain (FCFA)
  const plans = [
    {
      id: 'weekly',
      title: 'Pack Hebdomadaire',
      duration: '7 Jours d\'accès VIP',
      price: '2 500',
      description: 'Idéal pour tester la fiabilité de nos analyses et générer vos premiers bénéfices.',
      popular: false
    },
    {
      id: 'monthly',
      title: 'Pack Mensuel',
      duration: '30 Jours d\'accès VIP',
      price: '7 500',
      description: 'Le choix privilégié des investisseurs réguliers. Ratio rentabilité/prix imbattable.',
      popular: true
    },
    {
      id: 'yearly',
      title: 'Pack Annuel',
      duration: '365 Jours d\'accès VIP',
      price: '50 000',
      description: 'L\'expérience ultime pour les professionnels. Suivi complet et bankroll optimisée sur un an.',
      popular: false
    }
  ];

  const handleSubscribe = (plan) => {
    setLoadingPlan(plan.id);

    // Simulation de l'appel API vers une passerelle de paiement Mobile Money
    setTimeout(async () => {
      setLoadingPlan(null);

      // Déclenchement instantané de la notification système sur le téléphone
      await NotificationService.sendLocalNotification(
        "👑 Accès VIP Activé !",
        `Félicitations ! Votre souscription au ${plan.title} a bien été prise en compte.`
      );

      Alert.alert(
        "Paiement Mobile Money",
        `L'initiation du paiement pour le "${plan.title}" (${plan.price} FCFA) a réussi.\n\nVeuillez valider la notification USSD de votre opérateur (Orange Money ou Moov Money) sur votre téléphone pour activer votre accès VIP.`,
        [{ text: "Compris", fontWeight: "bold" }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* HEADER DE L'ESPACE VIP */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Abonnements VIP</Text>
        <Text style={styles.headerSubtitle}>Multipliez vos chances de gains en rejoignant notre club d'experts</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {plans.map((plan) => (
          <View 
            key={plan.id} 
            style={[
              styles.planCard, 
              plan.popular && styles.popularCard
            ]}
          >
            {/* Badge exclusif pour l'offre vedette */}
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>MEILLEURE OFFRE</Text>
              </View>
            )}

            <View style={styles.cardHeader}>
              <View style={styles.titleWrapper}>
                <Text style={styles.planTitle}>{plan.title}</Text>
                <Text style={styles.planDuration}>{plan.duration}</Text>
              </View>
              <View style={styles.priceWrapper}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.currencyText}>FCFA</Text>
              </View>
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            {/* AVANTAGES INCLUS DE SÉRIE */}
            <View style={styles.featuresContainer}>
              <Text style={styles.featureItem}>✓ Accès complet aux combinés du jour</Text>
              <Text style={styles.featureItem}>✓ Conseils de mise et gestion de bankroll</Text>
              <Text style={styles.featureItem}>✓ Notifications push ultra-rapides</Text>
            </View>

            {/* BOUTON DE SOUSCRIPTION MOBILE MONEY */}
            <TouchableOpacity 
              style={[
                styles.subscribeButton,
                plan.popular ? styles.btnPopular : styles.btnNormal
              ]}
              onPress={() => handleSubscribe(plan)}
              disabled={loadingPlan !== null}
              activeOpacity={0.8}
            >
              {loadingPlan === plan.id ? (
                <ActivityIndicator color={plan.popular ? "#2E7D32" : "#FFFFFF"} size="small" />
              ) : (
                <Text style={[
                  styles.subscribeButtonText,
                  plan.popular ? styles.txtPopular : styles.txtNormal
                ]}>
                  S'abonner via Mobile Money
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

        <Text style={styles.footerSecureText}>🔒 Transaction sécurisée et cryptée de bout en bout</Text>
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
    paddingBottom: 20, 
    borderBottomWidth: 1, 
    borderColor: '#EAEAEA',
    alignItems: 'center'
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#2E7D32' 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: '#666666', 
    textAlign: 'center', 
    marginTop: 6,
    paddingHorizontal: 15,
    lineHeight: 18
  },
  scrollContent: { 
    padding: 20,
    paddingBottom: 40
  },
  planCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#EAEAEA',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  popularCard: {
    borderColor: '#2E7D32',
    borderWidth: 2.5,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#2E7D32',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 15,
    marginBottom: 15
  },
  titleWrapper: {
    flex: 1,
    paddingRight: 10
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A'
  },
  planDuration: {
    fontSize: 13,
    color: '#666666',
    marginTop: 3
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#2E7D32'
  },
  currencyText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 3
  },
  planDescription: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
    marginBottom: 16
  },
  featuresContainer: {
    marginBottom: 20
  },
  featureItem: {
    fontSize: 13,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8
  },
  subscribeButton: {
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnNormal: {
    backgroundColor: '#2E7D32',
  },
  btnPopular: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  subscribeButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  txtNormal: {
    color: '#FFFFFF',
  },
  txtPopular: {
    color: '#2E7D32',
  },
  footerSecureText: {
    textAlign: 'center',
    color: '#999999',
    fontSize: 12,
    marginTop: 8
  }
});