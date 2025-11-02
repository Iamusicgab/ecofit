import { Pressable, Text } from "react-native";

function CustomButton(props: any) {
	return (
		<Pressable
			onPress={props.onPress}
			className="p-4 rounded-2xl border-2 border-green shadow-[0_4px_0px_rgba(129,211,52,1)] active:bg-green transition group flex-1 items-center"
		>
			<Text className="font-quicksand_semibold text-green group-active:text-white">
				{props.label}
			</Text>
		</Pressable>
	);
}

export default CustomButton;
