import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import { Budget } from '@/types';
import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { parseISO, format } from 'date-fns';

interface BudgetProgressProps {
  budget?: Budget;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budget }) => {
  const { theme } = useTheme();
  const { budgets, categories } = useData();

  // If no budget is provided, use the first active budget
  const activeBudget = budget || budgets[0];

  const navigateToBudgets = () => {
    router.navigate('/(tabs)/budgets');
  };

  // Calculate progress percentage
  const getProgressPercentage = (budget: Budget) => {
    const amount = budget.amount ?? 0;
    const spent = budget.spent ?? 0;
    if (amount <= 0) return 0;
    const percentage = (spent / amount) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Get appropriate color for progress bar
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return theme.colors.primary;
    if (percentage < 90) return theme.colors.warning;
    return theme.colors.error;
  };

  // Get category name
  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'All Categories';
    return categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
  };

  if (!activeBudget) {
    return (
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Spending Goal
          </Text>
        </View>
        
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No budgets set
          </Text>
          <TouchableOpacity 
            onPress={navigateToBudgets}
            style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
          >
            <Text style={styles.createButtonText}>Create a Budget</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  const progressPercentage = getProgressPercentage(activeBudget);
  const progressColor = getProgressColor(progressPercentage);

  const spent = activeBudget.spent ?? 0;
  const amount = activeBudget.amount ?? 0;
  const remaining = amount - spent;

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Spending Goal
        </Text>
        <TouchableOpacity onPress={navigateToBudgets}>
          <ChevronRight size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.budgetName, { color: theme.colors.text }]}>
        {activeBudget.name}
      </Text>
      
      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
        {getCategoryName(activeBudget.categoryId)}
      </Text>
      
      <View style={styles.dateRange}>
        <Text style={[styles.dateText, { color: theme.colors.text }]}>
          {format(parseISO(activeBudget.startDate), 'MMM d')} - {format(parseISO(activeBudget.endDate), 'MMM d, yyyy')}
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { backgroundColor: theme.colors.inputBackground }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                backgroundColor: progressColor,
                width: `${progressPercentage}%` 
              }
            ]} 
          />
        </View>
        
        <Text style={[styles.progressText, { color: theme.colors.text }]}>
          {(progressPercentage ?? 0).toFixed(0)}%
        </Text>
      </View>
      
      <View style={styles.budgetDetails}>
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
            Spent
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            ${spent.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.detailSeparator} />
        
        <View style={styles.detailItem}>
          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
            Budget
          </Text>
          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
            ${amount.toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.remainingContainer}>
        <Text style={[styles.remainingLabel, { color: theme.colors.text }]}>
          Remaining
        </Text>
        <Text 
          style={[
            styles.remainingValue, 
            { 
              color: remaining >= 0 
                ? theme.colors.incomeText 
                : theme.colors.expenseText 
            }
          ]}
        >
          ${Math.abs(remaining).toFixed(2)}
          {remaining < 0 ? ' over budget' : ''}
        </Text>
      </View>
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
    marginBottom: SIZES.spacing,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: SIZES.spacing * 4,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing * 2,
  },
  createButton: {
    paddingVertical: SIZES.spacing,
    paddingHorizontal: SIZES.spacing * 2,
    borderRadius: SIZES.radiusMd,
  },
  createButtonText: {
    color: 'white',
    fontSize: SIZES.md,
    fontWeight: '500',
  },
  budgetName: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    marginBottom: SIZES.spacing / 2,
  },
  categoryName: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing,
  },
  dateRange: {
    marginBottom: SIZES.spacing * 2,
  },
  dateText: {
    fontSize: SIZES.sm,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  progressBar: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    marginRight: SIZES.spacing,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  budgetDetails: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing * 2,
  },
  detailItem: {
    flex: 1,
  },
  detailSeparator: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginHorizontal: SIZES.spacing * 2,
  },
  detailLabel: {
    fontSize: SIZES.sm,
    marginBottom: SIZES.spacing / 2,
  },
  detailValue: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  remainingContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: SIZES.spacing,
  },
  remainingLabel: {
    fontSize: SIZES.sm,
    marginBottom: SIZES.spacing / 2,
  },
  remainingValue: {
    fontSize: SIZES.xl,
    fontWeight: '700',
  },
});

export default BudgetProgress;