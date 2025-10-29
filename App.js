// App.js
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- Screens ---
// (ตรวจสอบว่า Import ถูกต้องทั้งหมด)
import BookingConfirmationScreen from './screens/BookingConfirmationScreen';
import DrawerContent from './screens/DrawerContent'; // Custom drawer content
import FlightResultsScreen from './screens/FlightResultsScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MyBookingsScreen from './screens/MyBookingsScreen';
import SeatMapScreen from './screens/SeatMapScreen';
import SignUpScreen from './screens/SignUpScreen';

// --- สร้าง Navigators ---
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// --- Stack Navigator (สำหรับหน้าภายใน Drawer) ---
function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* ใช้ MainHome เพื่อไม่ให้ซ้ำกับชื่อ Drawer */}
      <Stack.Screen name="MainHome" component={HomeScreen} />
      <Stack.Screen name="FlightResultsScreen" component={FlightResultsScreen} />
      <Stack.Screen name="SeatMapScreen" component={SeatMapScreen} />
      <Stack.Screen name="BookingConfirmationScreen" component={BookingConfirmationScreen} />
      {/* หากต้องการให้กดดูรายละเอียดการจองจาก MyBookings ก็เพิ่ม Stack ที่นี่ได้ */}
    </Stack.Navigator>
  );
}

// --- Drawer Navigator หลัก ---
function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      // ใช้ Drawer Content ที่สร้างเอง
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
          headerShown: false, // ซ่อน Header ของ Drawer
          drawerStyle: {
              width: 280, // ปรับความกว้างเมนู
          }
      }}
    >
      {/* หน้าหลักใน Drawer (ใช้ Stack ด้านบน) */}
      <Drawer.Screen name="HomeStack" component={HomeStackNavigator} options={{ title: 'หน้าหลัก' }}/>
      {/* เพิ่ม My Bookings เข้าเมนู */}
      <Drawer.Screen name="MyBookings" component={MyBookingsScreen} options={{ title: 'รายการที่จอง' }}/>
      {/* เพิ่มเมนูอื่นๆ ที่นี่ */}
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} options={{ title: 'โปรไฟล์' }} /> */}
    </Drawer.Navigator>
  );
}

// --- Root App Component ---
export default function App() {
  return (
    <NavigationContainer>
      {/* Stack หลัก: Login/SignUp -> AppDrawer */}
      <Stack.Navigator
        initialRouteName="Login" // เริ่มต้นที่หน้า Login
        screenOptions={{ headerShown: false }}
      >
        {/* หน้า Login/SignUp อยู่นอก Drawer */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        {/* เมื่อ Login สำเร็จ ให้ navigate('AppDrawer') */}
        <Stack.Screen name="AppDrawer" component={AppDrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}