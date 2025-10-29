// screens/HomeScreen.js
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react'; // Make sure React is imported
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Mock data for airport options ---
const MOCK_AIRPORTS = [
  { id: 'BKK', name: 'สุวรรณภูมิ (BKK)', city: 'กรุงเทพฯ' },
  { id: 'DMK', name: 'ดอนเมือง (DMK)', city: 'กรุงเทพฯ' },
  { id: 'CNX', name: 'ท่าอากาศยานเชียงใหม่ (CNX)', city: 'เชียงใหม่' },
  { id: 'CEI', name: 'ท่าอากาศยานแม่ฟ้าหลวง เชียงราย (CEI)', city: 'เชียงราย' },
  { id: 'HGN', name: 'ท่าอากาศยานแม่ฮ่องสอน (HGN)', city: 'แม่ฮ่องสอน' },
  { id: 'NNT', name: 'ท่าอากาศยานน่านนคร (NNT)', city: 'น่าน' },
  { id: 'PRH', name: 'ท่าอากาศยานแพร่ (PRH)', city: 'แพร่' },
  { id: 'PHS', name: 'ท่าอากาศยานพิษณุโลก (PHS)', city: 'พิษณุโลก' },
  { id: 'KKC', name: 'ท่าอากาศยานขอนแก่น (KKC)', city: 'ขอนแก่น' },
  { id: 'UBP', name: 'ท่าอากาศยานอุบลราชธานี (UBP)', city: 'อุบลราชธานี' },
  { id: 'UTH', name: 'ท่าอากาศยานอุดรธานี (UTH)', city: 'อุดรธานี' },
  { id: 'BFV', name: 'ท่าอากาศยานบุรีรัมย์ (BFV)', city: 'บุรีรัมย์' },
  { id: 'SNO', name: 'ท่าอากาศยานสกลนคร (SNO)', city: 'สกลนคร' },
  { id: 'HKT', name: 'ท่าอากาศยานภูเก็ต (HKT)', city: 'ภูเก็ต' },
  { id: 'HDY', name: 'ท่าอากาศยานหาดใหญ่ (HDY)', city: 'สงขลา' },
  { id: 'USM', name: 'ท่าอากาศยานสมุย (USM)', city: 'สุราษฎร์ธานี' },
  { id: 'KBV', name: 'ท่าอากาศยานกระบี่ (KBV)', city: 'กระบี่' },
  { id: 'URT', name: 'ท่าอากาศยานสุราษฎร์ธานี (URT)', city: 'สุราษฎร์ธานี' },
  { id: 'NST', name: 'ท่าอากาศยานนครศรีธรรมราช (NST)', city: 'นครศรีธรรมราช' },
  { id: 'TST', name: 'ท่าอากาศยานตรัง (TST)', city: 'ตรัง' },
  { id: 'UTP', name: 'ท่าอากาศยานอู่ตะเภา (UTP)', city: 'ระยอง/พัทยา' },
  // ... (other airports) ...
];

// --- AirportModal Component (Updated with filtering) ---
const AirportModal = ({ visible, onClose, onSelect, title, excludeAirportId }) => {
  // Filter the list before rendering
  const filteredAirports = MOCK_AIRPORTS.filter(airport => {
    // If no excludeAirportId is provided, or if the ID doesn't match, show it
    return !excludeAirportId || airport.id !== excludeAirportId;
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={28} color="#555" />
          </TouchableOpacity>
        </View>
        <FlatList
          // Use the filtered data
          data={filteredAirports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              onPress={() => onSelect(item)}>
              <Text style={styles.modalItemName}>{item.name}</Text>
              <Text style={styles.modalItemCity}>{item.city}</Text>
            </TouchableOpacity>
          )}
          // (Optional) Show message if no options are left
          ListEmptyComponent={
            <Text style={styles.modalEmptyText}>ไม่พบสนามบินอื่น</Text>
          }
        />
      </SafeAreaView>
    </Modal>
  );
};

// --- PassengerStepper Component (Corrected) ---
const PassengerStepper = ({ label, value, onIncrement, onDecrement }) => {
  return (
    <View style={styles.stepper}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onDecrement}>
          <Feather name="minus" size={18} color="#555" />
        </TouchableOpacity>
        <Text style={styles.stepperCount}>{String(value).padStart(2, '0')}</Text>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onIncrement}>
          <Feather name="plus" size={18} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- HomeScreen ---
const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('one_way');

  // State for Airport Modals
  const [fromModalVisible, setFromModalVisible] = useState(false);
  const [toModalVisible, setToModalVisible] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);

  // State for Date Picker
  const [date, setDate] = useState(new Date());
  const [isDateSet, setIsDateSet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // State for Steppers and Booker Name
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [bookerName, setBookerName] = useState('');

  const tabs = [
    { id: 'one_way', title: 'ทางเดียว' },
    { id: 'round_trip', title: 'การเดินทางไปกลับ' },
    { id: 'multi_city', title: 'หลายเมือง' },
  ];

  // --- Handler Functions ---
  const handleSelectFrom = (airport) => {
    setSelectedFrom(airport);
    setFromModalVisible(false);
  };
  const handleSelectTo = (airport) => {
    setSelectedTo(airport);
    setToModalVisible(false);
  };
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      setIsDateSet(true);
    }
  };
  const handleSwapAirports = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
  };

  const handleSearchFlight = () => {
    // Validation
    if (!selectedFrom || !selectedTo || !isDateSet || !bookerName || (adults + children === 0)) {
      Alert.alert(
        'ข้อมูลไม่ครบถ้วน',
        'กรุณากรอกข้อมูลการจองให้ครบทุกช่อง (รวมถึงชื่อผู้จอง และจำนวนผู้โดยสาร)'
      );
      return;
    }

    // Collect data
    const bookingData = {
      from: selectedFrom,
      to: selectedTo,
      departureDate: date.toISOString(),
      passengers: {
        adults: adults,
        children: children,
        total: adults + children,
      },
      bookerName: bookerName,
      tripType: activeTab,
    };

    // "Save" data (log to console)
    console.log('ข้อมูลการจองที่บันทึก:', JSON.stringify(bookingData, null, 2));

    // Navigate to the results screen
    navigation.navigate('FlightResultsScreen', {
      bookingDetails: bookingData,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* Background Shapes */}
      <View style={styles.bottomGreenShape} />
      <View style={styles.lightBlueShape} />
      <View style={styles.topBlueCircle} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.hamburgerBtn}
            onPress={() => navigation.openDrawer()} 
          >
                            
            <Feather name="menu" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.bookingCard}>
          <Text style={styles.cardTitle}>จองเที่ยวบินของคุณ</Text>
          {/* Tabs */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.tabActive]}
                onPress={() => setActiveTab(tab.id)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.id && styles.tabTextActive,
                  ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* From */}
            <Text style={styles.label}>จาก</Text>
            <TouchableOpacity
              style={[styles.input, { marginBottom: 35 }]} // Increased margin
              onPress={() => setFromModalVisible(true)}>
              <Text
                style={
                  selectedFrom ? styles.inputText : styles.placeholderText
                }>
                {selectedFrom
                  ? selectedFrom.name
                  : 'Choose Depature from'}
              </Text>
            </TouchableOpacity>

            {/* Swap Icon */}
            <TouchableOpacity
              style={styles.swapIconContainer}
              onPress={handleSwapAirports}>
              <Feather name="repeat" size={18} color="white" />
            </TouchableOpacity>

            {/* To */}
            <Text style={styles.label}>ถึง</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setToModalVisible(true)}>
              <Text
                style={selectedTo ? styles.inputText : styles.placeholderText}>
                {selectedTo ? selectedTo.name : 'Choose Arrival at'}
              </Text>
            </TouchableOpacity>

            {/* Departure Date */}
            <Text style={styles.label}>Depature Date</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowDatePicker(true)}>
              <View
                style={[
                  styles.input,
                  { paddingRight: 60, justifyContent: 'center' },
                ]}>
                <Text
                  style={isDateSet ? styles.inputText : styles.placeholderText}>
                  {isDateSet
                    ? date.toLocaleDateString('th-TH', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })
                    : 'Choose your Date'}
                </Text>
              </View>
              <View style={styles.calendarIcon}>
                <Feather name="calendar" size={20} color="white" />
              </View>
            </TouchableOpacity>

            {/* Booker Name */}
            <Text style={styles.label}>ชื่อผู้จอง</Text>
            <TextInput
              style={styles.input}
              placeholder="กรุณากรอกชื่อ-นามสกุล"
              value={bookerName}
              onChangeText={setBookerName}
              autoCapitalize="none"
            />

            {/* Steppers */}
            <View style={styles.stepperRow}>
              <PassengerStepper
                label="Adult (12+)"
                value={adults}
                onIncrement={() => setAdults(adults + 1)}
                onDecrement={() => setAdults(Math.max(0, adults - 1))}
              />
              <PassengerStepper
                label="Childs (2-12)"
                value={children}
                onIncrement={() => setChildren(children + 1)}
                onDecrement={() => setChildren(Math.max(0, children - 1))}
              />
            </View>

            {/* Search Button */}
            <TouchableOpacity
              style={styles.searchFlightButton}
              onPress={handleSearchFlight}>
              <Text style={styles.searchFlightButtonText}>Search Flight</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modals & DatePicker */}
      <AirportModal
        visible={fromModalVisible}
        onClose={() => setFromModalVisible(false)}
        onSelect={handleSelectFrom}
        title="เลือกสนามบินต้นทาง"
        // Pass the ID of the 'To' airport (if selected) to exclude
        excludeAirportId={selectedTo ? selectedTo.id : null}
      />
      <AirportModal
        visible={toModalVisible}
        onClose={() => setToModalVisible(false)}
        onSelect={handleSelectTo}
        title="เลือกสนามบินปลายทาง"
        // Pass the ID of the 'From' airport (if selected) to exclude
        excludeAirportId={selectedFrom ? selectedFrom.id : null}
      />
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;

// --- Stylesheet ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    zIndex: 5,
  },
  topBlueCircle: {
    position: 'absolute',
    top: 50,
    left: -150,
    width: 500,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#0052cc',
    zIndex: 1,
  },
  bottomGreenShape: {
    position: 'absolute',
    top: 50,
    right: 0,
    width: 200,
    height: 400,
    backgroundColor: '#9bdeac',
    borderBottomLeftRadius: 150,
    zIndex: 0,
  },
  lightBlueShape: {
    position: 'absolute',
    top: 150,
    left: 0,
    width: 200,
    height: 450,
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 20,
    zIndex: 10,
  },
  hamburgerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 12,
    borderRadius: 14,
  },
  bookingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 15,
    marginTop: 10,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 5,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6a00ff',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
  },
  tabTextActive: {
    color: 'white',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#AAA',
  },
  swapIconContainer: {
    backgroundColor: '#6a00ff',
    borderRadius: 15,
    padding: 5,
    zIndex: 11,
    alignSelf: 'center',
    marginTop: -25,
    marginBottom: -25,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#6a00ff',
    padding: 15,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stepper: {
    flex: 1,
    marginHorizontal: 5,
  },
  stepperLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  stepperButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    elevation: 2,
  },
  stepperCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  searchFlightButton: {
    backgroundColor: '#F0F0F0',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  searchFlightButtonText: {
    color: '#6a00ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalItemCity: {
    fontSize: 14,
    color: '#777',
  },
  modalEmptyText: { // Added style for empty modal list
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#999',
  },
});