import { Stack } from "expo-router";

export default function ClothesLayout() {
	return (
		<Stack
			screenOptions={{
				headerTitleStyle: {
					fontWeight: "bold",
					fontFamily: "Quicksand-Bold",
					color: "black",
				},
				headerStyle: {
					backgroundColor: "white",
				},
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name="index"
				options={{ headerShown: false, title: "Clothes" }}
			/>
			<Stack.Screen
				name="[clothing]/index"
				options={{ headerShown: true, title: "Clothing" }}
			/>
		</Stack>
	);
}
