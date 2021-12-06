import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Colors from '../constants/colors';
import TabBarIcon from '../components/utils/TabBarIcon';
import TabBarText from '../components/utils/TabBarText';
import Home from '../screens/Home';
import WelcomeScreen from '../screens/WelcomeScreen';
import EventsScreen from '../screens/EventsScreen';
import MyEventsScreen from '../screens/MyEventsScreen';
import Profile from '../screens/Profile';
import AuthScreen from '../screens/AuthScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import RegisterScreen from '../screens/RegisterScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import DetailNews from '../screens/DetailNews';
import DetailEvents from '../screens/DetailEvents';
import EventCalendar from '../screens/EventCalendar';

const MainStack = createStackNavigator();
const Main = () => {
	return (
		<MainStack.Navigator
			screenOptions={{
				headerMode: 'none',
				headerShown: false,
			}}
		>
			<MainStack.Screen name="MainTabs" component={MainTabs} />
		</MainStack.Navigator>
	);
};

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
	return (
		<Tabs.Navigator
			tabBarOptions={{
				tabStyle: { borderTopWidth: 0 },
				style: { borderTopWidth: 1, borderColor: '#c0c0c0' },
				activeTintColor: Colors.primary,
			}}
		>
			<Tabs.Screen
				name="Home"
				component={News}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Главная" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'ios-bookmark'} />
					),
				}}
			/>
			<Tabs.Screen
				name="Events"
				component={Events}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="События" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'ios-folder'} />
					),
				}}
			/>
			<Tabs.Screen
				name="MyEvents"
				component={MyEvents}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Мои события" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'ios-heart'} />
					),
				}}
			/>
			<Tabs.Screen
				name="Profile"
				component={Profile}
				options={{
					tabBarLabel: ({ focused }) => (
						<TabBarText focused={focused} title="Профиль" />
					),
					tabBarIcon: ({ focused }) => (
						<TabBarIcon focused={focused} icon={'ios-contact'} />
					),
				}}
			/>
		</Tabs.Navigator>
	);
};

const NewsStack = createStackNavigator();
const News = () => {
	return (
		<NewsStack.Navigator
			screenOptions={{
				headerMode: 'none',
				headerShown: false,
			}}
		>
			<NewsStack.Screen name="Home" component={Home} />
			<NewsStack.Screen name="DetailNews" component={DetailNews} />
		</NewsStack.Navigator>
	);
};

const EventStack = createStackNavigator();
const Events = () => {
	return (
		<EventStack.Navigator
			screenOptions={{
				headerMode: 'none',
				headerShown: false,
			}}
		>
			<EventStack.Screen name="EventsScreen" component={EventsScreen} />
			<EventStack.Screen name="DetailEvents" component={DetailEvents} />
			<EventStack.Screen name="EventCalendar" component={EventCalendar} />
		</EventStack.Navigator>
	)
}

const MyEventStack = createStackNavigator();
const MyEvents = () => {
	return (
		<EventStack.Navigator
			screenOptions={{
				headerMode: 'none',
				headerShown: false,
			}}
		>
			<EventStack.Screen name="MyEventsScreen" component={MyEventsScreen} />
			<EventStack.Screen name="DetailMyEvents" component={DetailEvents} />
		</EventStack.Navigator>
	)
}

const RootStack = createStackNavigator();

export default () => {
	return (
		<NavigationContainer>
			<RootStack.Navigator headerMode="none">
				<RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
				<RootStack.Screen name="AuthScreen" component={AuthScreen} />
				<RootStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
				<RootStack.Screen name="RegisterScreen" component={RegisterScreen} />
				<RootStack.Screen name="EditProfileScreen" component={EditProfileScreen} />
				<RootStack.Screen name="MainTabs" component={MainTabs} />
			</RootStack.Navigator>
		</NavigationContainer>
	);
};
