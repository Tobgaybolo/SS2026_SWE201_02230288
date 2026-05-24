import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import { validateTextField } from '../utils/validators';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

type LoginFormValues = {
  name: string;
  password: string;
};

const LoginScreen = ({ navigation }: Props) => {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const { values, errors, handleChange, handleBlur, validate } =
    useForm<LoginFormValues>(
      { name: '', password: '' },
      {
        name: (v) => validateTextField(v, 'Name', 2, 50),
        password: (v) => validateTextField(v, 'Password', 4, 50),
      }
    );

  const handleLogin = async () => {
    if (!validate()) return; // stop if validation fails

    setLoading(true);
    // Simulate a short network delay for realism
    setTimeout(() => {
      login(values.name);
      setLoading(false);
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emoji}>✅</Text>
        <Text style={styles.title}>TaskManager</Text>
        <Text style={styles.subtitle}>Organize your work, one task at a time</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Name field */}
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="Enter your name"
          placeholderTextColor="#9ca3af"
          value={values.name}
          onChangeText={(v) => handleChange('name', v)}
          onBlur={() => handleBlur('name')}
          autoCapitalize="words"
        />
        {errors.name ? (
          <Text style={styles.errorText}>{errors.name}</Text>
        ) : null}

        {/* Password field */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, errors.password ? styles.inputError : null]}
          placeholder="Enter your password"
          placeholderTextColor="#9ca3af"
          value={values.password}
          onChangeText={(v) => handleChange('password', v)}
          onBlur={() => handleBlur('password')}
          secureTextEntry
        />
        {errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        {/* Login button */}
        <TouchableOpacity
          style={[styles.button, loading ? styles.buttonDisabled : null]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          💡 Any name and password (4+ chars) will work
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 4,
    backgroundColor: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hint: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 16,
  },
});

export default LoginScreen;