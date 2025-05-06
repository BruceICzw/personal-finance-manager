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
console.log('Category Totals:', categoryTotals);
  // Prepare data for pie chart
  const chartData = categoryTotals.map(item => {
    const category = categories.find(c => c.id == item.categoryId);
      console.log('Matching Category:', category); // Debugging
      console.log('Category ID:', item.categoryId);
    // Generate a random color
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    
    return {
      name: category?.name || 'Other',
      amount: item.amount,
      color: category?.color || randomColor,
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
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  return (
    <Card style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Expense Breakdown
      </Text>
      <View style={styles.chartContainer}>
        <PieChart
          
          data={chartData}
          width={Dimensions.get('window').width - 40} 
          height={220}
          chartConfig={chartConfig}
          accessor={"amount"}
          backgroundColor="transparent"
          paddingLeft="15"
          center={[0, 0]}
          absolute
          hasLegend={true}
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