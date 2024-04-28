import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CategoryScreen from "../screens/CategoryScreen";
import AddScreen from "../screens/AddScreen";
import { Text, TouchableOpacity } from "react-native";
import ItemScreen from "../screens/ItemScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditScreen from "../screens/EditScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const AddButton = ({ onPress }) => (
  <TouchableOpacity style={{ marginRight: 20 }} onPress={onPress}>
    <Entypo name="plus" size={24} color="black" />
  </TouchableOpacity>
);

function HomeStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <AddButton onPress={() => navigation.navigate("Add Item")} />
        ),
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Add Item" component={AddScreen} />
      <Stack.Screen name="Item Detail" component={ItemScreen} />
      <Stack.Screen name="Edit Item" component={EditScreen} />
    </Stack.Navigator>
  );
}

function CategoryStack({ navigation }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <AddButton onPress={() => navigation.navigate("Add Item")} />
        ),
      }}
    >
      <Stack.Screen name="Category" component={CategoryScreen} />
      <Stack.Screen name="Item Detail" component={ItemScreen} />
      <Stack.Screen name="Add Item" component={AddScreen} />
    </Stack.Navigator>
  );
}

export default function Navbar() {
  // const navigate = useNavigation()
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          height: 60,
          width: "100%",
        },
        tabBarLabelStyle: {
          fontSize: 14,
          marginBottom: 5,
        },
        tabBarIconStyle: {
          marginBottom: 5,
          fontSize: 100,
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: ({ color }) => (
            <React.Fragment>
              <Entypo name="home" size={24} color={color} />
              <Text style={{ marginLeft: 5 }}>Home</Text>
            </React.Fragment>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Category Stack"
        component={CategoryStack}
        options={{
          tabBarLabel: ({ color }) => (
            <React.Fragment>
              <FontAwesome6 name="list" size={24} color={color} />
              <Text style={{ marginLeft: 5 }}>Category</Text>
            </React.Fragment>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
