import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from "accordion-collapse-react-native";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

export default function CategoryScreen() {
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
  }, [isFocused]); // Fetch categories on component mount

  const fetchData = async () => {
    try {
      const categoriesData = await AsyncStorage.getItem("categories");
      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async () => {
    if (categoryInput.trim() !== "") {
      const newCategory = {
        key: categories.length + 1,
        value: categoryInput.trim(),
        items: [],
      };
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setCategoryInput("");

      // Save categories to AsyncStorage
      try {
        await AsyncStorage.setItem(
          "categories",
          JSON.stringify([...categories, newCategory])
        );
        Toast.show({
          type: "success",
          text1: "Category Added",
          position: "bottom", 
        });
      } catch (error) {
        console.error("Error saving categories:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: error.message,
          position: "bottom", 
        });
      }
    }
  };

  const handleDeleteCategory = async (categoryKey) => {
    const categoryToDelete = categories.find(
      (category) => category.key === categoryKey
    );

    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete the category "${categoryToDelete.value}" and all its associated items?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              const updatedCategories = categories.filter(
                (category) => category.key !== categoryKey
              );
              setCategories(updatedCategories);
              await AsyncStorage.setItem(
                "categories",
                JSON.stringify(updatedCategories)
              );
              Toast.show({
                type: "success",
                text1: "Category Deleted",
                position: "bottom", 
              });
            } catch (error) {
              console.error("Error deleting category:", error);
              Toast.show({
                type: "error",
                text1: "Error",
                text2: error.message,
                position: "bottom", 
              });
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Category"
          value={categoryInput}
          onChangeText={setCategoryInput}
        />
        <Button title="Add" onPress={handleAddCategory} />
      </View>
      {categories.map((category) => (
        <View key={category.key} style={styles.containerStyle}>
          <Collapse>
            <CollapseHeader>
              <View
                style={{
                  backgroundColor: "black",
                  padding: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>{category.value}</Text>
                <TouchableOpacity
                  onPress={() => handleDeleteCategory(category.key)}
                >
                  <AntDesign name="delete" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </CollapseHeader>

            <CollapseBody style={{ borderTop: "2px solid white" }}>
              <View
                style={{
                  backgroundColor: "black",
                  padding: 10,
                }}
              >
                {category.items.length > 0 ? (
                  category.items.map((item) => {
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => alert("hi")}
                      >
                        <Text style={{ color: "white", marginBottom: 5 }}>
                          {item.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={{ color: "white" }}>
                    There are no items in this category
                  </Text>
                )}
              </View>
            </CollapseBody>
          </Collapse>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  categoryItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  containerStyle: {
    marginBottom: 20,
    backgroundColor: "rgb(77,77,77)",
    padding: 5,
    borderRadius: 6,
  },
});
