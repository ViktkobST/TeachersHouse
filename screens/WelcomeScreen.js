import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import Colors from '../constants/colors';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import * as Location from 'expo-location';
export default function ({ navigation }) {


	const win = Dimensions.get('window');
	const ratio = win.width / 800;

	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [activeSlide, setActiveSlide] = useState(0)
	const styles = StyleSheet.create({
		newsImage: {
			width: win.width - 20,
			height: 500 * ratio,
			borderTopLeftRadius: 10,
			borderTopRightRadius: 10
		},
	});

	useEffect(() => {
		(async () => {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);
		})();
		checkToken()
	}, []);

	async function checkToken() {
		let token = await AsyncStorage.getItem("@user_token")
		if (token != null) {
			navigation.navigate("MainTabs")
		}
	}

	const slides = [
		{
			id: "WpIAc9by5iU",
			thumbnail: require("../assets/Image/welcome.png"),
			title: "Добро пожаловать в приложение 'Дом Учителя'. Нажмите 'Начать', чтобы присоединиться'",
			text: ""
		}, {
			id: "sNPnbI1arSE",
			thumbnail: require("../assets/Image/welcome1.png"),
			title: "Уникальные программы курсов повышения квалификации.",
			text: "Широкополосное образование, персонализация, командный тип образования, трансформация организаций, образовательные экосистемы, наставничество, цифровизация и многое другое"
		}, {
			id: "VOgFZfRVaww",
			thumbnail: require("../assets/Image/welcome2.png"),
			title: "Наши проекты",
			text: "«Единое методическое пространство образовательного сообщества города», «Имидж Екатеринбургского Педагога», «Городские ресурсные центры», «Молодость PRO», «Профессиональные конкурсы», «Повышение квалификации педагогов и управленцев», «Информационно-методическая платформа»"
		}
	]

	_renderItem = ({ item, index }) => {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: win.width - 40 }}>
				<Image resizeMode='contain' style={styles.newsImage} source={item.thumbnail} />
				<Text numberOfLines={0} style={{ marginTop: 10, textAlign: "left", fontSize: 20 }} bold>{item.title}</Text>
				<Text numberOfLines={0} style={{ marginTop: 10, textAlign: "left" }}>{item.text}</Text>
			</View>
		);
	}

	return (
		<Layout navigation={navigation}>
			<View
				style={{
					flex: 1,
					alignItems: 'flex-start',
					justifyContent: 'center',
					padding: 20
				}}
			>
				<View style={{ alignItems: "flex-start" }}>
					<Text style={{ fontSize: 25 }} bold>Добро пожаловать</Text>
				</View>
				<Carousel
					sliderWidth={win.width}
					sliderHeight={win.height}
					itemWidth={win.width}
					data={slides}
					renderItem={_renderItem}
					hasParallaxImages={true}
					onSnapToItem={(index) => setActiveSlide(index)}
				/>
				<Pagination
					dotsLength={slides.length}
					activeDotIndex={activeSlide}
					dotContainerStyle={{ justifyContent: "center", alignItems: "center", flex: 0.4 }}
					dotStyle={{
						width: 10,
						height: 10,
						borderRadius: 5,
						marginHorizontal: 8,
					}}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
				<View>
					<TouchableOpacity style={{ backgroundColor: "#FFB822", height: 50, width: win.width - 35, justifyContent: "center", alignItems: "center", borderRadius: 10 }} onPress={() => navigation.navigate("AuthScreen")}>
						<Text style={{ fontSize: 20, color: "white" }} bold>Начать</Text>
					</TouchableOpacity>
				</View>

			</View>
		</Layout>
	);
}
