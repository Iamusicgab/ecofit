import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

function List() {
	return (
		<View className="flex-row flex-wrap justify-between">
			<View className="w-[48%] mb-4">
				<TouchableOpacity className="bg-white rounded-2xl p-4 shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 flex-1 gap-4">
					{/* T-shirt Image */}
					<Image
						source="https://marksandspencer.com.ph/cdn/shop/products/asset1_cxnmarksandspencer_com-SD_03_T28_1995M_Y0_X_EC_1.jpg?v=1652945193"
						className=""
						style={{ height: 130, width: "100%", borderRadius: 8 }}
					></Image>

					{/* Item Labels */}
					<View className="items-center">
						<Text className="text-lg font-bold text-black mb-1 font-quicksand_bold ">
							test Item Name
						</Text>
						<Text className="text-sm text-gray-600 font-medium ">
							test Item Status
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View className="w-[48%] mb-4">
				<TouchableOpacity className="bg-white rounded-2xl p-4 shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 flex-1 gap-4">
					{/* T-shirt Image */}
					<Image
						source="https://marksandspencer.com.ph/cdn/shop/products/asset1_cxnmarksandspencer_com-SD_03_T28_1995M_Y0_X_EC_1.jpg?v=1652945193"
						className=""
						style={{ height: 130, width: "100%", borderRadius: 8 }}
					></Image>

					{/* Item Labels */}
					<View className="items-center">
						<Text className="text-lg font-bold text-black mb-1 font-quicksand_bold ">
							test Item Name
						</Text>
						<Text className="text-sm text-gray-600 font-medium ">
							test Item Status
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View className="w-[48%] mb-4">
				<TouchableOpacity className="bg-white rounded-2xl p-4 shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 flex-1 gap-4">
					{/* T-shirt Image */}
					<Image
						source="https://marksandspencer.com.ph/cdn/shop/products/asset1_cxnmarksandspencer_com-SD_03_T28_1995M_Y0_X_EC_1.jpg?v=1652945193"
						className=""
						style={{ height: 130, width: "100%", borderRadius: 8 }}
					></Image>

					{/* Item Labels */}
					<View className="items-center">
						<Text className="text-lg font-bold text-black mb-1 font-quicksand_bold ">
							test Item Name
						</Text>
						<Text className="text-sm text-gray-600 font-medium ">
							test Item Status
						</Text>
					</View>
				</TouchableOpacity>
			</View>
			<View className="w-[48%] mb-4">
				<TouchableOpacity className="bg-white rounded-2xl p-4 shadow-[0_6px_0px_rgba(229,231,235,1)] border-gray-200 border-2 flex-1 gap-4">
					{/* T-shirt Image */}
					<Image
						source="https://marksandspencer.com.ph/cdn/shop/products/asset1_cxnmarksandspencer_com-SD_03_T28_1995M_Y0_X_EC_1.jpg?v=1652945193"
						className=""
						style={{ height: 130, width: "100%", borderRadius: 8 }}
					></Image>

					{/* Item Labels */}
					<View className="items-center">
						<Text className="text-lg font-bold text-black mb-1 font-quicksand_bold ">
							test Item Name
						</Text>
						<Text className="text-sm text-gray-600 font-medium ">
							test Item Status
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default List;
