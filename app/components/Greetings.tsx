import { Text, View } from "react-native";

function Greetings(props: any) {
	return (
		<View className="px-4 py-4 self-start rounded-3xl border-4 border-green -rotate-2 shadow-[0_6px_0px_rgba(129,211,52,1)]">
			<Text className="font-quicksand_bold text-4xl">Hello, {props.name}!</Text>
		</View>
	);
}

export default Greetings;
