import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';

// Définit le comportement global lorsque l'application reçoit une notification au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationService = {
  /**
   * Demande les permissions à l'utilisateur de manière sécurisée
   * Gère les restrictions propres à iOS et Android (API 33+)
   */
  requestPermissions: async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Si l'application n'a pas encore l'autorisation, on la demande activement
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      // Si l'utilisateur refuse fermement l'accès
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Alertes Désactivées',
          'Veuillez activer les notifications dans les réglages de votre smartphone pour ne rater aucun pronostic flash VIP !',
          [{ text: 'Compris', style: 'default' }]
        );
        return false;
      }

      // Configuration obligatoire du canal sur Android pour forcer le son et les vibrations maximales
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('pronos-vip-alerts', {
          name: 'Alertes Flash VIP',
          description: 'Notifications pour les pronostics exclusifs et validations de paiement',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2E7D32', // Couleur verte officielle de la marque
          enableLights: true,
          enableVibration: true,
          showBadge: true,
        });
      }

      return true;
    } catch (error) {
      console.error('[NotificationService Error] sur la demande de permission:', error);
      return false;
    }
  },

  /**
   * Déclenche instantanément une alerte système en local sur le terminal de l'utilisateur
   * @param {string} title - Le titre accrocheur de la notification
   * @param {string} body - Le contenu informatif du message
   */
  sendLocalNotification: async (title, body) => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
          priority: Platform.OS === 'android' ? Notifications.AndroidNotificationPriority.MAX : undefined,
          badge: 1,
        },
        trigger: null, // Déclenchement instantané (sans délai)
      });
    } catch (error) {
      console.error('[NotificationService Error] sur l\'envoi de la notification:', error);
    }
  },
};