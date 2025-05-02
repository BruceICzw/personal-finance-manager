import React from 'react';
import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SIZES } from '@/constants/theme';
import { Chrome as Home, BarChart2, PlusCircle, Calendar, Settings } from 'lucide-react-native';

export default function TabLayout() {
  const { theme } = useTheme();

  const tabBarStyle = {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
    height: 80,
    paddingBottom: 20,
    elevation: 0,
    shadowOpacity: 0,
  };

  // Custom floating action button component for the center tab
  const TabBarAddButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      style={[
        styles.addButton,
        { backgroundColor: theme.colors.primary }
      ]}
      onPress={onPress}
    >
      <PlusCircle size={28} color="white" strokeWidth={2.5} />
    </TouchableOpacity>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Inter-Medium',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Home size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color, size }) => (
            <BarChart2 size={22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: (props) => <TabBarAddButton {...props} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default behavior
            e.preventDefault();
            
            // Custom handling
            navigation.navigate('add');
          },
        })}
      />

      <Tabs.Screen
        name="budgets"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, size }) => (
            <Calendar size={22} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 28,
    ...SIZES.shadowMd,
  },
});