import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import defaultImage from "../assets/No_Image_Available.jpg";
import { SelectList } from "react-native-dropdown-select-list";

export default function EditScreen({ route, navigation }) {
  const { data, value } = route.params;

  const [itemName, setItemName] = useState(data.name);
  const [quantity, setQuantity] = useState(data.quantity);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(data.category);
  const [image, setImage] = useState(data.image || defaultImage);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const categoriesData = await AsyncStorage.getItem("categories");
      if (categoriesData) {
        const categories = JSON.parse(categoriesData);
        setCategories(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleEdit = async () => {
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

    try {
      const updatedItem = {
        ...data,
        name: itemName,
        quantity,
        category,
        image,
      };

      // Fetch the items from AsyncStorage
      const itemsData = await AsyncStorage.getItem("categories");
      let items = [];
      if (itemsData) {
        items = JSON.parse(itemsData);
      }

      // Find the index of the category that contains the item
      const categoryIndex = items.findIndex((cat) => cat.value === value);

      if (categoryIndex !== -1) {
        // Find the index of the item within the category
        const itemIndex = items[categoryIndex].items.findIndex(
          (item) => item.id === data.id
        );

        if (itemIndex !== -1) {
          // Update the item within the category
          items[categoryIndex].items[itemIndex] = updatedItem;

          // Save the updated items back to AsyncStorage
          await AsyncStorage.setItem("categories", JSON.stringify(items));
        } else {
          console.error("Item not found in storage.");
          return;
        }
      } else {
        console.error("Category not found in storage.");
        return;
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Item updated successfully!",
        position: "bottom", 
      });

      navigation.navigate("Home");
    } catch (error) {
      console.error("Error updating item:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update item. Please try again.",
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
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Edit Item</Text>
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
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} />
        </View>
      </View>
      <Button title="Edit Item" onPress={handleEdit} />
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
