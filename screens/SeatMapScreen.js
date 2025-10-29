// screens/SeatMapScreen.js
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- Added
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react'; // <-- Make sure React, useState, useEffect are imported
import {
  ActivityIndicator, // <-- Added
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- 1. Generate Seat Structure (Initial State) ---
const generateSeatDataStructure = () => {
    const data = [];
    for (let i = 1; i <= 21; i++) {
        // Example: Mark some rows as premium
        const isPremiumRow = i >= 10 && i <= 14;
        const status = isPremiumRow ? 'premium' : 'available';

        data.push({
            row: i,
            seats: [
                { id: `${i}A`, initialStatus: status },
                { id: `${i}B`, initialStatus: status },
                { id: `${i}C`, initialStatus: status },
                { id: `aisle${i}`, initialStatus: 'aisle' },
                { id: `${i}D`, initialStatus: status },
                { id: `${i}E`, initialStatus: status },
                { id: `${i}F`, initialStatus: status },
            ],
        });
    }
    return data;
};

const SEAT_MAP_STRUCTURE = generateSeatDataStructure(); // <-- Base structure

const SEAT_SIZE = 30;
const SEAT_MARGIN = 5;

// --- 2. Seat Sub-component (No changes needed here) ---
const Seat = ({ status, isSelected, onPress }) => {
    const getSeatStyle = () => {
        if (isSelected) {
            return [styles.seatBase, styles.seatSelected]; // Selected (Green)
        }
        switch (status) {
            case 'available': return [styles.seatBase, styles.seatAvailable]; // Available (Purple)
            case 'occupied': return [styles.seatBase, styles.seatOccupied]; // Occupied (Gray)
            case 'premium': return [styles.seatBase, styles.seatPremium]; // Premium (Orange)
            case 'aisle': return { width: SEAT_SIZE + SEAT_MARGIN * 2 }; // Aisle (Empty space)
            default: return [styles.seatBase, styles.seatOccupied]; // Default to occupied
        }
    };

    const getIconColor = () => {
        if (isSelected || status === 'available' || status === 'premium') return 'white';
        if (status === 'occupied') return '#999';
        return 'transparent'; // For aisle
    };

    if (status === 'aisle') {
        return <View style={getSeatStyle()} />;
    }

    return (
        <TouchableOpacity
            style={getSeatStyle()}
            disabled={status === 'occupied'} // <-- This disables occupied seats
            onPress={onPress}>
            <MaterialCommunityIcons
                name="seat"
                size={SEAT_SIZE * 0.8}
                color={getIconColor()}
            />
        </TouchableOpacity>
    );
};

// --- 3. Main Screen Component ---
const SeatMapScreen = ({ route, navigation }) => {
    const [selectedSeatIds, setSelectedSeatIds] = useState([]);

    // --- State for loading and occupied seats ---
    const [isLoading, setIsLoading] = useState(true);
    const [occupiedSeats, setOccupiedSeats] = useState(new Set()); // Use Set for efficient checking

    // Get data passed from previous screens
    const { bookingDetails, selectedFlight } = route.params;
    const totalPassengers = bookingDetails.passengers.total;
    const currentFlightId = selectedFlight.id; // ID of the currently selected flight

    // --- useEffect to load occupied seats for this flight ---
    useEffect(() => {
        const loadOccupiedSeats = async () => {
            setIsLoading(true);
            const occupied = new Set();
            try {
                const bookingsDataString = await AsyncStorage.getItem('@myBookings');
                if (bookingsDataString !== null) {
                    const allBookings = JSON.parse(bookingsDataString);

                    // Filter bookings for the current flight
                    const bookingsForThisFlight = allBookings.filter(
                        (booking) => booking.selectedFlight?.id === currentFlightId
                    );

                    // Collect all seat IDs that are already booked on this flight
                    bookingsForThisFlight.forEach((booking) => {
                        if (booking.selectedSeatIds && Array.isArray(booking.selectedSeatIds)) {
                            booking.selectedSeatIds.forEach(seatId => occupied.add(seatId));
                        }
                    });
                }
                setOccupiedSeats(occupied); // Update the state with occupied seats
                console.log(`Occupied seats for flight ${currentFlightId}:`, Array.from(occupied));

            } catch (error) {
                console.error('Failed to load occupied seats:', error);
                Alert.alert('Error', 'ไม่สามารถโหลดข้อมูลที่นั่งได้');
            } finally {
                setIsLoading(false);
            }
        };

        loadOccupiedSeats();
        // Dependency array ensures this runs when currentFlightId changes (if applicable)
    }, [currentFlightId]);

    // --- Seat Selection Logic (Handles multiple selections up to totalPassengers) ---
    const handleSelectSeat = (seatId) => {
        const isCurrentlySelected = selectedSeatIds.includes(seatId);

        if (isCurrentlySelected) {
            // Deselect the seat
            setSelectedSeatIds(selectedSeatIds.filter(id => id !== seatId));
        } else {
            // Select a new seat
            if (selectedSeatIds.length < totalPassengers) {
                // Add seat if limit not reached
                setSelectedSeatIds([...selectedSeatIds, seatId]);
            } else {
                // Alert if limit is reached
                Alert.alert(
                    'เลือกที่นั่งครบแล้ว',
                    `คุณสามารถเลือกที่นั่งได้สูงสุด ${totalPassengers} ที่นั่ง`
                );
            }
        }
    };

    // --- Function to navigate to Confirmation screen ---
    const handleConfirmSeats = () => {
        navigation.navigate('BookingConfirmationScreen', {
            bookingDetails: bookingDetails,
            selectedFlight: selectedFlight,
            selectedSeatIds: selectedSeatIds, // Pass selected seat IDs
        });
    };

    // --- Header Component (Displays legend, seat type, etc.) ---
    const ListHeader = () => (
        <View style={styles.headerContainer}>
            {/* Top part (Back button, Title) */}
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>ภาพที่นั่งผู้โดยสาร</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Plane Body Shape */}
            <View style={styles.planeBody}>
                <View style={styles.planeNose} />
                {/* Seat Type Dropdown (Placeholder) */}
                <Text style={styles.seatTypeLabel}>ประเภทที่นั่ง</Text>
                <TouchableOpacity style={styles.seatTypeDropdown}>
                    <Text style={styles.seatTypeText}>Economy</Text>
                    <Feather name="chevron-down" size={20} color="#6A1B9A" />
                </TouchableOpacity>
                {/* Legend */}
                <View style={styles.legendContainer}>
                    <View style={styles.legendItem}>
                        <View style={[ styles.legendBox, { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' }]} />
                        <Text style={styles.legendText}>ว่าง</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, styles.seatOccupied]} />
                        <Text style={styles.legendText}>ไม่ว่าง</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendBox, styles.seatPremium]} />
                        <Text style={styles.legendText}>พรีเมียม</Text>
                    </View>
                </View>
                {/* Column Headers */}
                <View style={styles.columnHeader}>
                    <Text style={styles.columnHeaderText}>A</Text>
                    <Text style={styles.columnHeaderText}>B</Text>
                    <Text style={styles.columnHeaderText}>C</Text>
                    <View style={{ width: SEAT_SIZE + SEAT_MARGIN * 2 }} />
                    <Text style={styles.columnHeaderText}>D</Text>
                    <Text style={styles.columnHeaderText}>E</Text>
                    <Text style={styles.columnHeaderText}>F</Text>
                </View>
            </View>
        </View>
    );

    // --- Function to render each row of seats ---
    const renderRow = ({ item }) => {
        return (
            <View style={styles.rowContainer}>
                {/* Left Wing Text (Conditional) */}
                {item.row === 14 && <Text style={[styles.wingText, styles.wingLeft]}>Wings</Text>}

                <View style={styles.rowContent}>
                    {item.seats.map((seat) => {
                        // --- Determine the actual current status ---
                        let currentStatus = seat.initialStatus; // Start with base status
                        if (currentStatus !== 'aisle' && occupiedSeats.has(seat.id)) {
                             currentStatus = 'occupied'; // Override if seat ID is in the occupied set
                        }
                        // --- End status check ---

                        return (
                            <Seat
                                key={seat.id}
                                status={currentStatus} // Use the determined status
                                isSelected={selectedSeatIds.includes(seat.id)} // Check if selected
                                onPress={() => handleSelectSeat(seat.id)}
                            />
                        );
                    })}
                </View>

                {/* Right Wing Text (Conditional) */}
                {item.row === 14 && <Text style={[styles.wingText, styles.wingRight]}>Wings</Text>}
            </View>
        );
    };

    // --- Loading Indicator ---
    if (isLoading) {
        return (
            <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>กำลังโหลดข้อมูลที่นั่ง...</Text>
            </LinearGradient>
        );
    }

    // --- Main Return JSX ---
    return (
        <LinearGradient colors={['#3A7BD5', '#3A6073']} style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" />

                <FlatList
                    data={SEAT_MAP_STRUCTURE} // Use the base structure
                    renderItem={renderRow}
                    keyExtractor={(item) => item.row.toString()}
                    ListHeaderComponent={ListHeader}
                    ListFooterComponent={<View style={{ height: 200 }} />}
                    showsVerticalScrollIndicator={false}
                    // Tell FlatList to re-render if selected/occupied seats change
                    extraData={{ selectedSeatIds, occupiedSeats }}
                />

                {/* --- Confirmation Footer --- */}
                <View style={styles.footer}>
                    {/* Display selected count */}
                    <Text style={styles.selectedCountText}>
                       เลือกแล้ว {selectedSeatIds.length} / {totalPassengers} ที่นั่ง
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.confirmButton,
                            // Disable button if selection count doesn't match passenger count
                            selectedSeatIds.length !== totalPassengers && styles.confirmButtonDisabled,
                        ]}
                        // Disable button if selection count doesn't match
                        disabled={selectedSeatIds.length !== totalPassengers}
                        onPress={handleConfirmSeats} // Call confirm function on press
                    >
                        <Text style={styles.confirmButtonText}>ดำเนินการต่อ</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
    topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    headerContainer: {}, // Corrected: Empty
    planeBody: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 100, borderTopRightRadius: 100, padding: 20, alignItems: 'center' },
    planeNose: { width: 100, height: 30, backgroundColor: '#E0E0E0', borderRadius: 15, marginBottom: 20, opacity: 0.5 },
    seatTypeLabel: { fontSize: 14, color: '#777' },
    seatTypeDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 15, marginVertical: 10 },
    seatTypeText: { fontSize: 16, fontWeight: 'bold', color: '#6A1B9A', marginRight: 5 },
    legendContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 15 },
    legendItem: { flexDirection: 'row', alignItems: 'center' },
    legendBox: { width: 20, height: 20, borderRadius: 5, marginRight: 8, borderWidth: 1 },
    legendText: { fontSize: 12, color: '#555' },
    columnHeader: { flexDirection: 'row', justifyContent: 'center', width: '100%', paddingHorizontal: 10, marginTop: 10 },
    columnHeaderText: { width: SEAT_SIZE, marginHorizontal: SEAT_MARGIN, textAlign: 'center', fontSize: 14, fontWeight: 'bold', color: '#555' },
    rowContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 10 },
    rowContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    wingText: { position: 'absolute', fontSize: 16, fontWeight: 'bold', color: '#AAA', transform: [{ rotate: '-90deg' }] },
    wingLeft: { left: -20 },
    wingRight: { right: -20 },
    seatBase: { width: SEAT_SIZE, height: SEAT_SIZE, borderRadius: 8, margin: SEAT_MARGIN, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    seatAvailable: { backgroundColor: '#6A1B9A', borderColor: '#6A1B9A' },
    seatOccupied: { backgroundColor: '#E0E0E0', borderColor: '#CCC' }, // Gray, unclickable
    seatPremium: { backgroundColor: '#FFA500', borderColor: '#FFA500' }, // Orange
    seatSelected: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' }, // Green
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderTopWidth: 1, borderColor: '#E0E0E0' },
    selectedCountText: { textAlign: 'center', marginBottom: 10, fontSize: 14, color: '#333', fontWeight: '500' },
    confirmButton: { backgroundColor: '#6A1B9A', padding: 15, borderRadius: 25, alignItems: 'center' },
    confirmButtonDisabled: { backgroundColor: '#CCC' }, // Gray when disabled
    confirmButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    // Loading Styles
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: 'white', fontSize: 16, marginTop: 15 },
});

export default SeatMapScreen;