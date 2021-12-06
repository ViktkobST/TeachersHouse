import React, { useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Modal } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { apiUrl, weatherApi } from '../constants/Urls'
import { Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/ru'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hyperlink from 'react-native-hyperlink'
import Spinner from 'react-native-loading-spinner-overlay';

export default function ({ route, navigation }) {
    const [request, setRequest] = useState(false)
    const [loading, setLoading] = useState(false);
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
            shadowOpacity: 0.7,
            elevation: 3
        },
        newsImage: {
            width: win.width,
            height: 362 * ratio,
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
            shadowOpacity: 0.7,
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
        editButton: {
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
            marginVertical: 10,
            justifyContent: "center",
            alignItems: "center",
            padding: 15
        },
        editButtonText: {
            fontSize: 15,
            color: "#fff"
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
            color: '#fff',
        },
    });

    async function registerEvent() {
        setRequest(!request)
        setLoading(true)
        let token = await AsyncStorage.getItem("@user_token")
        let response = await fetch(apiUrl + '/user_events', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "id": route.params.events.id
            })
        })
        if (response.status == 200) {
            setRequest(!request)
            setLoading(false)
            Alert.alert(
                "Успешно",
                "Вы зарегистрировались на " + route.params.events.title,
                [
                    { text: "OK", onPress: () => navigation.goBack() }
                ],
                { cancelable: false }
            );
        } else {
            setRequest(!request)
            setLoading(false)
            Alert.alert(
                "Ошибка",
                "Что-то пошло не так попробуйте повторить позже",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <Layout navigation={route, navigation} title="Просмотр события" withBack>
            <ScrollView>
                <Spinner
                    visible={loading}
                    textContent={'Пожалуйста, подождите'}
                    textStyle={styles.spinnerTextStyle}
                />
                <View style={styles.container}>
                    {route.params.events.online &&
                        <View style={styles.onlineLabel}>
                            <Text style={{ color: "#fff" }} bold>Онлайн</Text>
                        </View>
                    }
                    <Image source={{ uri: route.params.events.image }} style={styles.newsImage} />
                    <View style={styles.newsTitleView}>
                        <Text style={{ fontSize: 20, color: "#000", textAlign: "left", marginVertical: 10 }} bold>{route.params.events.title}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: "center" }}>
                            <Ionicons style={{ paddingRight: 10 }} name="ios-calendar" size={20} color="gray" />
                            <Text bold>{moment(route.params.events.date).format('DD MMM YYYY')} {route.params.events.time.slice(0, -3)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: "flex-start", alignItems: "center", paddingVertical: 10 }}>
                            <Ionicons style={{ paddingRight: 10 }} name="ios-locate" size={20} color="gray" />
                            <Text bold>{route.params.events.place}</Text>
                        </View>
                        <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 15 }}>
                            <Text style={{ marginVertical: 5 }}>{route.params.events.description.replace(/&laquo;|&raquo;|&nbsp;|&ndash;|&uuml;/g, '')}</Text>
                        </Hyperlink>
                        {route.params.button &&
                            <TouchableOpacity style={styles.editButton} disabled={request} onPress={() => registerEvent()}>
                                <Text style={styles.editButtonText} bold>Зарегистрироваться на событие</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
}
