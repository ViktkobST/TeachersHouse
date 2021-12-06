import React, { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { StyleSheet, TouchableOpacity, View, ScrollView, Image, Modal } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { apiUrl, weatherApi } from '../constants/Urls'
import { Divider } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/ru'
import Hyperlink from 'react-native-hyperlink'
export default function ({ route, navigation }) {

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
        }
    });

    return (
        <Layout navigation={navigation} title="Просмотр новости" withBack>
            <ScrollView>
                <View style={styles.container}>
                    {route.params.news.image != "" &&
                        <Image source={{ uri: route.params.news.image }} style={styles.newsImage} />
                    }
                    <View style={styles.newsTitleView}>
                        <Text style={{ marginVertical: 5, color: "#999" }}>{"Опубликовано: " + moment(route.params.news.date).format('DD MMM YYYY')}</Text>
                        <Text style={{ fontSize: 20, color: "#000", textAlign: "left", marginVertical: 10 }} bold>{route.params.news.title}</Text>
                        <Hyperlink linkDefault={true} linkStyle={{ color: '#2980b9', fontSize: 15 }}>
                            <Text style={{ marginVertical: 5 }}>{route.params.news.description.replace(/&laquo;|&raquo;|&nbsp;|&ndash;|&uuml;/g, '')}</Text>
                        </Hyperlink>
                    </View>
                </View>
            </ScrollView>
        </Layout>
    );
}
