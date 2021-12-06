import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Layout from '../components/global/Layout';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from '../constants/Urls';
import Spinner from 'react-native-loading-spinner-overlay';
export default function ({ navigation }) {
	const [userData, setUserData] = useState({})
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		getProfileData()
	})

	const win = Dimensions.get('window');
	const ratio = win.width / 800;

	const styles = StyleSheet.create({
		container: {
			width: win.width,
			alignItems: 'center',
			justifyContent: 'center',
		},
		newsView: {
			width: win.width - 20,
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
			elevation: 3,
			padding: 10
		},
		textBlock: {
			flex: 1,
			alignSelf: 'stretch',
			flexDirection: "row",
			marginVertical: 5
		},
		leftText: {
			flex: 0.4,
			textAlign: "left",
			fontSize: 15,
			color: "#74788D"
		},
		rightText: {
			flex: 0.6,
			textAlign: "right",
			fontSize: 15,
			fontWeight: 'bold',
			color: '#48465B'
		},
		editProfileButton: {
			backgroundColor: "#5C78FF",
			width: win.width - 20,
			borderRadius: 10,
			shadowColor: "#3E49A0",
			shadowOpacity: 0.1,
			shadowOffset: {
				width: 0,
				height: 5
			},
			shadowRadius: 0.1,
			elevation: 4,
			marginTop: 10,
			justifyContent: "center",
			alignItems: "center",
			padding: 15
		},
		editProfileButtonText: {
			fontSize: 15,
			color: "#fff"
		},
	});

	async function getProfileData() {
		let token = await AsyncStorage.getItem('@user_token')
		let response = await fetch(apiUrl + '/profile', {
			method: "GET",
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
				"Authorization": token
			}
		})
		if (response.status == 200) {
			const responseData = await response.json()
			setUserData(responseData)
			setLoading(false)
		}
	}

	async function logout() {
		await AsyncStorage.removeItem("@user_token")
		navigation.navigate("WelcomeScreen")
	}

	function renderUserData() {
		if (userData.lenght != {}) {
			return (
				<View>
					<View style={styles.newsView}>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>ФИО:</Text>
							<Text style={styles.rightText}>{userData.name}</Text>
						</View>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>Должность:</Text>
							<Text style={styles.rightText}>{userData.position}</Text>
						</View>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>Пед. стаж:</Text>
							<Text style={styles.rightText}>{userData.experience}</Text>
						</View>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>Обр. учреждение:</Text>
							<Text style={styles.rightText}>{userData.institution}</Text>
						</View>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>Телефон:</Text>
							<Text style={styles.rightText}>{userData.phone == null ? "" : '+7' + userData.phone}</Text>
						</View>
						<View style={styles.textBlock}>
							<Text style={styles.leftText}>E-mail:</Text>
							<Text style={styles.rightText}>{userData.email}</Text>
						</View>
					</View>
					<View style={styles.newsView}>
						<View style={styles.textBlock}>
							<Text style={[styles.leftText, { fontSize: 20, fontWeight: 'bold' }]}>Начислено баллов:</Text>
							<Text style={[styles.rightText, { fontSize: 35, color: "#5C78FF" }]}>{userData.balance}</Text>
						</View>
					</View>
				</View>

			)
		}
	}

	return (
		<Layout navigation={navigation} title="Профиль">
			<View style={styles.container}>
				<ScrollView>
					<Spinner
						visible={loading}
						textContent={''}
						textStyle={styles.spinnerTextStyle}
					/>
					{renderUserData()}
					<View style={{ paddingHorizontal: 10, justifyContent: "center", alignItems: "center" }}>
						<TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate("EditProfileScreen")}>
							<Text style={styles.editProfileButtonText} bold>Редактировать профиль</Text>
						</TouchableOpacity>
						<TouchableOpacity style={[styles.editProfileButton, { backgroundColor: "#FFB822" }]} onPress={() => logout()}>
							<Text style={styles.editProfileButtonText} bold>Выйти из учетной записи</Text>
						</TouchableOpacity>
						<Text style={{ fontSize: 15, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 5, textAlign: "center" }} bold>ЦИФРОВОЕ ПОРТФОЛИО  ПЕДАГОГА С НАКОПИТЕЛЬНОЙ БАЛЛЬНОЙ СИСТЕМОЙ ОЦЕНКИ МЕТОДИЧЕСКОЙ ДЕЯТЕЛЬНОСТИ</Text>

						<View style={{ flex: 1, alignContent: "flex-start", justifyContent: "flex-start", paddingBottom: 50, paddingHorizontal: 15 }}>
							<Text style={{ paddingTop: 10, fontSize: 15, textAlign: "left", fontWeight: "bold" }}>Методические события городского уровня:</Text>
							<FlatList
								data={[
									{ key: '- Августовская конференция педагогических и руководящих работников' },
									{ key: '- Научно-практическая конференция' },
									{ key: '- Методические сборы (выездные)' },
								]}
								renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
							/>
							<Text style={{ fontSize: 15, textAlign: "left", paddingVertical: 5 }}>Уровень активности:</Text>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-участник</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>5</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-спикер/куратор секции</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>

							<Text style={{ paddingTop: 10, fontSize: 15, textAlign: "left", fontWeight: "bold" }}>Презентация опыта в рамках деятельности городских проблемно-творческих лабораторий в  форматах:</Text>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-открытый урок</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>5</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-мастер-класс</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-семинар-практикум</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-публикации в сборниках городского уровня</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>

							<Text style={{ paddingTop: 10, fontSize: 15, textAlign: "left", fontWeight: "bold" }}>Конкурсы профессионального мастерства (организованные на базе ЕДУ):</Text>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>- участник</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>3</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-лауреат в номинации</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>4</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-призер</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>8</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-победитель</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.5 }}>
									<Text>На уровне:</Text>
								</View>
								<View style={{ flex: 0.5, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>Доп.баллы</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-область</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>3</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-РФ</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>5</Text>
								</View>
							</View>

							<Text style={{ paddingTop: 10, fontSize: 15, textAlign: "left", fontWeight: "bold" }}>Материалы на Ю-туб канале ЕДУ, сайте ЕДУ по актуальным направлениям (в т.ч.ГРЦ) – текстовые материалы, видеосюжеты событий (учебных, воспитательных, методических..)</Text>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>1 материал/видеосюжет</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10 баллов</Text>
								</View>
							</View>

							<Text style={{ paddingTop: 10, fontSize: 15, textAlign: "left", fontWeight: "bold" }}>Курсы повышения квалификации на базе ЕДУ,  в качестве:</Text>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>- участника</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>3</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-спикера</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.5 }}>
									<Text>Количество часов:</Text>
								</View>
								<View style={{ flex: 0.5, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>Доп.баллы</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-до 8 часов;</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>3</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-от 16 до 18 часов</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>5</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-от 20 до 24 часов</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>6</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-от 36  до 48 часов</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>7</Text>
								</View>
							</View>
							<View style={{ flexDirection: 'row', flex: 1 }}>
								<View style={{ flex: 0.7 }}>
									<Text>-более 48 часов</Text>
								</View>
								<View style={{ flex: 0.3, alignContent: "flex-end" }}>
									<Text style={{ textAlign: "right" }}>10</Text>
								</View>
							</View>
							<View style={{ paddingTop: 10, flexDirection: 'row', flex: 1 }}>
								<Text>Ежегодно составление рейтинга</Text>
							</View>
							<View style={{ paddingTop: 10, flexDirection: 'row', flex: 1 }}>
								<Text>Бонусы от ЕДУ</Text>
							</View>

						</View>
					</View>
				</ScrollView>
			</View>
		</Layout>
	);
}
