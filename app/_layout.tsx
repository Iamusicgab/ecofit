import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./global.css";

let Rectangle = require("../assets/images/rectangle.png");

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"Quicksand-Regular": require("../assets/fonts/quicksand-regular.ttf"),
		"Quicksand-Medium": require("../assets/fonts/quicksand-medium.ttf"),
		"Quicksand-Bold": require("../assets/fonts/quicksand-bold.ttf"),
		"Quicksand-SemiBold": require("../assets/fonts/quicksand-semibold.ttf"),
	});

	if (!fontsLoaded) return null;

	return (
		<Stack
			screenOptions={{
				headerTitleStyle: {
					fontWeight: "bold",
					fontFamily: "Quicksand-Bold",
				},
				headerShadowVisible: false,
				headerTransparent: true,
				headerShown: false,
			}}
		></Stack>
	);
}
