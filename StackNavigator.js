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
import LoadingCulinaryCrovvnScreen from './src/screens/LoadingCulinaryCrovvnScreen';


const Stack = createNativeStackNavigator();

const CulinaryCrovvnStack = () => {
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
  const [isCulinaryOnboardWasVisible, setIsCulinaryOnboardWasVisible] = useState(false);
  const { user, setUser } = useContext(UserContext);


  const [initializingCulinaryMelbourneApp, setInitializingCulinaryMelbourneApp] = useState(true);

  useEffect(() => {
    dispatch(loadUserData());
  }, [dispatch]);

  useEffect(() => {
    const loadCulinaryMelbourneUser = async () => {
      try {
        const deviceId = await DeviceInfo.getUniqueId();
        const storageKey = `currentUser_${deviceId}`;
        const storedCulinaryMelbourneUser = await AsyncStorage.getItem(storageKey);
        const isCulinaryMelbourneOnboardingVisible = await AsyncStorage.getItem('isCulinaryMelbourneOnboardingVisible');

        if (storedCulinaryMelbourneUser) {
          setUser(JSON.parse(storedCulinaryMelbourneUser));
          setIsCulinaryOnboardWasVisible(false);
        } else if (isCulinaryMelbourneOnboardingVisible) {
          setIsCulinaryOnboardWasVisible(false);
        } else {
          setIsCulinaryOnboardWasVisible(true);
          await AsyncStorage.setItem('isCulinaryMelbourneOnboardingVisible', 'true');
        }
      } catch (error) {
        console.error('Error loading of melbourne user', error);
      } finally {
        setInitializingCulinaryMelbourneApp(false);
      }
    };
    loadCulinaryMelbourneUser();
  }, [setUser]);

  if (initializingCulinaryMelbourneApp) {
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
        <Stack.Navigator initialRouteName={isCulinaryOnboardWasVisible ? 'OnboardingScreen' : 'OnboardingScreen'}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="LoadingCulinaryCrovnApp" component={LoadingCulinaryCrovvnScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};


export default CulinaryCrovvnStack;
