import { useFonts } from "expo-font";
import {
	Badge,
	Icon,
	Label,
	NativeTabs,
} from "expo-router/unstable-native-tabs";
import "./global.css";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		"Quicksand-Regular": require("../assets/fonts/quicksand-regular.ttf"),
		"Quicksand-Medium": require("../assets/fonts/quicksand-medium.ttf"),
		"Quicksand-Bold": require("../assets/fonts/quicksand-bold.ttf"),
		"Quicksand-SemiBold": require("../assets/fonts/quicksand-semibold.ttf"),
	});

	if (!fontsLoaded) {
		return null; // or a loading spinner
	}
	return (
		<NativeTabs>
			<NativeTabs.Trigger name="(home)/index">
				<Label>Home</Label>
				<Icon sf="house.fill" drawable="custom_home_drawable"></Icon>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="clothes">
				<Label>Clothes</Label>
				<Icon sf="hanger" drawable="custom_home_drawable"></Icon>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="new">
				<Label>Add</Label>
				<Icon sf="plus" drawable="custom_home_drawable"></Icon>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="donate">
				<Label>Donate</Label>
				<Icon sf="heart" drawable="custom_home_drawable"></Icon>
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="grab">
				<Label>Grab</Label>
				<Badge>12</Badge>
				<Icon sf="hand.app" drawable="custom_home_drawable"></Icon>
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
