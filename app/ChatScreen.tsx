import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import ChatWindow from './components/ChatWindow';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const ChatScreen = () => {
  const { name } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! 👋',
      sender: 'other',
      timestamp: '10:00 AM',
    },
  ]);

  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        otherUserName={name as string}
        otherUserAvatar='https://i.pravatar.cc/150?img=1' // Placeholder avatar
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
});

export default ChatScreen;
