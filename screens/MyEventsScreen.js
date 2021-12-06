import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Modal } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { apiUrl, weatherApi } from '../constants/Urls'
import { Divider } from 'react-native-paper';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import 'moment/locale/ru'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

export default function ({ navigation }) {
	const [events, setNews] = useState([])
	const [checkLoad, setCheckLoad] = useState(false)
	const [loading, setLoading] = useState(true);

	const win = Dimensions.get('window');
	const ratio = win.width / 800;

	const styles = StyleSheet.create({
		authImage: {
			width: win.width,
			height: 570 * ratio,
			borderTopLeftRadius: 10,
			borderTopRightRadius: 10,
			marginBottom: 15
		},
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
		centeredView: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			marginTop: 22,
			backgroundColor: 'rgba(52, 52, 52, 0.8)'
		},
		openButton: {
			backgroundColor: "#F194FF",
			borderRadius: 20,
			padding: 10,
			elevation: 2
		},
		textStyle: {
			color: "white",
			fontWeight: "bold",
			textAlign: "center"
		},
		modalText: {
			marginBottom: 15,
			textAlign: "center"
		},
		onlineLabel: {
			position: "absolute",
			right: 10,
			top: 10,
			paddingHorizontal: 20,
			paddingVertical: 5,
			borderRadius: 10,
			backgroundColor: "#5C78FF",
			zIndex: 999
		},
        spinnerTextStyle: {
            color: '#000',
        },
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			loadEvents()
		});
	}, []);

	async function loadEvents() {
		let token = await AsyncStorage.getItem("@user_token")
		console.log("tcnm pfgh")
		const response = await fetch(apiUrl + '/user_events', {
			method: 'GET',
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
				"Authorization": token
			},
		})
		if (response.status == 200) {
			setCheckLoad(!checkLoad)
			const responseData = await response.json();
			setNews(responseData["collection"])
			setLoading(false)
		} else {
			console.log("!= 200")
		}
	}

	function renderEvents() {
		if (events.length != 0 && checkLoad) {
			return events.map(field => {
				return (
					<View key={field.title} style={styles.newsView}>
						<TouchableOpacity onPress={() => navigation.navigate("DetailMyEvents", { events: field, button: false })}>
							{field.online &&
								<View style={styles.onlineLabel}>
									<Text style={{ color: "#fff" }} bold>Онлайн</Text>
								</View>
							}
							<Image style={styles.newsImage} source={{ uri: field.image }} />
							<Text numberOfLines={2} style={{ fontSize: 20, paddingHorizontal: 10 }} bold>{field.title}</Text>
							<View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
								<Ionicons style={{ padding: 10 }} name="ios-calendar" size={20} color="gray" />
								<Text bold>{moment(field.date).format('DD MMM YYYY')} {field.time.slice(0, -3)}</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
								<Ionicons style={{ padding: 10 }} name="ios-locate" size={20} color="gray" />
								<Text bold>{field.place}</Text>
							</View>
							<Text numberOfLines={5} style={{ marginVertical: 10, paddingHorizontal: 10 }}>{field.description.replace(/&laquo;|&raquo;|&nbsp;|&ndash;|&uuml;/g, '')}</Text>
						</TouchableOpacity>
					</View>
				)
			})
		} else {
			return (
				<View style={{ height: win.height - 150, justifyContent: "center", alignItems: "center" }}>
					<Image resizeMode='contain' style={styles.authImage} source={require('../assets/Image/forgotPassImage.png')} />
					<Text>У вас еще нет событий</Text>
				</View>
			)
		}
	}

	return (
		<Layout navigation={navigation} title="Мои события">
			<ScrollView>
				<Spinner
					visible={loading}
					textContent={''}
					textStyle={styles.spinnerTextStyle}
				/>
				<View style={styles.container}>
					{renderEvents()}
				</View>
			</ScrollView>
		</Layout>
	);
}
