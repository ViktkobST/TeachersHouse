import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Alert } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from '../constants/Urls';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputMask } from "react-native-masked-text";

export default function ({ navigation }) {
	const [phone, onChangePhone] = useState('');
	const [password, onChangePassword] = useState('');
	const [showPassword, onChangeShowPassword] = useState(true)

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
		authButton: {
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
		authButtonText: {
			fontSize: 15,
			color: "#fff"
		},
		textInputView: {
			flexDirection: "row",
			width: win.width - 20,
			borderRadius: 20,
			borderWidth: 1,
			borderColor: "#DEE3FF",
			marginVertical: 10
		},
		registerView: {
			padding: 20,
			justifyContent: "center",
			alignItems: "center"
		},
		registerText: {
			fontSize: 15,
			color: "gray"
		},
		registerButton: {
			marginVertical: 10
		}
	});

	async function authUser() {
		let phoneRequest = phone.substring(2).replace(/[^-0-9]/gim, "")
		const response = await fetch(apiUrl + '/auth', {
			method: "POST",
			headers: {
				"Accept": "Application/json",
				"Content-Type": "Application/json",
			},
			body: JSON.stringify({
				"phone": phoneRequest,
				"password": password
			})
		})
		if (response.status === 200) {
			const responseData = await response.json();
			await AsyncStorage.setItem("@user_token", responseData.token_type + " " + responseData.token)
			navigation.navigate("MainTabs")
		} else {
			Alert.alert(
				"Ошибка",
				"Пароль введен неверно или учетной записи не существует",
				[
					{ text: "OK", onPress: () => console.log("OK Pressed") }
				],
				{ cancelable: false }
			);
		}

	}

	return (
		<Layout navigation={navigation} title="Авторизация">
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<Image resizeMode='contain' style={styles.authImage} source={require('../assets/Image/authImage.png')} />
				<View style={styles.textInputView}>
					<Ionicons style={{ padding: 10 }} name="ios-call" size={20} color="#5C78FF" />
					<TextInputMask
						type={"custom"}
						options={{
							mask: "+7 (999) 999 99 99"
						}}
						keyboardType="number-pad"
						value={phone}
						onChangeText={(extracted) => {
							onChangePhone(extracted)
						}
						}
						placeholder="Введите ваш номер телефона"
					/>
				</View>
				<View style={styles.textInputView}>
					<Ionicons style={{ padding: 10 }} name="ios-key" size={24} color="#5C78FF" />
					<TextInput
						style={{ padding: 5, height: 40, width: win.width - 110 }}
						onChangeText={text => onChangePassword(text)}
						placeholder="Введите пароль"
						value={password}
						secureTextEntry={showPassword}
					/>
					<TouchableOpacity onPress={() => onChangeShowPassword(prevCheck => !prevCheck)}>
						<Ionicons style={{ padding: 10 }} name={showPassword ? "ios-eye" : "ios-eye-off"} size={24} color="#5C78FF" />
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={styles.authButton} onPress={authUser}>
					<Text style={styles.authButtonText} bold>Войти</Text>
				</TouchableOpacity>
				<View style={styles.registerView}>
					<TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('ForgotPasswordScreen')}>
						<Text style={styles.registerText}>Забыли пароль?</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('RegisterScreen')}>
						<Text style={styles.registerText}>Создать учетную запись</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Layout>
	);
}
