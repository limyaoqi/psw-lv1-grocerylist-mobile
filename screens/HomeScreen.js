import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [selected, setSelected] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [isFocused]); // Fetch categories on component mount

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

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          data={categories}
          save="value"
          label="Categories"
          notFoundText="No Category found. Please add category."
        />
        {categories.length === 0 && (
          <Text style={styles.noCategoryText}>
            No Item found. Please add item.
          </Text>
        )}
        {selected.length < 1
          ? categories.map((category) =>
              category.items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    navigation.navigate("Item Detail", {
                      data: item,
                      value: category.value,
                    });
                  }}
                >
                  <View style={styles.containerStyle} key={item.id}>
                    <View style={styles.itemContainer}>
                      <View style={styles.imageContainer}>
                        <Image source={item.image} style={styles.image} />
                      </View>
                      <View style={styles.detailsContainer}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemStyle}>
                          Quantity: ${item.quantity}
                        </Text>
                        <Text style={styles.itemStyle}>
                          Category: {category.value}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )
          : categories
              .filter((category) => selected.includes(category.value))
              .map((category) =>
                category.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => {
                      navigation.navigate("Item Detail", { data: item });
                    }}
                  >
                    <View style={styles.containerStyle} key={item.id}>
                      <View style={styles.itemContainer}>
                        <View style={styles.imageContainer}>
                          <Image source={item.image} style={styles.image} />
                        </View>
                        <View style={styles.detailsContainer}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemStyle}>
                            Quantity: ${item.quantity}
                          </Text>
                          <Text style={styles.itemStyle}>
                            Category: {category.value}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containerStyle: {
    marginTop: 20,
    backgroundColor: "rgb(77,77,77)",
    padding: 5,
    borderRadius: 6,
    height: 150,
  },
  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#222222",
    height: "100%",
  },
  imageContainer: {
    width: "50%", // Half of the width for the image
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%", // Set the desired height for the image
    resizeMode: "cover",
  },
  detailsContainer: {
    width: "50%", // Half of the width for the details
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  itemStyle: {
    marginBottom: 5,
    color: "white",
  },
});
