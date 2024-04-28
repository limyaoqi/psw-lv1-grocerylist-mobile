import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navbar from "./component/Navbar";
import { NavigationContainer } from "@react-navigation/native";
import Toast from 'react-native-toast-message'; // Import Toast


export default function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navbar />
      </NavigationContainer>
      <StatusBar hidden />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Change the background color
    alignItems: "center",
    justifyContent: "flex-start", // Change the vertical alignment to 'flex-start'
  },
});
