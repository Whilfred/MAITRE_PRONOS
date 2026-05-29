#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Service de Notifications Push Premium - PRONOS-APP
 * Gère l'initialisation, les permissions et le routage des flux FCM (Firebase Cloud Messaging).
 * Prise en charge des alertes de match en direct, des pronostics VIP et de l'IA.
 */

import messaging from '@react-native-firebase/messaging';
import { Alert, Platform, PushNotificationIOS } from 'react-native';

export class FirebaseNotificationService {
  
  /**
   * Demande les permissions d'affichage des alertes sur le smartphone.
   * Obligatoire à partir d'Android 13 (API 33) et de toutes les versions d'iOS.
   */
  static requestUserPermission = async () => {
    try {
      const authStatus = await messaging().requestPermission({
        alert: true,
        badge: true,
        sound: true,
        criticalAlert: true, // Requis pour les alertes urgentes de début de match
      });

      const isAuthorized =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (isAuthorized) {
        console.log('[FCM-PRO] Système d\'autorisation validé. Statut :', authStatus);
        return await this.getFcmToken();
      } else {
        console.warn('[FCM-PRO] Autorisation de notification refusée par l\'utilisateur.');
        return null;
      }
    } catch (error) {
      console.error('[FCM-PRO] Échec lors de la demande de permission :', error);
      return null;
    }
  };

  /**
   * Extrait le Token FCM unique de l'appareil.
   * Ce token identifie l'appareil et doit être synchronisé avec ta base de données MySQL via Laravel.
   */
  static getFcmToken = async () => {
    try {
      // Sur iOS, s'assurer que le token APNS est enregistré avant de demander le token FCM
      if (Platform.OS === 'ios') {
        const apnsToken = await messaging().getAPNSToken();
        if (!apnsToken) {
          console.log('[FCM-PRO] Attente de la liaison du token APNS iOS...');
        }
      }

      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('====================================================');
        console.log('[FCM-PRO] REPO TOKEN UNIQUE APPAREIL CORRIGÉ :');
        console.log(fcmToken);
        console.log('====================================================');
        return fcmToken;
      } else {
        console.warn('[FCM-PRO] Aucun token généré par l\'instance Firebase.');
        return null;
      }
    } catch (error) {
      console.error('[FCM-PRO] Erreur de récupération du Device Token :', error);
      return null;
    }
  };

  /**
   * Écoute et intercepte les flux réseaux selon le cycle de vie de l'application.
   * Synchronise l'interface utilisateur avec les données reçues en temps réel.
   * @param {Object} navigation - L'instance ou la référence globale de ton React Navigation
   */
  static listenToBackgroundAndForegroundSignals = (navigation) => {
    if (!navigation) {
      console.warn('[FCM-PRO] Instance de navigation absente. Le routage automatique est désactivé.');
    }

    // --- 1. SÉQUENCE PREMIER PLAN (APPLICATION OUVERTE) ---
    const unsubscribeOnMessage = messaging().onMessage(async (remoteMessage) => {
      console.log('[FCM-PRO] Notification captée au premier plan (Foreground) :', remoteMessage);
      
      const { title, body } = remoteMessage.notification || {};
      const payloadData = remoteMessage.data;

      // Création d'une alerte visuelle personnalisée sans coupure de session
      Alert.alert(
        title || "⚡ Alerte Live PRONOS-APP",
        body || "Mise à jour d'un match en direct.",
        [
          {
            text: "Ouvrir",
            onPress: () => this.handleNotificationRedirection(payloadData, navigation)
          },
          {
            text: "Ignorer",
            style: "cancel"
          }
        ],
        { cancelable: true }
      );
    });

    // --- 2. SÉQUENCE ARRIÈRE-PLAN (CLIC DEPUIS LE CENTRE DE NOTIFICATIONS) ---
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('[FCM-PRO] Notification ouverte depuis l\'arrière-plan (Background) :', remoteMessage);
      this.handleNotificationRedirection(remoteMessage.data, navigation);
    });

    // --- 3. SÉQUENCE MODE ÉTEINT (LANCEMENT INITIAL VIA LA NOTIFICATION) ---
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('[FCM-PRO] Application démarrée via une notification (Quit Mode) :', remoteMessage);
          this.handleNotificationRedirection(remoteMessage.data, navigation);
        }
      })
      .catch((error) => {
        console.error('[FCM-PRO] Erreur lors de l\'analyse de la notification initiale :', error);
      });

    // Retourne la fonction de nettoyage pour éviter les fuites de mémoire (Memory Leaks)
    return () => {
      unsubscribeOnMessage();
    };
  };

  /**
   * Routeur Algorithmique : Redirige l'utilisateur vers le bon écran selon le type d'alerte.
   * Gère de façon stricte les 6 flux requis par le cahier des charges du produit.
   * @param {Object} data - Objet de données brutes envoyé dans le payload FCM
   * @param {Object} navigation - Objet de navigation React Native
   */
  static handleNotificationRedirection = (data, navigation) => {
    if (!data || !data.type || !navigation) {
      console.log('[FCM-PRO] Redirection avortée : Payload ou structure de navigation manquante.');
      return;
    }

    const { type, matchId, pronoId } = data;
    console.log(`[FCM-PRO] Traitement de la redirection pour le type de flux : ${type}`);

    // Routage strict basé sur les spécifications du Module 7
    switch (type) {
      case 'START_MATCH':      // Début du match
      case 'GOAL':             // But marqué
      case 'RED_CARD':         // Carton rouge
      case 'END_MATCH':        // Fin du match
        navigation.navigate('MatchDetailScreen', { matchId: matchId });
        break;

      case 'VIP_PRONO':        // Nouveau pronostic VIP publié
      case 'HIGH_PROBABILITY': // Alerte IA à forte probabilité (>85%)
        navigation.navigate('VipPredictionsScreen', { pronoId: pronoId });
        break;

      default:
        console.log(`[FCM-PRO] Type de flux '${type}' non standard. Redirection vers l'accueil.`);
        navigation.navigate('HomeScreen');
        break;
    }

    // Gestion propre du compteur de badges sur l'icône iOS si nécessaire
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    }
  };
}