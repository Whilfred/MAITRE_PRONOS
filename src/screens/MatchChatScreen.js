#!/usr/bin/env node
// -*- coding: utf-8 -*-

/**
 * Module Communauté & Réseau Social - PRONOS-APP
 * Gère les espaces de discussion en direct par match, les salons privés VIP et le classement des parieurs.
 * Interface graphique optimisée haute performance basée sur la charte d'entreprise (Vert & Blanc).
 */

import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  StatusBar,
  Share,
  Alert
} from 'react-native';

export default function MatchChatScreen({ isUserVip = false }) {
  const [activeTab, setActiveTab] = useState('CHAT_LIVE'); // Options: CHAT_LIVE, GROUP_VIP, LEADERBOARD
  const [typedMessage, setTypedMessage] = useState('');
  
  // Base de données simulée du flux de discussion (Inversée pour le fil de discussion)
  const [messages, setMessages] = useState([
    { id: '3', user: 'Moussa_Prono', text: 'Quelqu’un a le code du ticket combiné de l\'IA ? 🙏', time: '18:43', likes: 3, isVip: false },
    { id: '2', user: 'Coach_Expert 👑', text: 'Attention au carton rouge ou à la fatigue, le Real Madrid voyage avec des joueurs clés au repos.', time: '18:42', likes: 24, isVip: true },
    { id: '1', user: 'Alassane_99', text: 'Victoire claire de City ce soir, la cote à 1.85 sur l\'application est cadeau ! 🚀', time: '18:40', likes: 12, isVip: false },
  ]);

  // Palmarès et classement de la communauté (Leaderboard)
  const leaderboardData = [
    { rank: 1, user: 'Kader_PRONOS', successRate: '91%', gainTotal: '+450K FCFA' },
    { rank: 2, user: 'Yaya_Bet', successRate: '87%', gainTotal: '+320K FCFA' },
    { rank: 3, user: 'Amine_Lover', successRate: '84%', gainTotal: '+195K FCFA' },
  ];

  /**
   * Enregistre et diffuse un nouveau message dans le fil de discussion
   */
  const handleSendMessage = () => {
    if (!typedMessage.trim()) return;

    const timestamp = new Date();
    const formattedTime = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;

    const newMessage = {
      id: Date.now().toString(),
      user: isUserVip ? 'Moi 👑' : 'Moi',
      text: typedMessage.trim(),
      time: formattedTime,
      likes: 0,
      isVip: isUserVip
    };

    // Insertion en tête de tableau (Index 0) car la liste est inversée (inverted={true})
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
    setTypedMessage('');
  };

  /**
   * Incrémente de façon atomique le compteur de mentions J'aime d'un message
   */
  const handleLikeMessage = (messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, likes: msg.likes + 1 } : msg
      )
    );
  };

  /**
   * Utilise l'API Native Share du système pour copier/partager le ticket de pari
   */
  const handleShareTicket = async (couponText) => {
    try {
      await Share.share({
        message: `📋 Ticket partagé depuis PRONOS-APP :\n\n"${couponText}"\n\nRejoins la communauté pour plus de pronostics !`,
      });
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'ouvrir le menu de partage du système.");
    }
  };

  /**
   * Optimisation des performances de rendu pour les listes volumineuses
   */
  const renderMessageItem = useCallback(({ item }) => (
    <View style={[styles.messageCard, item.isVip && styles.vipPremiumBorder]}>
      <View style={styles.messageMetadataRow}>
        <Text style={[styles.messageAuthorName, item.isVip && styles.vipAuthorColor]}>
          {item.user} {item.isVip ? '👑' : ''}
        </Text>
        <Text style={styles.messageTimeText}>{item.time}</Text>
      </View>
      <Text style={styles.messageContentBody}>{item.text}</Text>
      
      <View style={styles.messageActionsContainer}>
        <TouchableOpacity 
          style={styles.actionLikeBtn} 
          onPress={() => handleLikeMessage(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionLikeBtnText}>👍 {item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionShareBtn}
          onPress={() => handleShareTicket(item.text)}
          activeOpacity={0.7}
        >
          <Text style={styles.actionShareBtnText}>🔗 Partager le ticket</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [messages]);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.mainContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* SÉLECTEUR D'ONGLETS SÉCURISÉ */}
      <View style={styles.navigationTabBar}>
        <TouchableOpacity 
          style={[styles.navigationTabItem, activeTab === 'CHAT_LIVE' && styles.navigationTabActive]}
          onPress={() => setActiveTab('CHAT_LIVE')}
        >
          <Text style={[styles.navigationTabText, activeTab === 'CHAT_LIVE' && styles.navigationTabTextActive]}>💬 Chat Live</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navigationTabItem, activeTab === 'GROUP_VIP' && styles.navigationTabActive]}
          onPress={() => setActiveTab('GROUP_VIP')}
        >
          <Text style={[styles.navigationTabText, activeTab === 'GROUP_VIP' && styles.navigationTabTextActive]}>👑 Salon VIP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navigationTabItem, activeTab === 'LEADERBOARD' && styles.navigationTabActive]}
          onPress={() => setActiveTab('LEADERBOARD')}
        >
          <Text style={[styles.navigationTabText, activeTab === 'LEADERBOARD' && styles.navigationTabTextActive]}>🏆 Classement</Text>
        </TouchableOpacity>
      </View>

      {/* AFFICHAGE DES CONTENUS COMPOSANTS */}
      {activeTab === 'CHAT_LIVE' && (
        <View style={styles.contentViewWrapper}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessageItem}
            inverted={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatListScrollPadding}
          />

          {/* COMMANDE DE SAISIE FIXE */}
          <View style={styles.interactiveInputContainer}>
            <TextInput
              style={styles.textInputBox}
              placeholder="Écrivez aux parieurs (avis, coupon...)"
              placeholderTextColor="#9CA3AF"
              maxLength={250}
              value={typedMessage}
              onChangeText={setTypedMessage}
            />
            <TouchableOpacity style={styles.sendActionButton} onPress={handleSendMessage}>
              <Text style={styles.sendActionButtonText}>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {activeTab === 'GROUP_VIP' && (
        !isUserVip ? (
          <View style={styles.paywallOverlayBlock}>
            <Text style={styles.paywallShieldIcon}>🔒</Text>
            <Text style={styles.paywallMainTitle}>Salon Privé Exclusif VIP</Text>
            <Text style={styles.paywallSubDescription}>
              L'accès à ce groupe d'échange est restreint. Activez votre formule d'abonnement pour débloquer les discussions stratégiques et les codes coupons des parieurs d'élite.
            </Text>
          </View>
        ) : (
          <View style={styles.contentViewWrapper}>
            <View style={styles.vipGroupStatusAlert}>
              <Text style={styles.vipGroupStatusText}>✨ Vous êtes connecté au salon crypté VIP</Text>
            </View>
            <FlatList
              data={messages.filter(m => m.isVip)}
              keyExtractor={(item) => item.id}
              renderItem={renderMessageItem}
              inverted={true}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.chatListScrollPadding}
            />
            <View style={styles.interactiveInputContainer}>
              <TextInput
                style={styles.textInputBox}
                placeholder="Message sécurisé pour le groupe VIP..."
                placeholderTextColor="#9CA3AF"
                maxLength={250}
                value={typedMessage}
                onChangeText={setTypedMessage}
              />
              <TouchableOpacity style={[styles.sendActionButton, { backgroundColor: '#111827' }]} onPress={handleSendMessage}>
                <Text style={styles.sendActionButtonText}>Poster</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      )}

      {activeTab === 'LEADERBOARD' && (
        <FlatList
          data={leaderboardData}
          keyExtractor={(item) => item.rank.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          ListHeaderComponent={() => (
            <View style={styles.leaderboardHeaderArea}>
              <Text style={styles.leaderboardTitleText}>🏆 Classement des Experts</Text>
              <Text style={styles.leaderboardSubtitleText}>Performances communautaires évaluées sur les 30 derniers jours.</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.leaderboardRankingRow}>
              <View style={styles.rankingNumberBadge}>
                <Text style={styles.rankingNumberText}>#{item.rank}</Text>
              </View>
              <View style={styles.rankingUserDetails}>
                <Text style={styles.rankingProfileName}>{item.user}</Text>
                <Text style={styles.rankingFinancialGain}>Volume net : {item.gainTotal}</Text>
              </View>
              <View style={styles.rankingPercentBox}>
                <Text style={styles.rankingPercentValue}>{item.successRate}</Text>
              </View>
            </View>
          )}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  
  // Onglets de navigation supérieurs
  navigationTabBar: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  navigationTabItem: { flex: 1, paddingVertical: 15, alignItems: 'center', borderBottomWidth: 3, borderColor: 'transparent' },
  navigationTabActive: { borderColor: '#2E7D32' },
  navigationTabText: { fontSize: 13, color: '#6B7280', fontWeight: 'bold' },
  navigationTabTextActive: { color: '#2E7D32' },

  // Wrappers de contenu
  contentViewWrapper: { flex: 1 },
  chatListScrollPadding: { padding: 16, paddingBottom: 8 },
  
  // Carte des bulles de messages
  messageCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  vipPremiumBorder: { borderColor: '#FFCC00', backgroundColor: '#FFFDF2' },
  messageMetadataRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  messageAuthorName: { fontSize: 13, fontWeight: 'bold', color: '#111827' },
  vipAuthorColor: { color: '#9A6300' },
  messageTimeText: { fontSize: 11, color: '#9CA3AF' },
  messageContentBody: { fontSize: 14, color: '#374151', lineHeight: 19 },
  
  // Actions des messages
  messageActionsContainer: { flexDirection: 'row', marginTop: 12, borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 8, alignItems: 'center' },
  actionLikeBtn: { paddingVertical: 4, paddingHorizontal: 8, backgroundColor: '#F3F4F6', borderRadius: 6 },
  actionLikeBtnText: { fontSize: 12, color: '#4B5563', fontWeight: '600' },
  actionShareBtn: { marginLeft: 'auto' },
  actionShareBtnText: { fontSize: 12, color: '#2E7D32', fontWeight: '700' },

  // Interface d'envoi inférieure
  interactiveInputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  textInputBox: { flex: 1, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: '#111827', marginRight: 10 },
  sendActionButton: { backgroundColor: '#2E7D32', borderRadius: 24, paddingVertical: 11, paddingHorizontal: 18 },
  sendActionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },

  // Sécurité Paywall VIP
  paywallOverlayBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  paywallShieldIcon: { fontSize: 42, marginBottom: 16 },
  paywallMainTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', textAlign: 'center' },
  paywallSubDescription: { fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 19 },

  // Bannière VIP connecté
  vipGroupStatusAlert: { backgroundColor: '#111827', padding: 12, marginHorizontal: 16, marginTop: 16, borderRadius: 8, alignItems: 'center' },
  vipGroupStatusText: { color: '#FFCC00', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 },

  // Section Classement / Leaderboard
  leaderboardHeaderArea: { marginBottom: 20, marginTop: 4 },
  leaderboardTitleText: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  leaderboardSubtitleText: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  leaderboardRankingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E5E7EB' },
  rankingNumberBadge: { width: 34, height: 34, backgroundColor: '#E8F5E9', borderRadius: 17, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankingNumberText: { color: '#2E7D32', fontWeight: 'bold', fontSize: 14 },
  rankingUserDetails: { flex: 1 },
  rankingProfileName: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  rankingFinancialGain: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  rankingPercentBox: { backgroundColor: '#2E7D32', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  rankingPercentValue: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }
});