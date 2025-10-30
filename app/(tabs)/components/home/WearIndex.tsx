import { Text, View } from "react-native";

function WearIndex(props: any) {
	return (
		<View>
			<Text className="text-xl font-semibold text-black mb-4 font-quicksand_semibold text-center">
				EcoFit Index
			</Text>
			<View className="text-center flex-1 justify-center items-center py-6 px-2 border-4 rounded-tl-[50px] rounded-bl-[50px]  rounded-tr-[50px] rounded-br-3xl border-green shadow-[0_6px_0px_rgba(129,211,52,1)]">
				<Text className="text-4xl font-quicksand_bold text-green">
					{props.percentage}%
				</Text>
			</View>
		</View>
	);
}

export default WearIndex;
