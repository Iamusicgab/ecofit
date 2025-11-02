import { Ionicons } from "@expo/vector-icons";
import { Image, ImageBackground } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

let Rectangle = require("../../../assets/images/rectangle.png");

function Header(props: any) {
	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 50,
			}}
		>
			<ImageBackground
				source={Rectangle}
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 16,
					paddingVertical: 64,
				}}
			>
				<View className="flex-row items-center gap-4 flex-1">
					{props.showBackButton && (
						<TouchableOpacity onPress={props.onBackPress}>
							<Ionicons name="arrow-back" size={28} color="white" />
						</TouchableOpacity>
					)}
					<Text className="text-4xl font-quicksand_bold text-white">
						{props.title}
					</Text>
				</View>
				{props.icon && (
					<Image
						style={{
							height: 40,
							width: 40,
							borderRadius: 100,
							borderColor: "white",
							borderWidth: 1.5,
						}}
						contentFit="cover"
						source="https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?ixlib=rb-4.1.0&fm=jpg&q=60&w=3000"
					/>
				)}
			</ImageBackground>
		</View>
	);
}

export default Header;
