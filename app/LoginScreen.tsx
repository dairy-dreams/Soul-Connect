import GenderSelection from "@/components/GenderSelection";
import BlinkingHeart from "@/components/BlinkingHeart";
import {
  BUTTON_COLOR,
  BUTTON_TEXT_COLOR,
  LIGHT_BUTTON_COLOR,
  LIGHT_TEXT_COLOR,
} from "@/constant/Color";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Formik } from "formik";
import React, { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import CountryPicker from "react-native-country-picker-modal";
import OTPTextInput from "react-native-otp-textinput";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { auth, db } from "../firebase.client";
import { signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';

function TabBarIcon({
  name,
  color,
  library,
  size = 20,
  styles = {},
}: {
  name: string;
  color: string;
  library: "Ionicons" | "MaterialIcons" | "FontAwesome" | "AntDesign";
  size?: number;
  styles?: object;
}) {
  const IconComponent =
    library === "Ionicons"
      ? Ionicons
      : library === "MaterialIcons"
      ? MaterialIcons
      : library === "FontAwesome"
      ? FontAwesome
      : AntDesign;

  return <IconComponent name={name as any} size={size} color={color} styles={styles} />;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  age: Yup.number()
    .required("Age is required")
    .min(1, "Age must be greater than 0")
    .max(120, "Age must be less than 120"),
  gender: Yup.string().required("Gender is required"),
});

const LoginScreen = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);

  const router = useRouter();

  const handleNextStep = async () => {
    if (step === 1) {
      if (!phoneNumber || phoneNumber.length < 10) {
        Alert.alert("Invalid Input", "Please enter a valid phone number");
        return;
      }
      try {
        const formattedNumber = `+${callingCode}${phoneNumber}`;
        console.log("Sending OTP to:", formattedNumber);
        
        const result = await signInWithPhoneNumber(
          auth,
          formattedNumber,
          recaptchaVerifier.current
        );
        setConfirmationResult(result);
        setStep(2);
      } catch (error: any) {
        console.error("Phone auth error:", error);
        Alert.alert("Error", "Failed to send verification code. Please try again.");
      }
    } else if (step === 2) {
      if (!otp || otp.length !== 6) {
        Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP");
        return;
      }
      try {
        if (!confirmationResult) {
          throw new Error("No confirmation result available");
        }
        
        console.log("Confirming OTP:", otp);
        await confirmationResult.confirm(otp)
          .then(() => {
            console.log("OTP confirmed successfully");
            setStep(3);
          })
          .catch((error) => {
            console.error("OTP confirmation error:", error);
            // Handle storage error specifically
            if (error.message.includes("setItem")) {
              Alert.alert("Error", "Storage access error. Please check app permissions.");
            } else {
              Alert.alert("Error", "Invalid OTP. Please try again.");
            }
            throw error;
          });
      } catch (error: any) {
        console.error("OTP verification failed:", error);
        // Don't show another alert here since we already showed one in the catch block above
      }
    }
  };

  const handlePreviousStep = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const handleSubmitProfile = async (values: any) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user found");

      await setDoc(doc(db, "users", user.uid), {
        name: values.name,
        age: Number(values.age),
        gender: values.gender,
        phoneNumber: `+${callingCode}${phoneNumber}`,
        createdAt: new Date().toISOString(),
      });

      router.push("/UsersChatList");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const imageSource =
    step === 1
      ? require("../assets/images/login.png")
      : step === 2
      ? require("../assets/images/otp-verification.png")
      : step === 3
      ? require("../assets/images/profile.png") : require("../assets/images/login.png");

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : -10}
    >
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text style={styles.title}>S<View style={styles.iconRight}>
                        <BlinkingHeart />
                      </View>ULC<View style={styles.iconRight}>
                        <BlinkingHeart />
                      </View>NNECT...</Text>
              <Image
                source={imageSource}
                style={styles.image}
                resizeMode="contain"
              />
              <Text style={styles.subHeading}>Phone OTP Authentication</Text>

              {step === 1 && (
                <View style={styles.stepContainer}>
                  <View style={styles.inputWrapper}>
                    <View style={styles.phoneInputContainer}>
                      
                      <Text style={styles.callingCode}>+{callingCode}</Text>
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="Phone Number"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        autoComplete="tel"
                      />
                    </View>

                    <TouchableOpacity
                      style={styles.button}
                      onPress={handleNextStep}
                    >
                      <Text style={styles.text}>Send Verification Code</Text>
                      <View style={styles.iconRight}>
                        <TabBarIcon
                          name="navigate-next"
                          color="#fff"
                          library="MaterialIcons"
                          size={30}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {step === 2 && (
                <View style={styles.stepContainer}>
                  <OTPTextInput
                    handleTextChange={setOtp}
                    containerStyle={styles.otpContainer}
                    textInputStyle={styles.otpInput}
                    inputCount={6}
                    tintColor={BUTTON_COLOR}
                    keyboardType="number-pad"
                  />
                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={[
                        styles.button,
                        styles.halfButton,
                        { backgroundColor: LIGHT_BUTTON_COLOR },
                      ]}
                      onPress={handlePreviousStep}
                    >
                      <View style={styles.buttonContent}>
                        <TabBarIcon
                          name="left"
                          color={LIGHT_TEXT_COLOR}
                          library="AntDesign"
                        />
                        <Text
                          style={[
                            styles.buttonText,
                            { color: LIGHT_TEXT_COLOR },
                          ]}
                        >
                          Back
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.halfButton]}
                      onPress={handleNextStep}
                    >
                      <View style={styles.buttonContent}>
                        <Text style={styles.buttonText}>Next</Text>
                        <TabBarIcon
                          name="right"
                          color="#fff"
                          library="AntDesign"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {step === 3 && (
                <Formik
                  initialValues={{ name: "", age: "", gender: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmitProfile}
                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    setFieldValue
                  }) => (
                    <View style={styles.stepContainer}>
                      <TextInput
                        placeholder="Name"
                        style={styles.input}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        value={values.name}
                      />
                      {touched.name && errors.name && (
                        <Text style={styles.error}>{errors.name}</Text>
                      )}

                      <TextInput
                        placeholder="Age"
                        style={styles.input}
                        onChangeText={handleChange("age")}
                        onBlur={handleBlur("age")}
                        value={values.age}
                        keyboardType="numeric"
                      />
                      {touched.age && errors.age && (
                        <Text style={styles.error}>{errors.age}</Text>
                      )}

                      <GenderSelection setFieldValue={setFieldValue} values={values} />
                      {touched.gender && errors.gender && (
                        <Text style={styles.error}>{errors.gender}</Text>
                      )}

                      <View style={styles.buttonRow}>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            styles.halfButton,
                            { backgroundColor: LIGHT_BUTTON_COLOR },
                          ]}
                          onPress={handlePreviousStep}
                        >
                          <View style={styles.buttonContent}>
                            <TabBarIcon
                              name="left"
                              color={LIGHT_TEXT_COLOR}
                              library="AntDesign"
                            />
                            <Text
                              style={[
                                styles.buttonText,
                                { color: LIGHT_TEXT_COLOR },
                              ]}
                            >
                              Back
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.button, styles.halfButton]}
                          onPress={handleSubmit}
                        >
                          <View style={styles.buttonContent}>
                            <Text style={styles.buttonText}>Submit</Text>
                            <TabBarIcon
                              name="check"
                              color="#fff"
                              library="AntDesign"
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Formik>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    minHeight:
      Platform.OS === "ios" ? Dimensions.get("window").height : "auto",
  },
  image: {
    width: 350,
    height: 350,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "500",
    fontFamily: "sans-serif",
    fontStyle: "italic",
    color: "#FF1493",
    marginBottom: 30,
    textAlign: "center",
    textShadowColor: 'rgba(255, 20, 147, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 3,
  },
  stepContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 20,
  },
  text: {
    color: BUTTON_TEXT_COLOR,
    fontSize: 16,
    fontWeight: "bold",
  },
  inputWrapper: {
    width: "100%",
    alignItems: "center",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#3C4858",
    paddingHorizontal: 10,
  },
  callingCode: {
    fontSize: 16,
    color: "#3C4858",
    marginHorizontal: 10,
  },
  button: {
    width: 350,
    height: 50,
    paddingHorizontal: 20,
    backgroundColor: BUTTON_COLOR,
    borderRadius: 8,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconRight: {
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  halfButton: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  otpContainer: {
    width: "100%",
    marginVertical: 15,
  },
  otpInput: {
    height: 50,
    width: 50,
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    fontSize: 20,
    color: "#3C4858",
    shadowColor: "#9E9E9E",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#FFFFFF",
    borderColor: "#E8EAF6",
    borderWidth: 2,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    color: "#3C4858",
  },
  error: {
    alignSelf: "flex-start",
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
});

export default LoginScreen;
