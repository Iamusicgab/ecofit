import { useFonts } from "expo-font";
import { router, Stack, usePathname, useSegments } from "expo-router";
import React from "react";
import { AuthProvider, useAuth } from "../providers/AuthProvider";
import "./global.css";

let Rectangle = require("../assets/images/rectangle.png");

function RootContent() {
	const [fontsLoaded] = useFonts({
		"Quicksand-Regular": require("../assets/fonts/quicksand-regular.ttf"),
		"Quicksand-Medium": require("../assets/fonts/quicksand-medium.ttf"),
		"Quicksand-Bold": require("../assets/fonts/quicksand-bold.ttf"),
		"Quicksand-SemiBold": require("../assets/fonts/quicksand-semibold.ttf"),
	});

    const { user, loading } = useAuth();
    const pathname = usePathname();
    const segments = useSegments();

    React.useEffect(() => {
        if (!fontsLoaded || loading) return;
        const inAuth = pathname.startsWith("/(auth)") || segments[0] === "(auth)";
        if (!user && !inAuth) {
            router.replace("/(auth)/login");
        } else if (user && inAuth) {
            router.replace("/(tabs)/(home)");
        }
    }, [fontsLoaded, loading, user, pathname, segments]);

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

export default function RootLayout() {
	return (
		<AuthProvider>
			<RootContent />
		</AuthProvider>
	);
}
