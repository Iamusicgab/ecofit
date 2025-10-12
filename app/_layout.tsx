import {
	NativeTabs,
	Icon,
	Label,
	Badge,
} from "expo-router/unstable-native-tabs";
import "./global.css";
import { useFonts } from "expo-font";

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		quicksand_regular: require("../assets/fonts/quicksand-regular.ttf"),
		quicksand_medium: require("../assets/fonts/quicksand-medium.ttf"),
		quicksand_bold: require("../assets/fonts/quicksand-bold.ttf"),
		quicksand_semibold: require("../assets/fonts/quicksand-semibold.ttf"),
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
