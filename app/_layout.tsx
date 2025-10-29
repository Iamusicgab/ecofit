import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import {
	Badge,
	Icon,
	Label,
	NativeTabs,
	VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
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
		<NativeTabs
			minimizeBehavior="onScrollDown"
			backgroundColor={Platform.select({
				ios: "#FFFFFF",
				android: "#F2FFE6",
			})}
			tintColor="#499600"
			indicatorColor="#CEE9B5"
		>
			<NativeTabs.Trigger name="(home)/index">
				<Label>Home</Label>

				{Platform.select({
					ios: <Icon sf="house.fill" drawable="custom_home_drawable"></Icon>,
					android: (
						<Icon src={<VectorIcon family={Ionicons} name="home" />}></Icon>
					),
				})}
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="clothes">
				<Label>Clothes</Label>
				{Platform.select({
					ios: <Icon sf="hanger" drawable="custom_home_drawable"></Icon>,
					android: (
						<Icon src={<VectorIcon family={Ionicons} name="shirt" />}></Icon>
					),
				})}
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="new">
				<Label>Add</Label>
				{Platform.select({
					ios: <Icon sf="plus" drawable="custom_home_drawable"></Icon>,
					android: (
						<Icon src={<VectorIcon family={Ionicons} name="add" />}></Icon>
					),
				})}
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="donate">
				<Label>Donate</Label>
				{Platform.select({
					ios: <Icon sf="heart" drawable="custom_home_drawable"></Icon>,
					android: (
						<Icon src={<VectorIcon family={Ionicons} name="heart" />}></Icon>
					),
				})}
			</NativeTabs.Trigger>
			<NativeTabs.Trigger name="grab">
				<Label>Grab</Label>
				<Badge>12</Badge>
				{Platform.select({
					ios: <Icon sf="hand.app" drawable="custom_home_drawable"></Icon>,
					android: (
						<Icon
							src={<VectorIcon family={Ionicons} name="hand-right" />}
						></Icon>
					),
				})}
			</NativeTabs.Trigger>
		</NativeTabs>
	);
}
