// screens/BookingConfirmationScreen.js
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { LinearGradient } from 'expo-linear-gradient';
import {
    Alert,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// (If you want a real barcode, install react-native-barcode-builder)

const BookingConfirmationScreen = ({ route, navigation }) => {
    // 1. Get all the data passed from the previous screen
    const { bookingDetails, selectedFlight, selectedSeatIds } = route.params;

    // --- Function to handle saving the booking ---
    const handleSaveBooking = async () => {
        const newBookingData = { // Create the object for this booking
            id: `BK${Date.now()}`, // Create a unique ID
            bookingDetails: bookingDetails,
            selectedFlight: selectedFlight,
            selectedSeatIds: selectedSeatIds,
            status: 'Confirmed' // Set initial status
        };

        console.log('Attempting to save booking:', newBookingData); // Log data being saved

        try {
            // 1. Get existing bookings (if any)
            const existingBookingsData = await AsyncStorage.getItem('@myBookings');
            const existingBookings = existingBookingsData ? JSON.parse(existingBookingsData) : [];

            // 2. Add the new booking to the end of the array
            const updatedBookings = [...existingBookings, newBookingData];

            // 3. Save the updated array back to AsyncStorage
            await AsyncStorage.setItem('@myBookings', JSON.stringify(updatedBookings));

            console.log('Booking saved successfully!'); // Log success
            Alert.alert('สำเร็จ', 'การจองของคุณถูกบันทึกเรียบร้อยแล้ว', [
                // Add OK button to navigate back Home or to MyBookings
                { text: 'OK', onPress: () => navigation.navigate('HomeStack', { screen: 'MainHome' }) } // Go back to Home
                // Or { text: 'OK', onPress: () => navigation.navigate('MyBookings') } // Go to MyBookings
            ]);

        } catch (error) {
            console.error('Failed to save booking:', error); // Log if error occurs
            Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกการจองได้ กรุณาลองใหม่อีกครั้ง'); // Inform user
        }
    };

    // (Extract data for display - Add optional chaining ?. for safety)
    const passengerName = bookingDetails?.bookerName || 'N/A';
    const flightDate = bookingDetails?.departureDate
        ? new Date(bookingDetails.departureDate).toLocaleDateString('th-TH', {
              day: 'numeric', month: 'long', year: 'numeric'
          })
        : 'N/A';
    const seatNumber = selectedSeatIds ? selectedSeatIds.join(', ') : 'N/A';

    return (
        <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" />

                {/* --- Header with Menu Button --- */}
                <View style={styles.header}>
                    {/* Back Button */}
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.headerTitle}>สายการบิน : {selectedFlight?.airline || 'N/A'}</Text>

                    {/* Hamburger Menu Button */}
                    <TouchableOpacity
                        style={styles.hamburgerBtn}
                        onPress={() => navigation.openDrawer()} // Opens the drawer
                    >
                        <Feather name="menu" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* --- Main Content --- */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* --- Ticket Card --- */}
                    <View style={styles.ticketCard}>
                        {/* Top section */}
                        <View style={styles.cardTop}>
                            <Text style={styles.flightDate}>{flightDate}</Text>
                            <View style={styles.routeContainer}>
                                <Text style={styles.airportCode}>{bookingDetails?.from?.id || 'N/A'}</Text>
                                <View style={styles.flightPath}>
                                    <View style={styles.dot} />
                                    <View style={styles.dashedLine} />
                                    <MaterialCommunityIcons name="airplane" size={24} color="#555" style={styles.airplaneIcon} />
                                    <View style={styles.dashedLine} />
                                    <View style={styles.dot} />
                                </View>
                                <Text style={styles.airportCode}>{bookingDetails?.to?.id || 'N/A'}</Text>
                            </View>
                            <Text style={styles.duration}>{selectedFlight?.duration || 'N/A'}</Text>
                            <View style={styles.infoRow}>
                                <View style={styles.infoItem}>
                                    <Feather name="user" size={16} color="#555" />
                                    <Text style={styles.infoText}>{bookingDetails?.passengers?.total || 0} Adult</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="fast-food-outline" size={16} color="#555" />
                                    <Text style={styles.infoText}>{selectedFlight?.perks || 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                        {/* Middle section */}
                        <View style={styles.cardMiddle}>
                            <View style={styles.detailRow}>
                                <DetailItem label="ชื่อผู้จอง" value={passengerName} />
                                <DetailItem label="ประเภทที่นั่ง" value="Economy" isCentered />
                                <DetailItem label="Flight Code" value={selectedFlight?.id?.toUpperCase() || 'N/A'} isRight />
                            </View>
                            <View style={styles.detailRow}>
                                <DetailItem label="Boarding Time" value={(selectedFlight?.fromTime || 'N/A') + ' AM'} />
                                <DetailItem label="ประตู" value="A5" isCentered />
                                <DetailItem label="Terminal" value="T2" isCentered/>
                                <DetailItem label="หมายเลขที่นั่ง" value={seatNumber} isRight />
                            </View>
                        </View>
                        {/* Dashed separator */}
                        <View style={styles.tearOffLine}>
                            <View style={styles.tearOffCircleLeft} />
                            <View style={styles.tearOffDashed} />
                            <View style={styles.tearOffCircleRight} />
                        </View>
                        {/* Bottom section */}
                        <View style={styles.barcodeSection}>
                            <Text style={styles.barcodePlaceholder}>[ BARCODE AREA ]</Text>
                            <Text style={styles.barcodeNumber}>1 2 5 8 4 6 2 4 2 7 5 3 1 3 5 0 6 7 5 9</Text>
                        </View>
                    </View>

                    {/* --- Save Button --- */}
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSaveBooking} // Calls the save function
                    >
                        <Text style={styles.saveButtonText}>บันทึกการจองนี้</Text>
                    </TouchableOpacity>

                    <View style={{ height: 30 }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

// --- Sub-component for displaying details ---
const DetailItem = ({ label, value, isCentered = false, isRight = false }) => (
    <View style={[styles.detailItem, isCentered && {alignItems: 'center'}, isRight && {alignItems: 'flex-end'}]}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

export default BookingConfirmationScreen;

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: 'transparent',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    hamburgerBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 8,
        borderRadius: 14,
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 50,
    },
    ticketCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 25, // Added margin before the button
    },
    cardTop: { padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa' },
    flightDate: { fontSize: 16, color: '#555', marginBottom: 15 },
    routeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 5 },
    airportCode: { fontSize: 28, fontWeight: 'bold', color: '#333' },
    flightPath: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc' },
    dashedLine: { flex: 1, height: 1, borderBottomWidth: 1.5, borderColor: '#ccc', borderStyle: 'dashed', marginHorizontal: 5 },
    airplaneIcon: { transform: [{ rotate: '90deg'}], marginHorizontal: 5 },
    duration: { fontSize: 14, color: '#777', marginBottom: 15 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    infoText: { marginLeft: 5, fontSize: 14, color: '#333' },
    cardMiddle: { padding: 20 },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    detailItem: { flex: 1 },
    detailLabel: { fontSize: 12, color: '#888', marginBottom: 2 },
    detailValue: { fontSize: 16, fontWeight: '500', color: '#333' },
    tearOffLine: { flexDirection: 'row', alignItems: 'center', height: 20 },
    tearOffCircleLeft: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#3A7BD5', marginLeft: -10 },
    tearOffDashed: { flex: 1, height: 1, borderBottomWidth: 2, borderColor: '#ccc', borderStyle: 'dashed' },
    tearOffCircleRight: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#3A7BD5', marginRight: -10 },
    barcodeSection: { padding: 20, alignItems: 'center', backgroundColor: '#f8f9fa' },
    barcodePlaceholder: { fontSize: 18, fontWeight: 'bold', color: '#ccc', marginBottom: 10, borderWidth: 1, borderColor: '#ccc', paddingVertical: 30, paddingHorizontal: 80 },
    barcodeNumber: { fontSize: 14, color: '#555', letterSpacing: 2 },
    // --- Save Button Style ---
    saveButton: {
        backgroundColor: '#4CAF50', // Green color
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10, // Spacing from Card
        width: '80%', // Button width
        maxWidth: 300,
        alignSelf: 'center', // Center button
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});