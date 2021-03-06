import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Image, TextInput, Alert } from 'react-native';
import Layout from '../components/global/Layout';
import Text from '../components/utils/UbuntuFont';
import { Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TextInputMask } from "react-native-masked-text";
import { apiUrl } from '../constants/Urls';

export default function ({ navigation }) {
    const [phone, onChangePhone] = useState('');
    const [password, onChangePassword] = useState('');
    const [confirmCode, onChangeCode] = useState('')
    const [successCode, onChangeSuccessCode] = useState(false)
    const [showPassword, onChangeShowPassword] = useState(true)
    const [userId, setUserId] = useState(0)

    const win = Dimensions.get('window');
    const ratio = win.width / 800;

    const styles = StyleSheet.create({
        forgotImage: {
            width: win.width,
            height: 570 * ratio,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            marginVertical: 15
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
            padding: 15,
            marginVertical: 10
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
            marginVertical: 5
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

    async function getCode() {
        let phoneRequest = phone.substring(2).replace(/[^-0-9]/gim, "")
        const response = await fetch(apiUrl + '/profile/reset_password_code', {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json",
            },
            body: JSON.stringify({
                "phone": phoneRequest
            })
        })
        if (response.status === 200) {
            const responseData = await response.json()
            setUserId(responseData.userId)
            onChangeSuccessCode(true)
        } else {
            Alert.alert(
                "????????????",
                "???????????????????????? ???? ????????????",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
    }

    async function forgotPassword() {
        let phoneRequest = phone.substring(2).replace(/[^-0-9]/gim, "")
        const response = await fetch(apiUrl + '/reset_password/' + userId, {
            method: "POST",
            headers: {
                "Accept": "Application/json",
                "Content-Type": "Application/json",
            },
            body: JSON.stringify({
                "phone": phoneRequest,
                "code": confirmCode,
                "password": password
            })
        })
        if (response.status === 200) {
            Alert.alert(
                "??????????????",
                "?????? ???????????? ?????????????? ??????????????",
                [
                    { text: "OK", onPress: () => navigation.goBack() }
                ],
                { cancelable: false }
            );
        } else {
            Alert.alert(
                "????????????",
                "?????? ???????????? ??????????????",
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
        }
    }

    return (
        <Layout navigation={navigation} title="?????????????????????????? ????????????" withBack>
            <ScrollView>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Image resizeMode='contain' style={styles.forgotImage} source={require('../assets/Image/forgotPassImage.png')} />
                    <View style={styles.textInputView}>
                        <Ionicons style={{ padding: 10 }} name="ios-call" size={20} color="#5C78FF" />
                        <TextInputMask
                            type={"custom"}
                            options={{
                                mask: "+7 (999) 999 99 99"
                            }}
                            keyboardType="number-pad"
                            value={phone}
                            onChangeText={text => onChangePhone(text)}
                            placeholder="?????????????? ?????? ?????????? ????????????????"
                        />
                    </View>
                    <TouchableOpacity style={styles.authButton} onPress={() => getCode()}>
                        <Text style={styles.authButtonText} bold>???????????????? ?????? ??????????????????????????</Text>
                    </TouchableOpacity>
                    {successCode &&
                        <View>
                            <View style={styles.textInputView}>
                                <Ionicons style={{ padding: 10 }} name="ios-lock" size={24} color="#5C78FF" />
                                <TextInput
                                    style={{ padding: 5, height: 40, width: win.width - 110 }}
                                    onChangeText={text => onChangeCode(text)}
                                    placeholder="?????????????? ?????? ????????????????????????"
                                    value={confirmCode}
                                />
                            </View>
                            <View style={styles.textInputView}>
                                <Ionicons style={{ padding: 10 }} name="ios-key" size={24} color="#5C78FF" />
                                <TextInput
                                    style={{ padding: 5, height: 40, width: win.width - 110 }}
                                    onChangeText={text => onChangePassword(text)}
                                    placeholder="?????????????? ????????????"
                                    value={password}
                                    secureTextEntry={showPassword}
                                />
                                <TouchableOpacity onPress={() => onChangeShowPassword(prevCheck => !prevCheck)}>
                                    <Ionicons style={{ padding: 10 }} name={showPassword ? "ios-eye" : "ios-eye-off"} size={24} color="#5C78FF" />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ color: "#999", paddingHorizontal: 10, paddingBottom: 10 }}>???? ?????????? 6-?? ????????????????</Text>
                            <TouchableOpacity style={styles.authButton} onPress={() => forgotPassword()}>
                                <Text style={styles.authButtonText} bold>???????????????? ????????????</Text>
                            </TouchableOpacity>
                        </View>
                    }
                </View>
            </ScrollView>
        </Layout>
    );
}
