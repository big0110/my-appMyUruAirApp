// screens/DrawerContent.js
import { Feather } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // <-- TouchableOpacity added here

const DrawerContent = (props) => {
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Feather name="user" size={24} color="#333" />
          <Text style={styles.headerText}>เมนู</Text>
        </View>

        {/* Automatic menu items (e.g., Home) */}
        <DrawerItemList {...props} />

        {/* --- Custom "My Bookings" item --- */}
        <TouchableOpacity
          style={styles.customItem}
          onPress={() => props.navigation.navigate('MyBookings')} // Navigate to MyBookings screen
        >
          <Feather name="list" size={20} color="#555" /> {/* List icon */}
          <Text style={styles.customItemText}>รายการที่จอง</Text>
        </TouchableOpacity>

        {/* Add other custom menu items here if needed */}
        {/* <TouchableOpacity style={styles.customItem} onPress={() => alert('Logout pressed!')}>
             <Feather name="log-out" size={20} color="#555" />
             <Text style={styles.customItemText}>ออกจากระบบ</Text>
           </TouchableOpacity> */}

      </DrawerContentScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Changed text color for better contrast
  },
  customItem: { // Style for custom items
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customItemText: { // Style for custom item text
    marginLeft: 15,
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  }
});

export default DrawerContent;