import React, { useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Modal, TextInput } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { apiUrl, weatherApi } from '../constants/Urls'
import { Divider } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/ru'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';

export default function ({ navigation }) {
	const [news, setNews] = useState([])
	const [weather, setWeather] = useState([])
	const [modalVisible, setModalVisible] = useState(false)
	const [userCity, setUserCity] = useState('')
	const [сityChange, setCity] = useState('')

	const win = Dimensions.get('window');
	const ratio = win.width / 800;

	const styles = StyleSheet.create({
		container: {
			width: win.width,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: 10
		},
		newsView: {
			marginVertical: 5,
			borderRadius: 10,
			borderColor: "#fff",
			borderWidth: 1,
			backgroundColor: "#fff",
			margin: 10,
			shadowOffset: {
				width: 3.5,
				height: 5.5
			},
			shadowColor: '#000',
			shadowRadius: 2.5,
			shadowOpacity: 0.2,
			elevation: 3
		},
		newsImage: {
			width: win.width - 20,
			height: 362 * ratio,
			borderTopLeftRadius: 10,
			borderTopRightRadius: 10
		},
		newsTitleView: {
			width: win.width,
			alignItems: 'flex-start',
			justifyContent: 'center',
			paddingHorizontal: 10,
			marginVertical: 10
		},
		weatherContainer: {
			marginVertical: 5,
			borderRadius: 10,
			borderColor: "#fff",
			borderWidth: 1,
			backgroundColor: "#fff",
			shadowOffset: {
				width: 3.5,
				height: 5.5
			},
			shadowColor: '#000',
			shadowRadius: 2.5,
			shadowOpacity: 0.2,
			elevation: 3,
			height: 175,
			padding: 10
		},
		centeredView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 22,
			backgroundColor: 'rgba(52, 52, 52, 0.8)'
		},
		modalView: {
			margin: 20,
			backgroundColor: "white",
			borderRadius: 20,
			padding: 35,
			alignItems: "center",
			shadowColor: "#000",
			shadowOffset: {
				width: 0,
				height: 2
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 5
		},
		openButton: {
			backgroundColor: "#F194FF",
			width: win.width / 1.5,
			borderRadius: 10,
			padding: 10,
			elevation: 2,
			marginTop: 10
		},
		textStyle: {
			color: "white",
			fontWeight: "bold",
			textAlign: "center"
		},
		modalText: {
			marginBottom: 5,
			textAlign: "center"
		}
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getUserCity()
			loadNews()
			loadWeather()
		});
	}, []);

	async function getUserCity() {
		let city = await AsyncStorage.getItem("@user_city")
		setUserCity(city == null ? 'Погода Екатеринбург' : 'Погода ' + city)
	}

	async function loadWeather() {
		let city = await AsyncStorage.getItem("@user_city")
		let cityRequest = city == null ? 'Екатеринбург' : city
		const response = await fetch(weatherApi + cityRequest, {
			method: 'GET',
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
			}
		})
		if (response.status == 200) {
			let responseData = await response.json()
			setWeather(responseData.list)
		} else {
			Alert.alert(
				"Ошибка",
				"Город не найден, попробуйте ввести другой город",
				[
					{ text: "OK", onPress: () => console.log("OK Pressed") }
				],
				{ cancelable: false }
			);
			fetch(weatherApi + 'Екатеринбург', {
				method: 'GET',
				headers: {
					"Accept": "Application/json",
					"Content-Type": "Application/json",
				}
			})
				.then(response => response.json())
				.then(responseData => {
					setWeather(responseData.list)
				});
		}
	}

	function loadNews() {
		fetch(apiUrl + '/news', {
			method: 'GET',
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
			},
		})
			.then(response => response.json())
			.then(responseData => {
				setNews(responseData.sort((a, b) => b.id - a.id))
			});
	}

	function weatherBlock() {
		if (weather.length != 0) {
			return (
				<View style={styles.weatherContainer}>
					<View style={{ flexDirection: "row" }}>
						<Text bold>{userCity}</Text>
						<TouchableOpacity style={{ flex: 1, justifyContent: "flex-end", alignItems: "flex-end" }} onPress={() => setModalVisible(true)} >
							<Text>Выбрать город</Text>
						</TouchableOpacity>
					</View>
					<Divider style={{ marginVertical: 5 }} />
					<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
						{renderWeather()}
					</ScrollView>
				</View>
			)
		}
	}

	function renderWeather() {
		if (weather.length == 0) {
			return (
				<Text>Загружаю данные о погоде</Text>
			)
		} else {
			return weather.map(field => {
				return (
					<View key={field.dt} style={{ marginHorizontal: 5 }}>
						<Text bold>{moment(field.dt_txt).format('DD MMM YYYY HH:mm')}</Text>
						<Divider />
						<View style={{ flexDirection: "row", marginVertical: 5 }}>
							<Image source={require('../assets/Image/temper.png')} style={{ width: 20, height: 15 }} />
							<Text style={{ marginLeft: 5 }} bold>{Math.round(field.main.temp) + " C°"}</Text>
						</View>
						<View style={{ flexDirection: "row", marginVertical: 5 }}>
							<Image source={require('../assets/Image/cloud.png')} style={{ width: 20, height: 15 }} />
							<Text numberOfLines={2} style={{ marginLeft: 5, maxWidth: 100 }} bold>{field.weather[0].description}</Text>
						</View>
						<View style={{ flexDirection: "row", marginVertical: 5 }}>
							<Image source={require('../assets/Image/wind.png')} style={{ width: 20, height: 19 }} />
							<Text numberOfLines={1} style={{ marginLeft: 5, maxWidth: 100 }} bold>{field.wind.speed + " м/с"}</Text>
						</View>
					</View>
				)
			})
		}
	}

	function renderNews() {
		const { width } = useWindowDimensions();
		if (news.length == 0) {
			return (
				<Text>Загружаю данные</Text>
			)
		} else {
			const regex = /(<([^>]+)>)/ig;
			return news.map(field => {
				if (field.image == "") {
					return (
						<View key={field.title} style={styles.newsView}>
							<TouchableOpacity onPress={() => navigation.navigate("DetailNews", { news: field })}>
								<View style={{ width: win.width - 20 }}></View>
								<Text style={{ marginVertical: 10, paddingHorizontal: 10, color: "#999" }}>{"Опубликовано: " + moment(field.date).format('DD MMM YYYY')}</Text>
								<Text numberOfLines={2} style={{ fontSize: 20, paddingHorizontal: 10 }} bold>{field.title}</Text>
								<Text numberOfLines={5} style={{ fontSize: 15, paddingHorizontal: 10, paddingVertical: 10 }}>{field.description.replace(/&laquo;|&raquo;|&nbsp;|&ndash;|&uuml;/g, '')}</Text>
							</TouchableOpacity>
						</View>
					)
				} else {
					return (
						<View key={field.title} style={styles.newsView}>
							<TouchableOpacity onPress={() => navigation.navigate("DetailNews", { news: field })}>
								<Image style={styles.newsImage} source={{ uri: field.image }} />
								<Text style={{ marginVertical: 10, paddingHorizontal: 10, color: "#999" }}>{"Опубликовано: " + moment(field.date).format('DD MMM YYYY')}</Text>
								<Text numberOfLines={2} style={{ fontSize: 20, paddingHorizontal: 10 }} bold>{field.title}</Text>
								<Text numberOfLines={5} style={{ fontSize: 13, paddingHorizontal: 10, paddingVertical: 10 }}>{field.description.replace(/&laquo;|&raquo;|&nbsp;/g, '')}</Text>
							</TouchableOpacity>
						</View>
					)
				}
			})
		}
	}

	async function changeCity() {
		await AsyncStorage.setItem("@user_city", сityChange)
		getUserCity()
		loadWeather()
		setModalVisible(!modalVisible);
	}

	return (
		<Layout navigation={navigation} title="Главная">
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<Text style={styles.modalText} bold>В каком городе вы проживаете?</Text>
						<Text style={{ textAlign: "center", marginBottom: 10 }}>Введите ваш город для получения данных о погоде</Text>
						<View style={{ width: win.width / 1.5, borderWidth: 1, borderColor: "#000", borderRadius: 10, marginBottom: 10 }}>
							<TextInput
								style={{ padding: 5, height: 40 }}
								onChangeText={text => setCity(text)}
								placeholder="Введите город"
								value={сityChange}
							/>
						</View>
						<TouchableOpacity
							style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
							onPress={() => {
								changeCity()
							}}>
							<Text style={styles.textStyle}>Выбрать город</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
							onPress={() => {
								setModalVisible(!modalVisible);
							}}>
							<Text style={styles.textStyle}>Отмена</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
			<ScrollView>

				<View style={styles.container}>
					{weatherBlock()}
					<View style={styles.newsTitleView}>
						<Text style={{ fontSize: 20, color: "#999", textAlign: "left" }} bold>Лента новостей</Text>
					</View>
					{renderNews()}
				</View>
			</ScrollView>
		</Layout>
	);
}
