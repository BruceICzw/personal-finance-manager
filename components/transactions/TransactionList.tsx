import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import TransactionForm from './TransactionForm';
import { Transaction } from '@/types';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { Alert } from 'react-native';

interface TransactionListProps {
  filter?: string;
  categoryId?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  filter,
  categoryId,
}) => {
  const { theme } = useTheme();
  const { transactions, categories, loading, deleteTransaction } = useData();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  // Filter transactions based on props
  let filteredTransactions = transactions;
  
  if (categoryId) {
    filteredTransactions = filteredTransactions.filter(t => t.categoryId === categoryId);
  }

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowTransactionForm(true);
  };

  const handleDeleteTransaction = (id: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTransaction(id);
          },
        },
      ]
    );
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };
  
  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#6b7280';
  };

  // Group transactions by date
  const groupTransactionsByDate = () => {
    const groups: { [key: string]: Transaction[] } = {};
    
    filteredTransactions.forEach(transaction => {
      const date = transaction.date.split('T')[0]; // Extract YYYY-MM-DD
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });
    
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, transactions]) => ({
        date,
        transactions,
      }));
  };

  const groupedTransactions = groupTransactionsByDate();

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <Card style={styles.transactionCard}>
      <View style={styles.transactionHeader}>
        <View style={styles.categoryContainer}>
          <View 
            style={[
              styles.categoryDot, 
              { backgroundColor: getCategoryColor(item.categoryId) }
            ]} 
          />
          <Text style={[styles.categoryText, { color: theme.colors.text }]}>
            {getCategoryName(item.categoryId)}
          </Text>
        </View>
        <Text 
          style={[
            styles.amountText, 
            { 
              color: item.type === 'income' 
                ? theme.colors.incomeText 
                : theme.colors.expenseText 
            }
          ]}
        >
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
      </View>
      
      {item.description && (
        <Text style={[styles.descriptionText, { color: theme.colors.text }]}>
          {item.description}
        </Text>
      )}
      
      <View style={styles.transactionFooter}>
        <Text style={[styles.timeText, { color: theme.colors.text }]}>
          {format(parseISO(item.date), 'h:mm a')}
        </Text>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEditTransaction(item)}
          >
            <Edit size={16} color={theme.colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteTransaction(item.id)}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );

  const renderDateGroup = ({ item }: { item: { date: string; transactions: Transaction[] } }) => (
    <View style={styles.dateGroup}>
      <Text style={[styles.dateHeader, { color: theme.colors.text }]}>
        {format(new Date(item.date), 'EEEE, MMMM d, yyyy')}
      </Text>
      {item.transactions.map(transaction => (
        <View key={transaction.id} style={styles.transactionContainer}>
          {renderTransactionItem({ item: transaction })}
        </View>
      ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading transactions...
        </Text>
      </View>
    );
  }

  if (filteredTransactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No transactions found
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedTransactions}
        renderItem={renderDateGroup}
        keyExtractor={item => item.date}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
      
      {showTransactionForm && (
        <TransactionForm
          isVisible={showTransactionForm}
          onClose={() => {
            setShowTransactionForm(false);
            setEditingTransaction(undefined);
          }}
          editTransaction={editingTransaction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.spacing,
    fontSize: SIZES.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing * 2,
  },
  emptyText: {
    fontSize: SIZES.md,
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: SIZES.spacing * 3,
  },
  dateHeader: {
    fontSize: SIZES.md,
    fontWeight: '600',
    marginBottom: SIZES.spacing,
    paddingHorizontal: SIZES.spacing,
  },
  transactionContainer: {
    marginBottom: SIZES.spacing,
  },
  transactionCard: {
    marginHorizontal: SIZES.spacing,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  categoryContainer: {
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
  amountText: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: SIZES.sm,
    marginBottom: SIZES.spacing,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeText: {
    fontSize: SIZES.xs,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: SIZES.spacing,
    padding: SIZES.spacing / 2,
  },
});

export default TransactionList;