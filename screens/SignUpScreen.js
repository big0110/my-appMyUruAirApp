// screens/SignUpScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// ⬇️ ใช้ Path รูปภาพของคุณ
const airplaneImage = require('../assets/images/airplane.png');

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // ⬇️ Logic การสมัครสมาชิก (จากโค้ดของคุณ)
  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      const emailExists = users.some((user) => user.email === email);
      if (emailExists) {
        Alert.alert('Error', 'This email is already in use');
        return;
      }
      const newUser = { name, email, password };
      users.push(newUser);
      await AsyncStorage.setItem('@users', JSON.stringify(users));
      Alert.alert('Success', 'Account created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  // ⬇️ [สำคัญ] return ที่อัปเดตแล้วสำหรับ Style แบบวงกลม
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Background Shapes */}
        <View style={styles.topBlueCircle} />
        <View style={styles.bottomGreenShape} />
        <View style={styles.lightBlueShape} />

        {/* Content - Logo & Text */}
        <View style={styles.headerContent}>
          <Image source={airplaneImage} style={styles.logo} />
          <Text style={styles.logoText}>URU AIR</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Create an account</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>continue</Text>
            </TouchableOpacity>

            <View style={styles.signUpLink}>
              <Text style={styles.linkText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.linkText, styles.linkClickable]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ⬇️ [สำคัญ] StyleSheet ใหม่ที่คุณส่งมา
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // ⬅️ พื้นหลังหลักเป็นสีขาว
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  // --- Background Shapes (ใหม่) ---
  topBlueCircle: {
    position: 'absolute',
    top: 0,
    left: -150,
    width: 500,
    height: 350,
    borderRadius: 150,
    backgroundColor: '#0052cc', // ⬅️ สีน้ำเงินเข้ม
    zIndex: 2,
  },
  bottomGreenShape: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 250,
    height: 400,
    backgroundColor: '#9bdeac', // ⬅️ สีเขียวอ่อน
    borderBottomLeftRadius: 150,
    zIndex: 0,
  },
  lightBlueShape: {
    position: 'absolute',
    top: 150, // ⬅️ ปรับตำแหน่ง
    left: 0,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(173, 216, 230, 0.7)', // ⬅️ สีฟ้าอ่อน (โปร่งแสง)
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 1,
  },
  // --- Header Content (Logo & Text) ---
  headerContent: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 70,
    width: '100%',
    alignItems: 'center',
    zIndex: 5,
  },
  logo: {
    width: 180,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  // --- Form Card ---
  formContainer: {
    flex: 1,
    justifyContent: 'center', // ⬅️ จัดให้อยู่กลาง
    paddingHorizontal: 20,
    marginTop: '30%', // ⬅️ ดันฟอร์มลงมาด้านล่าง
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.53)', // ⬅️ สีตามที่คุณกำหนด
    padding: 25,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#555',
  },
  linkClickable: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});