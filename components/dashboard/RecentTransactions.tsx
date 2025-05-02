import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import { ChevronRight } from 'lucide-react-native';
import { Transaction } from '@/types';
import { router } from 'expo-router';

const RecentTransactions: React.FC = () => {
  const { theme } = useTheme();
  const { transactions, categories } = useData();
  
  // Get the most recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };
  
  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6b7280';
  };

  const navigateToTransactions = () => {
    router.navigate('/(tabs)/transactions');
  };

  if (recentTransactions.length === 0) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Recent Transactions
          </Text>
          <TouchableOpacity onPress={navigateToTransactions}>
            <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No transactions yet
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Recent Transactions
        </Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={navigateToTransactions}
        >
          <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
            View All
          </Text>
          <ChevronRight size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      {recentTransactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <View style={styles.transactionLeft}>
            <View 
              style={[
                styles.categoryDot, 
                { backgroundColor: getCategoryColor(transaction.categoryId) }
              ]} 
            />
            <View>
              <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                {getCategoryName(transaction.categoryId)}
              </Text>
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {format(parseISO(transaction.date), 'MMM d, yyyy')}
              </Text>
            </View>
          </View>
          
          <Text 
            style={[
              styles.amountText, 
              { 
                color: transaction.type === 'income' 
                  ? theme.colors.incomeText 
                  : theme.colors.expenseText 
              }
            ]}
          >
            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </Text>
        </View>
      ))}
      
      <TouchableOpacity 
        style={[styles.viewAllMobile, { borderTopColor: theme.colors.border }]}
        onPress={navigateToTransactions}
      >
        <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
          View All Transactions
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing * 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAll: {
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  emptyContainer: {
    paddingVertical: SIZES.spacing * 4,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.md,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.spacing,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    marginBottom: SIZES.spacing,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SIZES.spacing,
  },
  categoryText: {
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  dateText: {
    fontSize: SIZES.xs,
    marginTop: 2,
  },
  amountText: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  viewAllMobile: {
    paddingTop: SIZES.spacing * 1.5,
    marginTop: SIZES.spacing,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: SIZES.md,
    fontWeight: '500',
  },
});

export default RecentTransactions;