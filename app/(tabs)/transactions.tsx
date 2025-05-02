import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import TransactionList from '@/components/transactions/TransactionList';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react-native';
import { format, addMonths, subMonths } from 'date-fns';
import { TransactionType } from '@/types';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const { transactions } = useData();
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Filter transactions by month and type
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const isCurrentMonth = 
      transactionDate.getMonth() === currentMonth.getMonth() && 
      transactionDate.getFullYear() === currentMonth.getFullYear();
    
    if (!isCurrentMonth) return false;
    
    if (selectedType === 'all') return true;
    return transaction.type === selectedType;
  });

  const incomeTotal = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const expenseTotal = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Transactions
        </Text>
        
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.typeFilter,
              { 
                backgroundColor: selectedType === 'all' 
                  ? theme.colors.primary 
                  : theme.colors.inputBackground,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedType('all')}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: selectedType === 'all' ? 'white' : theme.colors.text }
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeFilter,
              { 
                backgroundColor: selectedType === 'income' 
                  ? theme.colors.primary 
                  : theme.colors.inputBackground,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedType('income')}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: selectedType === 'income' ? 'white' : theme.colors.text }
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeFilter,
              { 
                backgroundColor: selectedType === 'expense' 
                  ? theme.colors.secondary 
                  : theme.colors.inputBackground,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setSelectedType('expense')}
          >
            <Text
              style={[
                styles.typeFilterText,
                { color: selectedType === 'expense' ? 'white' : theme.colors.text }
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.monthSelector}>
          <TouchableOpacity 
            style={styles.monthButton}
            onPress={handlePreviousMonth}
          >
            <ChevronLeft size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.monthText, { color: theme.colors.text }]}>
            {format(currentMonth, 'MMMM yyyy')}
          </Text>
          
          <TouchableOpacity 
            style={styles.monthButton}
            onPress={handleNextMonth}
          >
            <ChevronRight size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
              Income
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.incomeText }]}>
              ${incomeTotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
              Expenses
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.expenseText }]}>
              ${expenseTotal.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
              Balance
            </Text>
            <Text 
              style={[
                styles.summaryValue, 
                { 
                  color: incomeTotal - expenseTotal >= 0 
                    ? theme.colors.incomeText 
                    : theme.colors.expenseText 
                }
              ]}
            >
              ${(incomeTotal - expenseTotal).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <TransactionList />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: SIZES.spacing * 2,
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
    marginBottom: SIZES.spacing * 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing * 2,
  },
  typeFilter: {
    flex: 1,
    paddingVertical: SIZES.spacing,
    paddingHorizontal: SIZES.spacing,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginRight: SIZES.spacing,
    alignItems: 'center',
  },
  typeFilterText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  monthButton: {
    padding: SIZES.spacing,
  },
  monthText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    paddingHorizontal: SIZES.spacing * 2,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: SIZES.radiusMd,
    padding: SIZES.spacing * 1.5,
    marginBottom: SIZES.spacing,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  summaryLabel: {
    fontSize: SIZES.xs,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});