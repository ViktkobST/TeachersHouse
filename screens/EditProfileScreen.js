import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TextInput, Alert } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from '../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from "react-native-masked-text";
export default function ({ navigation }) {
    const [name, onChangeName] = useState('');
    const [position, onChangePosition] = useState('');
    const [experience, onChangeExperience] = useState('');
    const [institution, onChangeInstitution] = useState('');
    const [phone, onChangePhone] = useState('');
    const [email, onChangeEmail] = useState('');

    useEffect(() => {
        if (name == "") {
            getProfileData()
        }
	})

    const win = Dimensions.get('window');
    const ratio = win.width / 800;

    const styles = StyleSheet.create({
        editProfileImage: {
            width: win.width,
            height: 570 * ratio,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginBottom: 15,
            padding: 10
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
        textInputView: {
            flexDirection: "row",
            width: win.width - 20,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#DEE3FF",
            marginVertical: 5
        }
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
            onChangeName(responseData.name)
            onChangePhone("+7" + responseData.phone)
            onChangePosition(responseData.position)
            onChangeExperience(responseData.experience)
            onChangeInstitution(responseData.institution)
            onChangeEmail(responseData.email)
		}
	}

    async function editProfile() {
        let phoneRequest = phone.substring(2).replace(/[^-0-9]/gim, "")
        let token = await AsyncStorage.getItem("@user_token")
        const response = await fetch(apiUrl + '/profile', {
            method: "PUT",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                "institution": institution,
                "name": name,
                "experience": experience,
                "email": email,
                "position": position
            })
        })
        if (response.status === 200) {
            navigation.navigate("MainTabs")
        } else {
            Alert.alert(
                "Ошибка",
                "Что-то пошло не так. Обратите внимание, все поля обязательны",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }

    }

    return (
        <Layout navigation={navigation} title="Редактирование профиля">
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image resizeMode='contain' style={styles.editProfileImage} source={require('../assets/Image/ProfileScreen.png')} />
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-person" size={20} color="#5C78FF" />
                        <TextInput
                            style={{ padding: 5, height: 40, width: win.width - 70 }}
                            onChangeText={text => onChangeName(text)}
                            placeholder="Фамилия Имя отчество"
                            value={name}
                        />
                    </View>
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-archive" size={20} color="#5C78FF" />
                        <TextInput
                            style={{ padding: 5, height: 40, width: win.width - 70 }}
                            onChangeText={text => onChangePosition(text)}
                            placeholder="Должность"
                            value={position}
                        />
                    </View>
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-time" size={20} color="#5C78FF" />
                        <TextInput
                            style={{ padding: 5, height: 40, width: win.width - 70 }}
                            onChangeText={text => onChangeExperience(text)}
                            placeholder="Педагогический стаж"
                            value={experience}
                        />
                    </View>
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-business" size={20} color="#5C78FF" />
                        <TextInput
                            style={{ padding: 5, height: 40, width: win.width - 70 }}
                            onChangeText={text => onChangeInstitution(text)}
                            placeholder="Образовательное учреждение"
                            value={institution}
                        />
                    </View>
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-at" size={20} color="#5C78FF" />
                        <TextInput
                            style={{ padding: 5, height: 40, width: win.width - 70 }}
                            onChangeText={text => onChangeEmail(text)}
                            placeholder="Email"
                            value={email}
                        />
                    </View>
                    <TouchableOpacity style={styles.editButton} onPress={() => editProfile()}>
                        <Text style={styles.editButtonText} bold>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Layout >
    );
}
