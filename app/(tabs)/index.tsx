import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import ExpenseChart from '@/components/dashboard/ExpenseChart';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import BudgetProgress from '@/components/budget/BudgetProgress';
import { TimeFilter } from '@/types';

export default function DashboardScreen() {
  const { theme } = useTheme();
  const { loading } = useData();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('monthly');

  if (loading) {
    return (
      <View 
        style={[
          styles.loadingContainer, 
          { backgroundColor: theme.colors.background }
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your financial data...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            WealthWise
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.text }]}>
            Personal Finance Tracker
          </Text>
        </View>

        <DashboardSummary 
          selectedFilter={selectedFilter} 
          setSelectedFilter={setSelectedFilter} 
        />
        
        <ExpenseChart selectedFilter={selectedFilter} />
        
        <BudgetProgress />
        
        <RecentTransactions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: SIZES.spacing * 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.spacing * 2,
    fontSize: SIZES.md,
  },
  header: {
    marginBottom: SIZES.spacing * 3,
  },
  appName: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: SIZES.md,
    opacity: 0.7,
  },
});