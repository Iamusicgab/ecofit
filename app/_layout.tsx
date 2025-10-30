import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "./global.css";

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
				headerStyle: { backgroundColor: "#81d334" },
				headerTintColor: "#fff",
				headerTitleStyle: {
					fontWeight: "bold",
					fontFamily: "Quicksand-Bold",
				},
			}}
		>
			{/* Wrap your tabs inside the stack */}
			<Stack.Screen
				name="(tabs)"
				options={{
					headerShown: false,
					title: "ReWear",
				}}
			/>
		</Stack>
	);
}
