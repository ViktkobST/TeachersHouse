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
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Spinner from 'react-native-loading-spinner-overlay';

export default function ({ route, navigation }) {
	const [events, setNews] = useState([])
	const [checkLoad, setCheckLoad] = useState(false)
	const [filteredEvents, setFilteredEvents] = useState(new Array(0))
	const [isDateFromPickerVisible, setDateFromPickerVisibility] = useState(false);
	const [dateFrom, setDateFrom] = useState(moment(todayDate).format('DD MMM YYYY'))
	const [isDateToPickerVisible, setDateToPickerVisibility] = useState(false);
	const [dateTo, setDateTo] = useState(moment(todayDate).add(1, 'M').format('DD MMM YYYY'))
	const [dateFromFilter, setDateFromFilter] = useState(moment(todayDate).format('yyyy-MM-DD'))
	const [dateToFilter, setDateToFilter] = useState(moment(todayDate).add(1, 'M').format('yyyy-MM-DD'))
	const [loading, setLoading] = useState(true);

	let todayDate = Date()

	const win = Dimensions.get('window');
	const ratio = win.width / 800;
	const useMountEffect = (fun) => useEffect(fun, [])
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
		authButton: {
			backgroundColor: "#FFB822",
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
		authButtonText: {
			fontSize: 15,
			color: "#fff"
		},
		spinnerTextStyle: {
			color: '#000',
		},
		calendarButton: {
			backgroundColor: "#FFB822",
			width: 70,
			height: 70,
			borderRadius: 35,
			shadowColor: "#3E49A0",
			shadowOpacity: 0.1,
			shadowOffset: {
				width: 0,
				height: 5
			},
			shadowRadius: 0.1,
			elevation: 4,
			justifyContent: "center",
			alignItems: "center"
		}
	});

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			loadEvents()
		});
	}, [])

	async function loadEvents() {
		let token = await AsyncStorage.getItem("@user_token")
		console.log("Есть запрос")
		const response = await fetch(apiUrl + '/events', {
			method: 'GET',
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
				"Authorization": token
			},
		})
		if (response.status == 200) {
			const responseData = await response.json();
			setCheckLoad(true)
			setNews(responseData)
			setFilteredEvents(responseData)
			setLoading(false)
		}

	}

	const showDateFromPicker = () => {
		setDateFromPickerVisibility(true);
	};

	const hideDateFromPicker = () => {
		setDateFromPickerVisibility(false);
	};

	const handleConfirmDateFrom = (date) => {
		setDateFrom(moment(date).format('DD MMM YYYY'))
		setDateFromFilter(moment(date).format('yyyy-MM-DD'))
		hideDateFromPicker();
	};

	const showDateToPicker = () => {
		setDateToPickerVisibility(true);
	};

	const hideDateToPicker = () => {
		setDateToPickerVisibility(false);
	};

	const handleConfirmDateTo = (date) => {
		setDateTo(moment(date).format('DD MMM YYYY'))
		setDateToFilter(moment(date).format('yyyy-MM-DD'))
		hideDateToPicker();
	};

	function filterEvents() {
		var dateToDate = new Date(dateToFilter)
		var dateFromDate = new Date(dateFromFilter)
		var filteredData = events.filter(function (a) {
			var eventDateStr = moment(a.date).format("yyyy-MM-DD")
			var eventDate = new Date(eventDateStr)
			return eventDate >= dateFromDate && eventDate <= dateToDate;
		})
		setFilteredEvents(filteredData)
	}

	function renderEvents() {
		if (filteredEvents.length != 0) {
			filteredEvents.sort(function (a, b) {
				var aDate = new Date(a.date); var bDate = new Date(b.date)
				return bDate - aDate
			});
			return filteredEvents.map(field => {
				if (!field.register) {
					return (
						<View key={field.id} style={styles.newsView}>
							<TouchableOpacity onPress={() => navigation.navigate("DetailEvents", { events: field, button: field.register ? false : true })}>
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
				}
			})
		} else {
			return (
				<View style={{ justifyContent: "center", alignItems: "center", height: win.height - 250, width: win.width, padding: 20 }}>
					<Text style={{ textAlign: "center" }}>Мы не нашли мероприятий по вашим параметрам, попробуйте изменить даты</Text>
				</View>
			)
		}
	}

	return (
		<Layout navigation={navigation} title="События">
			<View style={{position:'absolute', width: 70, height: 70, bottom: 10, right: 10, alignSelf: 'flex-end', zIndex: 999}}>
			<TouchableOpacity style={styles.calendarButton} onPress={() => navigation.navigate("EventCalendar")}>
				<Ionicons style={{ padding: 10 }} name="ios-calendar" size={40} color="white" />
			</TouchableOpacity>
			</View>
			<ScrollView>
				<Spinner
					visible={loading}
					textContent={''}
					textStyle={styles.spinnerTextStyle}
				/>
				<View style={styles.container}>

					<View style={{ justifyContent: "center", alignItems: "flex-start", width: win.width, padding: 10 }}>
						<Text style={{ textAlign: "left", fontSize: 20, color: "gray" }} bold>Период событий</Text>
						<View style={{ flexDirection: "row", flex: 1 }}>
							<View style={{ flexDirection: "row", justifyContent: "flex-start", alignItems: "center", flex: 0.5 }}>
								<Ionicons style={{ padding: 10 }} name="ios-calendar" size={20} color="gray" />
								<TouchableOpacity onPress={showDateFromPicker}>
									<Text style={{ fontSize: 15 }} bold>{dateFrom}</Text>
								</TouchableOpacity>
								<DateTimePickerModal
									isVisible={isDateFromPickerVisible}
									mode="date"
									onConfirm={handleConfirmDateFrom}
									onCancel={hideDateFromPicker}
								/>
							</View>
							<View style={{ flexDirection: "row", justifyContent: "flex-end", alignItems: "center", flex: 0.5 }}>
								<Ionicons style={{ padding: 10 }} name="ios-calendar" size={20} color="gray" />
								<TouchableOpacity onPress={showDateToPicker}>
									<Text style={{ fontSize: 15 }} bold>{dateTo}</Text>
								</TouchableOpacity>
								<DateTimePickerModal
									isVisible={isDateToPickerVisible}
									mode="date"
									onConfirm={handleConfirmDateTo}
									onCancel={hideDateToPicker}
								/>
							</View>
						</View>
						<TouchableOpacity style={styles.authButton} onPress={() => filterEvents()}>
							<Text style={styles.authButtonText}>Применить фильтр</Text>
						</TouchableOpacity>
					</View>
					{renderEvents()}
				</View>
			</ScrollView>
		</Layout>
	);
}
