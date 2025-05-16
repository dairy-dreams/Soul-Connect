import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChatHeader from "./ChatHeader";
import { BUTTON_COLOR, PRIMARY_COLOR } from "@/constant/Color";

interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

interface ChatWindowProps {
  messages: any[];
  onSendMessage: (message: string) => void;
  otherUserName: string;
  otherUserAvatar: string;
}

function ChatWindow({
  messages,
  onSendMessage,
  otherUserName,
  otherUserAvatar,
}: ChatWindowProps) {
  const [inputText, setInputText] = React.useState("");
  const flatListRef = useRef<FlatList>(null);

  const renderMessage = ({ item }: { item: Message }) => (
    <Pressable
      onLongPress={() => console.log("Long Pressed", item.text)}
      style={({ pressed }) => [
        styles.messageBubble,
        item.sender === "user" ? styles.userMessage : styles.otherMessage,
        pressed && { opacity: 0.5 },
      ]}
    >
      <Text
        style={[
          item.sender === "user"
            ? styles.messageText
            : styles.otherMessageText,
        ]}
      >
        {item.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text
          style={
            item.sender === "user" ? styles.timestamp : styles.otherTimestamp
          }
        >
          {item.timestamp}
        </Text>
        {item.sender === "user" && (
          <View style={styles.tickContainer}>
            <Ionicons name="checkmark" size={12} color="#999" />
            <Ionicons
              name="checkmark"
              size={12}
              color="#999"
              style={styles.secondTick}
            />
          </View>
        )}
      </View>
    </Pressable>
  );

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      style={styles.container}
    >
      <ChatHeader name={otherUserName} avatar={otherUserAvatar} />
      <ImageBackground
        source={require("../assets/images/chat-bg-light.png")}
        style={styles.backgroundImage}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={24}
            color={inputText.trim() ? PRIMARY_COLOR : "#999"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    height: Dimensions.get("window").height,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(245, 245, 245, 0.7)",
    backdropFilter: "blur(40px)",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  otherMessageText: {
    color: "#FFF",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 4,
  },
  tickContainer: {
    flexDirection: "row",
    marginLeft: 4,
  },
  secondTick: {
    marginLeft: -8,
  },
  timestamp: {
    fontSize: 10,
    color: "#999",
  },
  otherTimestamp: {
    color: "#FFF",
    fontSize: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    alignItems: "center",
  },
  input: {
    flex: 1,
    marginRight: 12,
    padding: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatWindow;
