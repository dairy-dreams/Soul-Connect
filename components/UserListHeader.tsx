import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const UserListHeader = ({
  query,
  setQuery,
  searchVisible,
  setSearchVisible,
}: {
  query: string;
  setQuery: (text: string) => void;
  searchVisible: boolean;
  setSearchVisible: (val: boolean) => void;
}) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const closeMenus = () => {
    Keyboard.dismiss(); // Closes keyboard
    setMenuVisible(false); // Closes dropdown
  };

  return (
    <TouchableWithoutFeedback onPress={closeMenus}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Users</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              onPress={() => {
                closeMenus(); // close dropdown if open
                setSearchVisible((prev) => !prev);
              }}
              style={styles.icon}
            >
              <AntDesign name="search1" size={22} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.icon}
              onPress={(e) => {
                e.stopPropagation(); // prevent parent blur
                setMenuVisible((prev) => !prev);
              }}
            >
              <AntDesign name="ellipsis1" size={22} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {searchVisible && (
          <TextInput
            placeholder="Search users..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        )}

        {menuVisible && (
          <View style={styles.dropdown}>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                alert("New Group clicked");
                closeMenus();
              }}
            >
              <Text style={styles.dropdownText}>New Group</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                alert("Settings clicked");
                closeMenus();
              }}
            >
              <Text style={styles.dropdownText}>Settings</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                alert("Log Out clicked");
                closeMenus();
              }}
            >
              <Text style={styles.dropdownText}>Log Out</Text>
            </Pressable>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default UserListHeader;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: "#252525",
    fontSize: 26,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 14,
    position: "relative",
  },
  icon: {
    padding: 6,
  },
  searchInput: {
    backgroundColor: "#F0F0F0",
    color: "#252525",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    zIndex: 20,
    paddingVertical: 6,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
});
