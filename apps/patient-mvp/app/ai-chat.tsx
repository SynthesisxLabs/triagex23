import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  type?: 'suggestion' | 'specialist' | 'medicine';
};

export default function AIScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Hello! I'm your AI Health Companion. Describe your symptoms, and I'll help you understand what might be going on.", 
      sender: 'ai' 
    },
  ]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Based on your symptoms (fever and headache), it could be a viral infection. I recommend consulting a General Physician.",
        sender: 'ai',
      };
      
      const specialistSuggestion: Message = {
        id: (Date.now() + 2).toString(),
        text: "Recommended: General Physician",
        sender: 'ai',
        type: 'specialist'
      };

      const medicineSuggestion: Message = {
        id: (Date.now() + 3).toString(),
        text: "Basic Guidance: Rest well and stay hydrated. You may take Paracetamol for fever relief.",
        sender: 'ai',
        type: 'medicine'
      };

      setMessages(prev => [...prev, aiResponse, specialistSuggestion, medicineSuggestion]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.header} edges={['top']}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>AI Doctor Chat</Text>
        <TouchableOpacity style={styles.infoButton}>
          <Ionicons name="information-circle-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </SafeAreaView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View 
              key={message.id} 
              style={[
                styles.messageWrapper, 
                message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper
              ]}
            >
              {message.sender === 'ai' && (
                <View style={[styles.aiAvatar, { backgroundColor: theme.primary }]}>
                  <Ionicons name="sparkles" size={14} color="#FFFFFF" />
                </View>
              )}
              <View 
                style={[
                  styles.messageBubble,
                  message.sender === 'user' 
                    ? [styles.userBubble, { backgroundColor: theme.primary }] 
                    : [styles.aiBubble, { backgroundColor: theme.secondary, borderColor: theme.border }],
                  message.type === 'specialist' && styles.specialistBubble,
                  message.type === 'medicine' && styles.medicineBubble,
                ]}
              >
                {message.type === 'specialist' && (
                  <Ionicons name="medkit" size={16} color={theme.primary} style={{ marginBottom: 4 }} />
                )}
                {message.type === 'medicine' && (
                  <Ionicons name="bandage" size={16} color="#FF9800" style={{ marginBottom: 4 }} />
                )}
                <Text style={[
                  styles.messageText, 
                  { color: message.sender === 'user' ? '#FFFFFF' : theme.text }
                ]}>
                  {message.text}
                </Text>
              </View>
            </View>
          ))}
          {isTyping && (
            <View style={styles.aiMessageWrapper}>
              <View style={[styles.aiAvatar, { backgroundColor: theme.primary }]}>
                <Ionicons name="sparkles" size={14} color="#FFFFFF" />
              </View>
              <View style={[styles.aiBubble, { backgroundColor: theme.secondary, borderColor: theme.border, paddingVertical: 12 }]}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: theme.secondary, borderTopColor: theme.border }]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Type your symptoms..."
            placeholderTextColor={theme.text + '60'}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity 
            onPress={handleSend}
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'InstrumentSans-Bold',
  },
  infoButton: {
    padding: 5,
  },
  chatContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  aiMessageWrapper: {
    alignSelf: 'flex-start',
  },
  aiAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    borderColor: 'transparent',
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  specialistBubble: {
    backgroundColor: 'rgba(12, 40, 253, 0.05)',
    borderStyle: 'dashed',
    borderColor: '#0C28FD',
  },
  medicineBubble: {
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    borderStyle: 'dashed',
    borderColor: '#FF9800',
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'InstrumentSans-Regular',
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'InstrumentSans-Regular',
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
