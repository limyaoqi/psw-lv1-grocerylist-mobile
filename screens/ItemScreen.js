import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

export default function ItemScreen({ route,navigation }) {
  const { data, value } = route.params;
  const [isChecked, setIsChecked] = useState(data.check);
  const handleCheck = async () => {
    try {
      // Toggle the 'isChecked' state
      setIsChecked(!isChecked);

      // Fetch the items from AsyncStorage
      const itemsData = await AsyncStorage.getItem("categories");
      let items = [];
      if (itemsData) {
        items = JSON.parse(itemsData);
      }

      const itemIndex = items.findIndex((category) => category.value === value);
      if (itemIndex !== -1) {
        const item = items[itemIndex].items.find((item) => item.id === data.id);

        // If the item is found, update its 'check' property
        if (item) {
          item.check = !isChecked;
          //   console.log(item);
        } else {
          console.error("Item not found in storage.");
          return;
        }
      }
      await AsyncStorage.setItem("categories", JSON.stringify(items));
    } catch (error) {
      console.error("Error updating item check:", error);
    }
  };

  const handleDelete = () => {
    // Prompt the user with a confirmation dialog
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this item?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              // Perform deletion of the item
  
              // Fetch the items from AsyncStorage
              const itemsData = await AsyncStorage.getItem("categories");
              let items = [];
              if (itemsData) {
                items = JSON.parse(itemsData);
              }
  
              // Find the index of the category containing the item to delete
              const categoryIndex = items.findIndex(
                (category) => category.value === value
              );
  
              if (categoryIndex !== -1) {
                // Find the index of the item within the category
                const itemIndex = items[categoryIndex].items.findIndex(
                  (item) => item.id === data.id
                );
  
                if (itemIndex !== -1) {
                  // Remove the item from the items array
                  items[categoryIndex].items.splice(itemIndex, 1);
  
                  // Save the updated items back to AsyncStorage
                  await AsyncStorage.setItem(
                    "categories",
                    JSON.stringify(items)
                  );
  
                  // Display toast message for successful deletion
                  Toast.show({
                    type: "success",
                    text1: "Item deleted successfully",
                    visibilityTime: 2000,
                    autoHide: true,
                    position: "bottom", 
                  });
  
                  // Navigate back to the home page
                  navigation.navigate("Home");
                } else {
                  console.error("Item not found in storage.");
                  return;
                }
              } else {
                console.error("Category not found in storage.");
                return;
              }
            } catch (error) {
              console.error("Error deleting item:", error);
              // Display toast message for deletion error
              Toast.show({
                type: "error",
                text1: "Error deleting item",
                visibilityTime: 2000,
                autoHide: true,
                position: "bottom", 
              });
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    // Navigate to the edit screen with the item data
    navigation.navigate('Edit Item', { data,value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={data.image} style={styles.image} resizeMode="cover" />
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.quantity}>{`Quantity: ${data.quantity}`}</Text>
          <Text style={styles.category}>{`Category: ${data.category}`}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isChecked ? styles.checkedButton : null]}
            onPress={handleCheck}
          >
            <Text style={styles.buttonText}>
              {isChecked ? "Uncheck" : "Check"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  card: {
    width: "80%", // Adjust the width as needed
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 18,
    marginBottom: 5,
  },
  category: {
    fontSize: 18,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto", // Pushes the button group to the bottom
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc", // Button border color
    backgroundColor: "#fff", // Button background color
  },
  buttonText: {
    fontWeight: "bold",
  },
  checkedButton: {
    backgroundColor: "blur", // Replace 'blur' with the color for checked state
  },
  editButton: {
    backgroundColor: "blue", // Change button color to blue
  },
  deleteButton: {
    backgroundColor: "red", // Change button color to red
  },
});
