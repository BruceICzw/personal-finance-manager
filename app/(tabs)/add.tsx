import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { SIZES } from '@/constants/theme';
import {PlusCircle, ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react-native';
import TransactionForm from '@/components/transactions/TransactionForm';
import BudgetForm from '@/components/budget/BudgetForm';
import { router } from 'expo-router';

export default function AddScreen() {
  const { theme } = useTheme();
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Add New
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          What would you like to add?
        </Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
          onPress={() => setShowTransactionForm(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <PlusCircle size={32} color="white" />
          </View>
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            New Transaction
          </Text>
          <Text style={[styles.optionDescription, { color: theme.colors.text }]}>
            Record income or expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.border }
          ]}
          onPress={() => setShowBudgetForm(true)}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary }]}>
            <Wallet size={32} color="white" />
          </View>
          <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
            New Budget
          </Text>
          <Text style={[styles.optionDescription, { color: theme.colors.text }]}>
            Set spending limits
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.quickActions}>
        <Text style={[styles.quickActionsTitle, { color: theme.colors.text }]}>
          Quick Add
        </Text>
        
        <View style={styles.quickButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => {
              setShowTransactionForm(true);
            }}
          >
            <ArrowUpCircle size={24} color="white" />
            <Text style={styles.quickButtonText}>Income</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.quickButton,
              { backgroundColor: theme.colors.secondary }
            ]}
            onPress={() => {
              setShowTransactionForm(true);
            }}
          >
            <ArrowDownCircle size={24} color="white" />
            <Text style={styles.quickButtonText}>Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.cancelButton, { borderTopColor: theme.colors.border }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.cancelText, { color: theme.colors.text }]}>
          Cancel
        </Text>
      </TouchableOpacity>
      
      {showTransactionForm && (
        <TransactionForm
          isVisible={showTransactionForm}
          onClose={() => {
            setShowTransactionForm(false);
            router.navigate('/(tabs)');
          }}
        />
      )}
      
      {showBudgetForm && (
        <BudgetForm
          isVisible={showBudgetForm}
          onClose={() => {
            setShowBudgetForm(false);
            router.navigate('/(tabs)');
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.spacing * 2,
    marginBottom: SIZES.spacing * 2,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    marginBottom: SIZES.spacing,
  },
  subtitle: {
    fontSize: SIZES.md,
    opacity: 0.7,
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.spacing * 2,
    marginBottom: SIZES.spacing * 3,
  },
  optionCard: {
    flex: 1,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.spacing * 2,
    alignItems: 'center',
    borderWidth: 1,
    marginRight: SIZES.spacing,
    ...SIZES.shadowSm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  optionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing / 2,
  },
  optionDescription: {
    fontSize: SIZES.sm,
    textAlign: 'center',
    opacity: 0.7,
  },
  quickActions: {
    padding: SIZES.spacing * 2,
  },
  quickActionsTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing * 1.5,
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickButton: {
    borderRadius: SIZES.radiusMd,
    padding: SIZES.spacing * 1.5,
    alignItems: 'center',
    width: 150,
    ...SIZES.shadowSm,
  },
  quickButtonText: {
    color: 'white',
    marginTop: SIZES.spacing,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 'auto',
    padding: SIZES.spacing * 2,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  cancelText: {
    fontSize: SIZES.md,
    fontWeight: '500',
  },
});