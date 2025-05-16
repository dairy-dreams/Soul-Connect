import UserListHeader from "@/components/UserListHeader";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  Pressable,
  View
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase.client";

const UserListScreen = () => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);

  // Get the current logged-in user
  const currentUser = auth.currentUser;

  const getAllUsersExcept = async () => {
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const fetchedUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter out the current user by uid or phoneNumber
      let filteredUsers = fetchedUsers;
      if (currentUser) {
        if (currentUser.uid) {
          filteredUsers = fetchedUsers.filter(
            (user) => user.id !== currentUser.uid
          );
        } else if (currentUser.phoneNumber) {
          filteredUsers = fetchedUsers.filter(
            (user) => user.phoneNumber !== currentUser.phoneNumber
          );
        }
      }

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const handleUserPress = (userId: string, name: string) => {
    router.push({
      pathname: "/ChatScreen",
      params: { userId, name },
      modal: true
    });
  };

  useEffect(() => {
    getAllUsersExcept();
  }, []);

  // Filter users by search query
  const displayedUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(query.toLowerCase())
  );

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
        data={displayedUsers}
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
            <Image source={{ uri: item.avatar || "https://i.pravatar.cc/150" }} style={styles.avatar} />
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
