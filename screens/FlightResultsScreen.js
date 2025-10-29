// screens/FlightResultsScreen.js
import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- ข้อมูลจำลองสำหรับรายการเที่ยวบิน (ยังคงอยู่) ---
const FLIGHTS_DATA = [
  { id: 'f1', airline: 'Thai Smile', logo: require('../assets/images/indigo-logo.png'), from: 'BKK', fromTime: '08:00', to: 'CNX', toTime: '09:15', duration: '01h 15m', price: '1,950', perks: 'Free Snack', promo: '' },
  { id: 'f2', airline: 'AirAsia', logo: require('../assets/images/vistara-logo.png'), from: 'BKK', fromTime: '10:30', to: 'CNX', toTime: '11:45', duration: '01h 15m', price: '1,790', perks: '', promo: 'Low fare' },
  // BKK -> HKT
  { id: 'f3', airline: 'Bangkok Airways', logo: require('../assets/images/indigo-logo.png'), from: 'BKK', fromTime: '09:00', to: 'HKT', toTime: '10:20', duration: '01h 20m', price: '2,900', perks: 'Lounge Access', promo: '' },
  { id: 'f4', airline: 'Thai Vietjet', logo: require('../assets/images/vistara-logo.png'), from: 'BKK', fromTime: '14:00', to: 'HKT', toTime: '15:20', duration: '01h 20m', price: '1,850', perks: '', promo: 'Book now!' },
  // BKK -> KKC
  { id: 'f5', airline: 'Thai Smile', logo: require('../assets/images/indigo-logo.png'), from: 'BKK', fromTime: '11:00', to: 'KKC', toTime: '12:00', duration: '01h 00m', price: '1,400', perks: 'Free Snack', promo: '' },
  // BKK -> HDY
  { id: 'f6', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'BKK', fromTime: '16:00', to: 'HDY', toTime: '17:25', duration: '01h 25m', price: '1,650', perks: '', promo: '' },
  // DMK -> CNX
  { id: 'f7', airline: 'Nok Air', logo: require('../assets/images/indigo-logo.png'), from: 'DMK', fromTime: '07:30', to: 'CNX', toTime: '08:40', duration: '01h 10m', price: '1,600', perks: 'Free Water', promo: '' },
  { id: 'f8', airline: 'Thai Lion Air', logo: require('../assets/images/vistara-logo.png'), from: 'DMK', fromTime: '13:00', to: 'CNX', toTime: '14:10', duration: '01h 10m', price: '1,550', perks: '', promo: 'Hot Deal' },
  // DMK -> HKT
  { id: 'f9', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'DMK', fromTime: '10:00', to: 'HKT', toTime: '11:20', duration: '01h 20m', price: '1,900', perks: '', promo: '' },
  // DMK -> UBP
  { id: 'f10', airline: 'Nok Air', logo: require('../assets/images/indigo-logo.png'), from: 'DMK', fromTime: '15:00', to: 'UBP', toTime: '16:00', duration: '01h 00m', price: '1,350', perks: 'Free Water', promo: 'Fly Sabai' },
  // DMK -> CEI
  { id: 'f11', airline: 'Thai Lion Air', logo: require('../assets/images/indigo-logo.png'), from: 'DMK', fromTime: '09:30', to: 'CEI', toTime: '10:45', duration: '01h 15m', price: '1,700', perks: '', promo: '' },

  // --- จาก เชียงใหม่ (CNX) ---
  // CNX -> BKK
  { id: 'f12', airline: 'Thai Smile', logo: require('../assets/images/indigo-logo.png'), from: 'CNX', fromTime: '10:00', to: 'BKK', toTime: '11:15', duration: '01h 15m', price: '1,990', perks: 'Free Snack', promo: '' },
  { id: 'f13', airline: 'AirAsia', logo: require('../assets/images/vistara-logo.png'), from: 'CNX', fromTime: '18:00', to: 'BKK', toTime: '19:15', duration: '01h 15m', price: '1,820', perks: '', promo: '' },
  // CNX -> DMK
  { id: 'f14', airline: 'Nok Air', logo: require('../assets/images/indigo-logo.png'), from: 'CNX', fromTime: '12:00', to: 'DMK', toTime: '13:10', duration: '01h 10m', price: '1,580', perks: 'Free Water', promo: '' },
  { id: 'f15', airline: 'Thai Lion Air', logo: require('../assets/images/vistara-logo.png'), from: 'CNX', fromTime: '16:30', to: 'DMK', toTime: '17:40', duration: '01h 10m', price: '1,520', perks: '', promo: '' },
  // CNX -> HKT
  { id: 'f16', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'CNX', fromTime: '14:00', to: 'HKT', toTime: '16:00', duration: '02h 00m', price: '2,550', perks: '', promo: 'Fly Direct' },
  // CNX -> KKC
  { id: 'f17', airline: 'AirAsia', logo: require('../assets/images/vistara-logo.png'), from: 'CNX', fromTime: '09:00', to: 'KKC', toTime: '10:10', duration: '01h 10m', price: '1,900', perks: '', promo: '' },

  // --- จาก ภูเก็ต (HKT) ---
  // HKT -> BKK
  { id: 'f18', airline: 'Bangkok Airways', logo: require('../assets/images/indigo-logo.png'), from: 'HKT', fromTime: '11:30', to: 'BKK', toTime: '12:50', duration: '01h 20m', price: '3,100', perks: 'Lounge Access', promo: '' },
  { id: 'f19', airline: 'Thai Vietjet', logo: require('../assets/images/vistara-logo.png'), from: 'HKT', fromTime: '17:00', to: 'BKK', toTime: '18:20', duration: '01h 20m', price: '1,980', perks: '', promo: '' },
  // HKT -> DMK
  { id: 'f20', airline: 'Thai Lion Air', logo: require('../assets/images/indigo-logo.png'), from: 'HKT', fromTime: '08:00', to: 'DMK', toTime: '09:20', duration: '01h 20m', price: '1,880', perks: '', promo: '' },
  // HKT -> CNX
  { id: 'f21', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'HKT', fromTime: '19:00', to: 'CNX', toTime: '21:00', duration: '02h 00m', price: '2,650', perks: '', promo: '' },
  // HKT -> UTH
  { id: 'f22', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'HKT', fromTime: '13:30', to: 'UTH', toTime: '15:15', duration: '01h 45m', price: '2,400', perks: '', promo: '' },

  // --- จาก ขอนแก่น (KKC) ---
  // KKC -> BKK
  { id: 'f23', airline: 'Thai Smile', logo: require('../assets/images/indigo-logo.png'), from: 'KKC', fromTime: '13:00', to: 'BKK', toTime: '14:00', duration: '01h 00m', price: '1,450', perks: 'Free Snack', promo: '' },
  // KKC -> CNX
  { id: 'f24', airline: 'AirAsia', logo: require('../assets/images/vistara-logo.png'), from: 'KKC', fromTime: '11:00', to: 'CNX', toTime: '12:10', duration: '01h 10m', price: '1,950', perks: '', promo: '' },

  // --- จาก หาดใหญ่ (HDY) ---
  // HDY -> BKK
  { id: 'f25', airline: 'Nok Air', logo: require('../assets/images/indigo-logo.png'), from: 'HDY', fromTime: '10:00', to: 'BKK', toTime: '11:25', duration: '01h 25m', price: '1,700', perks: 'Free Water', promo: '' },
  // HDY -> CNX
  { id: 'f26', airline: 'Thai Vietjet', logo: require('../assets/images/vistara-logo.png'), from: 'HDY', fromTime: '14:00', to: 'CNX', toTime: '15:50', duration: '01h 50m', price: '2,300', perks: '', promo: '' },

  // --- จาก เชียงราย (CEI) ---
  // CEI -> DMK
  { id: 'f27', airline: 'AirAsia', logo: require('../assets/images/indigo-logo.png'), from: 'CEI', fromTime: '11:30', to: 'DMK', toTime: '12:45', duration: '01h 15m', price: '1,750', perks: '', promo: '' },

  // --- จาก อุบล (UBP) ---
  // UBP -> DMK
  { id: 'f28', airline: 'Nok Air', logo: require('../assets/images/indigo-logo.png'), from: 'UBP', fromTime: '09:00', to: 'DMK', toTime: '10:00', duration: '01h 00m', price: '1,380', perks: 'Free Water', promo: '' },

  // --- จาก อุดร (UTH) ---
  // UTH -> HKT
  { id: 'f29', airline: 'AirAsia', logo: require('../assets/images/vistara-logo.png'), from: 'UTH', fromTime: '16:00', to: 'HKT', toTime: '17:45', duration: '01h 45m', price: '2,450', perks: '', promo: '' },
];

// --- หน้าจอหลัก ---
const FlightResultsScreen = ({ route, navigation }) => {
  // รับข้อมูลการจองจาก HomeScreen
  const { bookingDetails } = route.params;

  // --- 1. ดึงค่า ID สนามบินที่เลือกมา ---
  const selectedFromId = bookingDetails.from.id;
  const selectedToId = bookingDetails.to.id;

  // --- 2. กรองข้อมูลเที่ยวบิน ---
  const filteredFlights = FLIGHTS_DATA.filter(flight => {
    return flight.from === selectedFromId && flight.to === selectedToId;
  });

  // --- ฟังก์ชันเมื่อเลือกเที่ยวบิน (เหมือนเดิม) ---
  const handleSelectFlight = (selectedFlight) => {
    navigation.navigate('SeatMapScreen', {
      bookingDetails: bookingDetails,
      selectedFlight: selectedFlight,
    });
  };

  // --- Component สำหรับการ์ดเที่ยวบิน (เหมือนเดิม) ---
  const FlightCard = ({ item }) => (
    <TouchableOpacity
      style={styles.flightCard}
      onPress={() => handleSelectFlight(item)}
    >
      <View style={styles.cardRow}>
        
        <Image source={item.logo} style={styles.airlineLogo} />
        <Text style={styles.airlineName}>{item.airline}</Text>
      </View>
      <View style={[styles.cardRow, styles.timeRow]}>
      
        <View><Text style={styles.timeCode}>{item.from}</Text><Text style={styles.timeText}>{item.fromTime}</Text></View>
        <Text style={styles.durationText}>{item.duration}</Text>
        <View style={{alignItems: 'flex-end'}}><Text style={styles.timeCode}>{item.to}</Text><Text style={styles.timeText}>{item.toTime}</Text></View>
        <View style={styles.priceContainer}><Feather name="tag" size={16} color="#E57A00" /><Text style={styles.priceText}>{item.price}</Text></View>
      </View>
      <View style={[styles.cardRow, styles.bottomRow]}>
        <Text style={styles.perksText}>{item.perks}</Text>
        <Text style={styles.promoText}>{item.promo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />

        {/* --- Header (เหมือนเดิม) --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>รายการเที่ยวบิน</Text>
          <TouchableOpacity style={styles.hamburgerBtn}>
            <Feather name="menu" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* --- แสดงผลว่าค้นหาจากไหนไปไหน (เหมือนเดิม) --- */}
        <View style={styles.searchInfoBar}>
          <Text style={styles.searchInfoText}>{selectedFromId}</Text> {/* ใช้ตัวแปรที่ดึงมา */}
          <Feather name="arrow-right" size={20} color="white" style={{marginHorizontal: 10}} />
          <Text style={styles.searchInfoText}>{selectedToId}</Text> {/* ใช้ตัวแปรที่ดึงมา */}
        </View>

        {/* --- รายการเที่ยวบิน (FlatList - ใช้ข้อมูลที่กรองแล้ว) --- */}
        <FlatList
          // ⬇️ 3. ส่งข้อมูลที่กรองแล้วไปแสดงผล ⬇️
          data={filteredFlights}
          renderItem={FlightCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 15 }}
          // ⬇️ (ทางเลือก) แสดงผลถ้าไม่มีเที่ยวบินตรงตามเงื่อนไข ⬇️
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>ไม่พบเที่ยวบินสำหรับเส้นทางนี้</Text>
            </View>
          }
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default FlightResultsScreen;

// --- Stylesheet (เพิ่ม style emptyContainer) ---
const styles = StyleSheet.create({
  // ... (Style เดิมทั้งหมด) ...
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  hamburgerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 14,
  },
  searchInfoBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },
  searchInfoText: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  flightCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6A1B9A',
  },
  cardRow: { flexDirection: 'row', alignItems: 'center' },
  airlineLogo: { width: 24, height: 24, marginRight: 8 },
  airlineName: { fontSize: 14, color: '#555' },
  timeRow: { justifyContent: 'space-between', marginVertical: 15 },
  timeCode: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  timeText: { fontSize: 14, color: '#555' },
  durationText: { fontSize: 14, color: '#555', fontWeight: '500' },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E57A00',
    marginLeft: 4,
  },
  bottomRow: {
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  perksText: { fontSize: 12, color: '#333', fontWeight: '500' },
  promoText: { fontSize: 10, color: 'green', fontWeight: 'bold' },
  // ⬇️ Style สำหรับกรณีไม่พบเที่ยวบิน ⬇️
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});