import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  StatusBar, 
  Platform 
} from 'react-native';

export default function SubscriptionHistoryScreen() {
  // Données dynamiques de l'abonnement en cours de l'utilisateur
  const currentSubscription = {
    status: 'Actif', // Gère les états : 'Actif', 'Expiré', ou 'Aucun'
    plan: 'Pack Mensuel VIP',
    activatedAt: '15/05/2026',
    expiresAt: '15/06/2026',
    daysRemaining: 17
  };

  // Historique complet et propre des reçus Mobile Money
  const transactionHistory = [
    {
      id: 'TX-98432',
      date: '15/05/2026',
      plan: 'Pack Mensuel',
      amount: '7 500',
      method: 'Orange Money',
      status: 'Succès'
    },
    {
      id: 'TX-12049',
      date: '08/05/2026',
      plan: 'Pack Hebdomadaire',
      amount: '2 500',
      method: 'Moov Money',
      status: 'Succès'
    },
    {
      id: 'TX-09431',
      date: '01/05/2026',
      plan: 'Pack Hebdomadaire',
      amount: '2 500',
      method: 'Orange Money',
      status: 'Échoué'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* EN-TÊTE DE L'ÉCRAN */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Abonnement</Text>
        <Text style={styles.headerSubtitle}>Suivi de vos accès et reçus de paiement Mobile Money</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* CARTE DU STATUT VIP ACTUEL */}
        <View style={[
          styles.statusCard, 
          currentSubscription.status === 'Actif' ? styles.statusCardActive : styles.statusCardExpired
        ]}>
          <View style={styles.statusHeaderRow}>
            <Text style={styles.statusLabel}>État de l'accès :</Text>
            <View style={[
              styles.badge, 
              currentSubscription.status === 'Actif' ? styles.badgeActive : styles.badgeExpired
            ]}>
              <Text style={styles.badgeText}>
                {currentSubscription.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {currentSubscription.status === 'Actif' ? (
            <View style={styles.infoBlock}>
              <Text style={styles.planNameText}>{currentSubscription.plan}</Text>
              <Text style={styles.dateText}>Activé le : {currentSubscription.activatedAt}</Text>
              <Text style={styles.dateText}>Expire le : {currentSubscription.expiresAt}</Text>
              <View style={styles.divider} />
              <Text style={styles.countdownText}>
                Il vous reste <Text style={styles.boldText}>{currentSubscription.daysRemaining} jours</Text> d'accès VIP.
              </Text>
            </View>
          ) : (
            <Text style={styles.noActiveText}>Vous n'avez aucun abonnement VIP actif pour le moment.</Text>
          )}
        </View>

        {/* SECTION HISTORIQUE DES TRANSACTIONS */}
        <Text style={styles.sectionTitle}>Historique des Factures</Text>

        {transactionHistory.map((tx) => (
          <View key={tx.id} style={styles.txCard}>
            <View style={styles.txHeader}>
              <View>
                <Text style={styles.txPlan}>{tx.plan}</Text>
                <Text style={styles.txId}>ID Référence : {tx.id}</Text>
              </View>
              <Text style={styles.txAmount}>{tx.amount} FCFA</Text>
            </View>

            <View style={styles.txFooter}>
              <Text style={styles.txMethod}>via {tx.method}</Text>
              <View style={[
                styles.txStatusBadge,
                tx.status === 'Succès' ? styles.txSuccess : styles.txFailed
              ]}>
                <Text style={[
                  styles.txStatusText,
                  tx.status === 'Succès' ? styles.txSuccessText : styles.txFailedText
                ]}>
                  {tx.status}
                </Text>
              </View>
            </View>
            <Text style={styles.txDate}>{tx.date}</Text>
          </View>
        ))}

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
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#2E7D32' 
  },
  headerSubtitle: { 
    fontSize: 13, 
    color: '#666666', 
    textAlign: 'center', 
    marginTop: 4,
    lineHeight: 18
  },
  scrollContent: { 
    padding: 20 
  },
  statusCard: { 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 25, 
    borderWidth: 1, 
    elevation: 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  statusCardActive: { 
    borderColor: '#2E7D32' 
  },
  statusCardExpired: { 
    borderColor: '#EAEAEA' 
  },
  statusHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  statusLabel: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: '#1A1A1A' 
  },
  badge: { 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: 20 
  },
  badgeActive: { 
    backgroundColor: '#E8F5E9' 
  },
  badgeExpired: { 
    backgroundColor: '#FFEBEE' 
  },
  badgeText: { 
    fontSize: 11, 
    fontWeight: 'bold', 
    color: '#2E7D32' 
  },
  planNameText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#1A1A1A', 
    marginBottom: 6 
  },
  dateText: { 
    fontSize: 13, 
    color: '#666666', 
    marginTop: 2 
  },
  divider: { 
    height: 1, 
    backgroundColor: '#F0F0F0', 
    marginVertical: 12 
  },
  countdownText: { 
    fontSize: 14, 
    color: '#2E7D32' 
  },
  boldText: { 
    fontWeight: 'bold' 
  },
  noActiveText: { 
    fontSize: 14, 
    color: '#666666', 
    fontStyle: 'italic' 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#1A1A1A', 
    marginBottom: 15 
  },
  txCard: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 12, 
    padding: 15, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#EAEAEA' 
  },
  txHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  txPlan: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  txId: { 
    fontSize: 11, 
    color: '#999999', 
    marginTop: 2 
  },
  txAmount: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: '#1A1A1A' 
  },
  txFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 12 
  },
  txMethod: { 
    fontSize: 13, 
    color: '#666666', 
    fontWeight: '500' 
  },
  txStatusBadge: { 
    paddingVertical: 3, 
    paddingHorizontal: 8, 
    borderRadius: 6 
  },
  txSuccess: { 
    backgroundColor: '#E8F5E9' 
  },
  txFailed: { 
    backgroundColor: '#FFEBEE' 
  },
  txStatusText: { 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  txSuccessText: { 
    color: '#2E7D32' 
  },
  txFailedText: { 
    color: '#C62828' 
  },
  txDate: { 
    fontSize: 11, 
    color: '#999999', 
    marginTop: 6, 
    textAlign: 'right' 
  }
});