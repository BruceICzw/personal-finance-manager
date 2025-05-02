import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import { TimeFilter } from '@/types';

interface ExpenseChartProps {
  selectedFilter: TimeFilter;
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ selectedFilter }) => {
  const { theme } = useTheme();
  const { getFilteredTransactions, getCategoryTotals, categories } = useData();

  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions(selectedFilter);

  // Get only expense transactions
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');

  // Get category totals
  const categoryTotals = getCategoryTotals(expenseTransactions);

  // Prepare data for pie chart
  const chartData = categoryTotals.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    return {
      name: category?.name || 'Other',
      amount: item.amount,
      color: category?.color || '#6b7280',
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    };
  });

  if (chartData.length === 0) {
    return (
      <Card style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Expense Breakdown
        </Text>
        <View style={styles.emptyChart}>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No expense data available for this period
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Expense Breakdown
      </Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get('window').width - 40} // Adjust width to fit the screen
          height={220}
          chartConfig={{
            color: () => theme.colors.text,
          }}
          accessor="amount"
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing * 2,
  },
  title: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing * 2,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.md,
    textAlign: 'center',
  },
});

export default ExpenseChart;