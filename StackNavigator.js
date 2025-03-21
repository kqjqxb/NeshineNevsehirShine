import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { UserProvider, UserContext } from './src/context/UserContext';
import { Provider, useDispatch } from 'react-redux';
import store from './src/redux/store';
import { loadUserData } from './src/redux/userSlice';
import LoadingNeshineScreen from './src/screens/LoadingNeshineScreen';


const Stack = createNativeStackNavigator();

const NeshineStack = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <UserProvider>
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
        </UserProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isNeshineOnboardNevWasVisible, setIsNeshineOnboardNevWasVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);

  const [initializingNeshineNevsehirApp, setInitializingNeshineNevsehirApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadNeshineNevsehirUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedNeshineNevsehirUser = await AsyncStorage.getItem(storageKey);
        const isNeshineNevsehirOnboardingVisible = await AsyncStorage.getItem('isNeshineNevsehirOnboardingVisible');

        if (storedNeshineNevsehirUser) {
          setUser(JSON.parse(storedNeshineNevsehirUser));
          setIsNeshineOnboardNevWasVisible(false);
        } else if (isNeshineNevsehirOnboardingVisible) {
          setIsNeshineOnboardNevWasVisible(false);
        } else {
          setIsNeshineOnboardNevWasVisible(true);
          await AsyncStorage.setItem('isNeshineNevsehirOnboardingVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of neshine user', error);
      } finally {
        setInitializingNeshineNevsehirApp(false);
      }
    };
    loadNeshineNevsehirUser();
  }, [setUser]);

  if (initializingNeshineNevsehirApp) {
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#2F2E31',
      }}>
        <ActivityIndicator size="large" color="#CCA65A" />
      </View>
    );
  }

  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName={isNeshineOnboardNevWasVisible ? 'OnboardingScreen' : 'Home'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingNeshineApp" component={LoadingNeshineScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default NeshineStack;
