import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, View, ScrollView, Alert, TouchableOpacity, Text } from 'react-native';
import Layout from '../components/global/Layout';
import { apiUrl } from '../constants/Urls'
import 'moment/locale/ru'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { Agenda } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';

export default function ({ route, navigation }) {
    const [events, setEvents] = useState([])
    const [notEditEvents, setNotEventsEdit] = useState([])
    const [loading, setLoading] = useState(true);
    const [minDate, setMinDate] = useState("")
    const [maxDate, setMaxDate] = useState("")

    const win = Dimensions.get('window');

    let todayDate = Date()

    LocaleConfig.locales['ru'] = {
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентября', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сент.', 'Окт.', 'Ноябрь.', 'Дек.'],
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.'],
        today: 'Сегодня\'Сегодня'
    };
    LocaleConfig.defaultLocale = 'ru';

    const styles = StyleSheet.create({
        spinnerTextStyle: {
            color: '#000',
        },
        item: {
            backgroundColor: 'white',
            flex: 1,
            borderRadius: 5,
            padding: 10,
            marginRight: 10,
            marginTop: 17
        },
        emptyDate: {
            height: 15,
            flex: 1,
            paddingTop: 30
        }
    });

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadEvents()
        });
    })

    async function loadEvents() {
        let token = await AsyncStorage.getItem("@user_token")
        const response = await fetch(apiUrl + '/events', {
            method: 'GET',
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json",
                "Authorization": token
            },
        })
        console.log(response.status)
        if (response.status == 200) {
            const responseData = await response.json();
            const eventsCalendar = {}
            for (let i = 1; i < responseData.length; i++) {
                eventsCalendar[responseData[i].date] = []
                for (let index = 1; index < responseData.length; index++) {
                    if (responseData[index].date === responseData[i].date) {
                        let item = {
                            "name": responseData[index].title
                        }
                        eventsCalendar[responseData[i].date].push(item)
                    }
                }
            }
            responseData.sort(function (a, b) {
                var aDate = new Date(b.date); var bDate = new Date(a.date)
                return bDate - aDate
            });
            setMinDate(responseData[0].date)
            setMaxDate(responseData[responseData.length - 1].date)
            setNotEventsEdit(responseData)
            setEvents(eventsCalendar)
            setLoading(false)
        }
    }

    function loadItems(day) {
        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);
                if (!events[strTime]) {
                    events[strTime] = [];
                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        events[strTime].push({
                            name: strTime,
                            height: Math.max(50, Math.floor(Math.random() * 150))
                        });
                    }
                }
            }
            const newItems = {};
            Object.keys(events).forEach(key => {
                newItems[key] = events[key];
            });
            setEvents(newItems)
        }, 1000);
    }

    function renderItem(item) {
        var filteredData = notEditEvents.filter(function (a) {
			return a.title == item.name;
		})
        console.log(filteredData)
        return (
            <TouchableOpacity
                testID="agenda"
                style={[styles.item, { height: item.height }]}
                onPress={() => navigation.navigate("DetailEvents", { events: filteredData[0], button: filteredData.register ? false : true })}
            >
                <Text>{item.name}</Text>
            </TouchableOpacity>
        );
    }

    function renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }

    function rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    function timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    function renderEvents() {
        if (events.length != 0) {
            return (
                <Agenda
                    testID='agenda'
                    items={events}
                    minDate={minDate}
                    maxDate={maxDate}
                    selected={minDate}
                    renderItem={renderItem.bind(this)}
                    renderEmptyDate={renderEmptyDate.bind(this)}
                    rowHasChanged={rowHasChanged.bind(this)}
                    renderEmptyData={(day, item) => {
                        return (
                            <View style={{flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20}}>
                                <Text style={{ textAlign: "center" }}>Нет событий на выбранную вами дату, попробуйте выбрать другую дату в календаре выше</Text>
                            </View>
                        );
                    }}
                />
            )
        }
    }

    return (
        <Layout navigation={navigation} title="Календарь событий" withBack>
            <Spinner
                visible={loading}
                textContent={''}
                textStyle={styles.spinnerTextStyle}
            />
            {renderEvents()}
        </Layout>
    );
}
