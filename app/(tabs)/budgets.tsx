import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import BudgetForm from '@/components/budget/BudgetForm';
import { Budget } from '@/types';
import { Plus, Calendar, CreditCard as Edit2, AlertCircle, Trash2 } from "lucide-react-native";
import Card from '@/components/ui/Card';
import { parseISO, format, isAfter } from 'date-fns';
import { Alert } from 'react-native';

export default function BudgetsScreen() {
  const { theme } = useTheme();
  const { budgets, categories, loading, deleteBudget } = useData();
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  const handleDeleteBudget = (id: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteBudget(id);
          },
        },
      ]
    );
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowBudgetForm(true);
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'All Categories';
    return categories.find(c => c.id === categoryId)?.name || 'Unknown Category';
  };

  // Calculate progress percentage
  const getProgressPercentage = (budget: Budget) => {
    if (budget.amount <= 0) return 0;
    const percentage = (budget.spent / budget.amount) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  // Get appropriate color for progress bar
  const getProgressColor = (percentage: number) => {
    if (percentage < 70) return theme.colors.primary;
    if (percentage < 90) return theme.colors.warning;
    return theme.colors.error;
  };

  // Check if budget is active (end date is in the future)
  const isBudgetActive = (budget: Budget) => {
    return isAfter(parseISO(budget.endDate), new Date());
  };

  // Group budgets by active/inactive
  const activeBudgets = budgets.filter(isBudgetActive);
  const inactiveBudgets = budgets.filter(budget => !isBudgetActive(budget));

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
          Loading your budgets...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Budgets
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            setEditingBudget(undefined);
            setShowBudgetForm(true);
          }}
        >
          <Plus size={24} color="white" />
          <Text style={styles.addButtonText}>New Budget</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeBudgets.length === 0 && inactiveBudgets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.text }]}>
              You don't have any budgets yet.
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.text }]}>
              Create your first budget to track your spending.
            </Text>
          </View>
        ) : (
          <>
            {activeBudgets.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Active Budgets
                </Text>
                
                {activeBudgets.map(budget => {
                  const progressPercentage = getProgressPercentage(budget);
                  const progressColor = getProgressColor(progressPercentage);
                  
                  return (
                    <Card key={budget.id} style={styles.budgetCard}>
                      <View style={styles.budgetHeader}>
                        <Text style={[styles.budgetName, { color: theme.colors.text }]}>
                          {budget.name}
                        </Text>
                        <View style={styles.budgetActions}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleEditBudget(budget)}
                          >
                            <Edit2 size={18} color={theme.colors.text} />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => handleDeleteBudget(budget.id)}
                          >
                            <Trash2 size={18} color={theme.colors.error} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      
                      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                        {getCategoryName(budget.categoryId)}
                      </Text>
                      
                      <View style={styles.dateContainer}>
                        <Calendar size={14} color={theme.colors.text} />
                        <Text style={[styles.dateText, { color: theme.colors.text }]}>
                          {format(parseISO(budget.startDate), 'MMM d')} - {format(parseISO(budget.endDate), 'MMM d, yyyy')}
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
                          {progressPercentage.toFixed(0)}%
                        </Text>
                      </View>
                      
                      <View style={styles.budgetDetails}>
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            Spent
                          </Text>
                          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            ${budget.spent.toFixed(2)}
                          </Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            Budget
                          </Text>
                          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            ${budget.amount.toFixed(2)}
                          </Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            Remaining
                          </Text>
                          <Text 
                            style={[
                              styles.detailValue, 
                              { 
                                color: budget.amount - budget.spent >= 0 
                                  ? theme.colors.incomeText 
                                  : theme.colors.expenseText 
                              }
                            ]}
                          >
                            ${Math.abs(budget.amount - budget.spent).toFixed(2)}
                            {budget.amount - budget.spent < 0 ? ' over' : ''}
                          </Text>
                        </View>
                      </View>
                      
                      {progressPercentage >= 90 && (
                        <View 
                          style={[
                            styles.warningBanner, 
                            { backgroundColor: `${theme.colors.error}20` }
                          ]}
                        >
                          <AlertCircle size={16} color={theme.colors.error} />
                          <Text style={[styles.warningText, { color: theme.colors.error }]}>
                            {progressPercentage >= 100 
                              ? 'Budget exceeded! Consider adjusting your spending.' 
                              : 'Almost at budget limit!'}
                          </Text>
                        </View>
                      )}
                    </Card>
                  );
                })}
              </View>
            )}
            
            {inactiveBudgets.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Past Budgets
                </Text>
                
                {inactiveBudgets.map(budget => {
                  const progressPercentage = getProgressPercentage(budget);
                  const progressColor = getProgressColor(progressPercentage);
                  
                  return (
                    <Card key={budget.id} style={[styles.budgetCard, styles.inactiveBudgetCard]}>
                      <View style={styles.budgetHeader}>
                        <Text style={[styles.budgetName, { color: theme.colors.text }]}>
                          {budget.name}
                        </Text>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => handleDeleteBudget(budget.id)}
                        >
                          <Trash2 size={18} color={theme.colors.error} />
                        </TouchableOpacity>
                      </View>
                      
                      <Text style={[styles.categoryName, { color: theme.colors.text }]}>
                        {getCategoryName(budget.categoryId)}
                      </Text>
                      
                      <View style={styles.dateContainer}>
                        <Calendar size={14} color={theme.colors.text} />
                        <Text style={[styles.dateText, { color: theme.colors.text }]}>
                          {format(parseISO(budget.startDate), 'MMM d')} - {format(parseISO(budget.endDate), 'MMM d, yyyy')}
                        </Text>
                      </View>
                      
                      <View style={styles.budgetDetails}>
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            Spent
                          </Text>
                          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            ${budget.spent.toFixed(2)}
                          </Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            Budget
                          </Text>
                          <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                            ${budget.amount.toFixed(2)}
                          </Text>
                        </View>
                        
                        <View style={styles.detailItem}>
                          <Text style={[styles.detailLabel, { color: theme.colors.text }]}>
                            {budget.spent <= budget.amount ? 'Saved' : 'Overspent'}
                          </Text>
                          <Text 
                            style={[
                              styles.detailValue, 
                              { 
                                color: budget.amount - budget.spent >= 0 
                                  ? theme.colors.incomeText 
                                  : theme.colors.expenseText 
                              }
                            ]}
                          >
                            ${Math.abs(budget.amount - budget.spent).toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </Card>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      {showBudgetForm && (
        <BudgetForm
          isVisible={showBudgetForm}
          onClose={() => {
            setShowBudgetForm(false);
            setEditingBudget(undefined);
          }}
          editBudget={editingBudget}
        />
      )}
    </SafeAreaView>
  );
}

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
    marginTop: SIZES.spacing * 2,
    fontSize: SIZES.md,
  },
  header: {
    padding: SIZES.spacing * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.xxxl,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing,
    borderRadius: SIZES.radiusMd,
  },
  addButtonText: {
    color: 'white',
    marginLeft: SIZES.spacing / 2,
    fontWeight: '500',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing * 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing * 4,
  },
  emptyText: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: SIZES.md,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionContainer: {
    marginBottom: SIZES.spacing * 3,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing,
  },
  budgetCard: {
    marginBottom: SIZES.spacing * 2,
  },
  inactiveBudgetCard: {
    opacity: 0.8,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing / 2,
  },
  budgetName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  budgetActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: SIZES.spacing / 2,
    marginLeft: SIZES.spacing,
  },
  categoryName: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing,
  },
  dateText: {
    fontSize: SIZES.sm,
    marginLeft: SIZES.spacing / 2,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing * 1.5,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.spacing,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: SIZES.sm,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: SIZES.xs,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing,
    borderRadius: SIZES.radiusMd,
    marginTop: SIZES.spacing,
  },
  warningText: {
    fontSize: SIZES.sm,
    marginLeft: SIZES.spacing / 2,
  },
});