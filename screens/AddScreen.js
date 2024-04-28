import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { Text, View, TextInput, Button, StyleSheet, Image } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import defaultImage from "../assets/No_Image_Available.jpg";

export default function AddScreen({ navigation }) {
  const id = uuid.v4();
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  //   console.log(categories);

  useEffect(() => {
    fetchCategories();
  }, []); // Fetch categories on component mount

  const fetchCategories = async () => {
    try {
      const categoriesData = await AsyncStorage.getItem("categories");
      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      alert("Item name is required.");
      return;
    }

    if (!quantity.trim() || isNaN(quantity)) {
      alert("Quantity must be a valid number.");
      return;
    }

    if (!category) {
      alert("Please select a category.");
      return;
    }

    const imageUri = image || defaultImage;

    try {
      // Create the new item object
      const newItem = {
        id,
        name: itemName,
        quantity,
        category,
        image: imageUri,
        check: false,
      };
      // Get the current categories from AsyncStorage
      const categoriesData = await AsyncStorage.getItem("categories");
      if (!categoriesData) {
        alert("No categories found.");
        return;
      }
      const categories = JSON.parse(categoriesData);

      // Find the index of the category that matches the selected category
      const categoryIndex = categories.findIndex(
        (cat) => cat.value === category
      );

      // If the category is found, push the new item into its items array
      if (categoryIndex !== -1) {
        categories[categoryIndex].items.push(newItem);

        // Save the updated categories back to AsyncStorage
        await AsyncStorage.setItem("categories", JSON.stringify(categories));
      } else {
        alert("Selected category not found.");
        return;
      }

      // Clear input fields and navigate back to Home screen
      setItemName("");
      setQuantity("");
      setCategory(null);
      setImage(null);
      console.log("Item data saved successfully!");

      fetchCategories();

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Item added successfully!",
        position: "bottom", 
      });
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error saving item data:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to add item. Please try again.",
        position: "bottom", 
      });
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Add Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Item Name"
        value={itemName}
        onChangeText={(item) => setItemName(item)}
        placeholderTextColor={"black"}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        value={quantity}
        onChangeText={(text) => setQuantity(text)}
        keyboardType="numeric"
        placeholderTextColor={"black"}
      />
      <SelectList
        save="value"
        label="Category"
        placeholder="Select Category"
        setSelected={(val) => setCategory(val)}
        data={categories}
        search={false}
        notFoundText="No Category found. Please add category."

      />
      <View style={{ marginBottom: 10, marginTop: 10 }}>
        <Button
          title="Select Image"
          onPress={pickImage}
          style={{ marginBottom: 5 }}
        />
        {image && (
          <View style={styles.imageContainer}>
            <Image source={image} style={styles.image} />
          </View>
        )}
      </View>
      <Button title="Add Item" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingLeft: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
});
