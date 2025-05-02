import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import { TimeFilter } from '@/types';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react-native';

interface DashboardSummaryProps {
  selectedFilter: TimeFilter;
  setSelectedFilter: (filter: TimeFilter) => void;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  selectedFilter,
  setSelectedFilter,
}) => {
  const { theme } = useTheme();
  const { getTotalsByType } = useData();
  
  const { income, expense, balance } = getTotalsByType(selectedFilter);

  const filters: { label: string; value: TimeFilter }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  return (
    <Card style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>Summary</Text>
        
        <View style={styles.filterButtons}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedFilter === filter.value
                      ? theme.colors.primary
                      : theme.colors.inputBackground,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setSelectedFilter(filter.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      selectedFilter === filter.value
                        ? 'white'
                        : theme.colors.text,
                  },
                ]}
              >
                {filter.label.toLowerCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.summaryContent}>
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Income
          </Text>
          <View style={styles.summaryValueContainer}>
            <ArrowUpRight size={18} color={theme.colors.incomeText} />
            <Text style={[styles.summaryValue, { color: theme.colors.incomeText }]}>
              ${income.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryLabel, { color: theme.colors.text }]}>
            Expenses
          </Text>
          <View style={styles.summaryValueContainer}>
            <ArrowDownRight size={18} color={theme.colors.expenseText} />
            <Text style={[styles.summaryValue, { color: theme.colors.expenseText }]}>
              ${expense.toFixed(2)}
            </Text>
          </View>
        </View>
        
        <View style={[styles.summaryItem, styles.balanceItem]}>
          <Text style={[styles.balanceLabel, { color: theme.colors.text }]}>
            Balance
          </Text>
          <Text
            style={[
              styles.balanceValue,
              {
                color:
                  balance >= 0 ? theme.colors.incomeText : theme.colors.expenseText,
              },
            ]}
          >
            ${balance.toFixed(2)}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    marginBottom: SIZES.spacing * 2,
  },
  summaryHeader: {
    marginBottom: SIZES.spacing * 2,
  },
  cardTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: SIZES.spacing,
    paddingHorizontal: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  summaryContent: {
    marginBottom: SIZES.spacing,
  },
  summaryItem: {
    marginBottom: SIZES.spacing * 2,
  },
  summaryLabel: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing / 2,
  },
  summaryValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: SIZES.xl,
    fontWeight: '600',
    marginLeft: SIZES.spacing / 2,
  },
  balanceItem: {
    marginBottom: 0,
  },
  balanceLabel: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing / 2,
  },
  balanceValue: {
    fontSize: SIZES.xxl,
    fontWeight: '700',
  },
});

export default DashboardSummary;