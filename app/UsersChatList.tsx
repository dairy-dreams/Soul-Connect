import UserListHeader from "@/components/UserListHeader";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Pressable,
  View
} from "react-native";

const users = [
  { id: "1", name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: "2", name: "Alice Smith", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: "3", name: "Michael Johnson", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: "4", name: "Emily Davis", avatar: "https://i.pravatar.cc/150?img=4" },
];

const UserListScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleUserPress = (userId: string, name: string) => {
    router.push({
      pathname: "/ChatScreen",
      params: { userId, name }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <UserListHeader
        query={query}
        setQuery={setQuery}
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
      />

      {/* List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <Pressable 
            onPress={() => handleUserPress(item.id, item.name)}
            android_ripple={{ color: '#DADADA' }}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.pressed
            ]}
          >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default UserListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 16,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 14,
    marginVertical: 6,
    borderRadius: 14,
    overflow: 'hidden', // This is important for the ripple effect
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#EAEAEA',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 14,
  },
  name: {
    fontSize: 16,
    color: "#252525",
    fontWeight: "600",
  },
});
