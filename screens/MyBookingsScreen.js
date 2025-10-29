// screens/MyBookingsScreen.js
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Import AsyncStorage
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react'; // <-- Import React, useState, useEffect
import {
    ActivityIndicator,
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- หน้าจอหลัก ---
const MyBookingsScreen = ({ navigation }) => {
    // --- State สำหรับเก็บข้อมูลและสถานะ Loading ---
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- useEffect สำหรับดึงข้อมูลตอนเปิดหน้า ---
    useEffect(() => {
        const loadBookings = async () => {
            setIsLoading(true);
            try {
                // ดึงข้อมูล Array ของการจองทั้งหมดจาก AsyncStorage
                const bookingsDataString = await AsyncStorage.getItem('@myBookings'); // <-- ดึงข้อมูลจาก Key นี้
                if (bookingsDataString !== null) {
                    const savedBookings = JSON.parse(bookingsDataString);
                    // เรียงลำดับการจองตามวันที่เดินทาง (ล่าสุดก่อน)
                    savedBookings.sort((a, b) => {
                        // Handle potential missing data before sorting
                        const dateA = a.bookingDetails?.departureDate ? new Date(a.bookingDetails.departureDate) : new Date(0);
                        const dateB = b.bookingDetails?.departureDate ? new Date(b.bookingDetails.departureDate) : new Date(0);
                        return dateB - dateA;
                    });
                    setBookings(savedBookings); // <-- เก็บข้อมูลที่ดึงได้ใน State
                } else {
                    setBookings([]); // ถ้าไม่มีข้อมูล ให้เป็น Array ว่าง
                }
            } catch (error) {
                console.error('Failed to load bookings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // ใช้ listener เพื่อให้ข้อมูลอัปเดตเมื่อกลับมาหน้านี้
        const unsubscribe = navigation.addListener('focus', () => {
            loadBookings();
        });

        loadBookings(); // ดึงข้อมูลครั้งแรก

        return unsubscribe; // Cleanup listener
    }, [navigation]);

    // --- Component สำหรับแสดงรายการจอง 1 รายการ ---
    const BookingCard = ({ item }) => {
        // ดึงข้อมูลจากโครงสร้างที่บันทึกไว้
        const { bookingDetails, selectedFlight, selectedSeatIds } = item;

        // จัดรูปแบบวันที่และเวลา (เพิ่มการตรวจสอบข้อมูล)
        const date = bookingDetails?.departureDate ? new Date(bookingDetails.departureDate) : null;
        const formattedDate = date ? date.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
        const formattedTime = date ? date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) : 'N/A';
        const seatNumber = selectedSeatIds ? selectedSeatIds.join(', ') : 'N/A';

        // คำนวณ Status
        let status = item.status || 'Confirmed';
        if (date && date < new Date() && status === 'Confirmed') {
             status = 'Completed';
        }

        const getStatusStyle = () => {
            switch (status) {
                case 'Confirmed': return styles.statusConfirmed;
                case 'Completed': return styles.statusCompleted;
                case 'Cancelled': return styles.statusCancelled;
                default: return styles.statusDefault;
            }
        };

        return (
            <TouchableOpacity style={styles.bookingCard}>
                <View style={[styles.statusBar, getStatusStyle()]}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
                <View style={styles.cardContent}>
                    {/* เส้นทางและสายการบิน */}
                    <View style={styles.routeRow}>
                        <Text style={styles.airportText}>{bookingDetails?.from?.id || 'N/A'}</Text>
                        <Feather name="arrow-right" size={18} color="#555" style={{ marginHorizontal: 10 }} />
                        <Text style={styles.airportText}>{bookingDetails?.to?.id || 'N/A'}</Text>
                        <Text style={styles.airlineText}>{selectedFlight?.airline || 'N/A'}</Text>
                    </View>
                    {/* วันที่และเวลา */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailText}>วันที่: {formattedDate}</Text>
                        <Text style={styles.detailText}>เวลา: {formattedTime}</Text>
                    </View>
                    {/* เที่ยวบินและที่นั่ง */}
                    <View style={styles.detailRow}>
                        <Text style={styles.detailText}>เที่ยวบิน: {selectedFlight?.id?.toUpperCase() || 'N/A'}</Text>
                        <Text style={styles.detailText}>ที่นั่ง: {seatNumber}</Text>
                    </View>
                    {/* ชื่อผู้จอง */}
                    <Text style={[styles.detailText, { marginTop: 5 }]}>ผู้จอง: {bookingDetails?.bookerName || 'N/A'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    // --- แสดง Loading Indicator ---
    if (isLoading) {
        return (
            <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>กำลังโหลดรายการจอง...</Text>
            </LinearGradient>
        );
    }

    // --- แสดงผล FlatList ---
    return (
        <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" />
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Feather name="menu" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>รายการที่จอง</Text>
                    <View style={{ width: 28 }} />
                </View>

                {/* รายการจอง */}
                <FlatList
                    data={bookings} // <-- ใช้ข้อมูลจาก State ที่ดึงมา
                    renderItem={BookingCard} // <-- แสดงผลแต่ละรายการด้วย Card
                    keyExtractor={(item, index) => item.id || `booking-${index}`}
                    contentContainerStyle={{ padding: 15 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                           <Text style={styles.emptyText}>ยังไม่มีรายการจอง</Text>
                        </View>
                    }
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MyBookingsScreen;

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
        padding: 20,
        backgroundColor: 'transparent',
    },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
    bookingCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        overflow: 'hidden',
    },
    statusBar: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        alignItems: 'flex-end',
    },
    statusText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    statusConfirmed: { backgroundColor: '#FFA500' },
    statusCompleted: { backgroundColor: '#4CAF50' },
    statusCancelled: { backgroundColor: '#F44336' },
    statusDefault: { backgroundColor: '#9E9E9E' },
    cardContent: { padding: 15 },
    routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    airportText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    airlineText: { marginLeft: 'auto', fontSize: 14, color: '#555' },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    detailText: { fontSize: 14, color: '#444' },
    emptyContainer: { padding: 50, alignItems: 'center' },
    emptyText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 16, fontWeight: 'bold' },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        marginTop: 15,
    },
});