import { Text, View } from "react-native";

function ReWear(props: any) {
	return (
		<View className="border-4 rounded-3xl p-4 border-green shadow-[0_6px_0px_rgba(129,211,52,1)] gap-2">
			<View className="text-center flex-1 justify-center items-center">
				<Text className="font-quicksand_semibold">Total ReWear</Text>
				<Text className="font-quicksand_bold text-4xl">
					{props.totalrewear}
				</Text>
			</View>
			<View className="flex-row gap-2">
				<View className="flex-1 items-baseline">
					<Text className="font-quicksand_semibold">Donated</Text>
					<Text className="font-quicksand_bold text-3xl">{props.donated}</Text>
				</View>
				<View className="flex-1 items-end">
					<Text className="font-quicksand_semibold">Sold</Text>
					<Text className="font-quicksand_bold text-3xl">{props.sold}</Text>
				</View>
			</View>
		</View>
	);
}

export default ReWear;
