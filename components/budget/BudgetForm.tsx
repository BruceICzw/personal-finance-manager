import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { format, parseISO, addMonths } from 'date-fns';
import { Calendar, X, ChevronRight, DollarSign, BookText } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Budget, Category } from '@/types';
import { SIZES } from '@/constants/theme';

interface BudgetFormProps {
  isVisible: boolean;
  onClose: () => void;
  editBudget?: Budget;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  isVisible,
  onClose,
  editBudget,
}) => {
  const { theme } = useTheme();
  const { categories, addBudget, updateBudget } = useData();
  
  // Form state
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addMonths(new Date(), 1));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set form values if editing an existing budget
  useEffect(() => {
    if (editBudget) {
      setName(editBudget.name);
      setAmount(editBudget.amount.toString());
      setCategoryId(editBudget.categoryId);
      setStartDate(parseISO(editBudget.startDate));
      setEndDate(parseISO(editBudget.endDate));
    } else {
      // Default values for new budget
      setName('');
      setAmount('');
      setCategoryId(null);
      setStartDate(new Date());
      setEndDate(addMonths(new Date(), 1));
    }
  }, [editBudget, isVisible]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Budget name is required';
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (endDate <= startDate) {
      newErrors.dates = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const budgetData = {
        name,
        amount: parseFloat(amount),
        spent: editBudget ? editBudget.spent : 0,
        categoryId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      
      if (editBudget) {
        await updateBudget({
          ...budgetData,
          id: editBudget.id,
        });
      } else {
        await addBudget(budgetData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // If end date is now before start date, update it
      if (endDate <= selectedDate) {
        setEndDate(addMonths(selectedDate, 1));
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Get only expense categories
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}
      >
        <Card style={styles.formContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {editBudget ? 'Edit Budget' : 'Create Budget'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Budget Name */}
            <Input
              label="Budget Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g., Monthly Expenses"
              icon={<BookText size={18} color={theme.colors.text} />}
              error={errors.name}
            />

            {/* Budget Amount */}
            <Input
              label="Budget Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              icon={<DollarSign size={18} color={theme.colors.text} />}
              error={errors.amount}
            />

            {/* Category Selection (Optional) */}
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Category (Optional)
            </Text>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => setShowCategoryPicker(true)}
            >
              {categoryId ? (
                <View style={styles.selectedCategory}>
                  <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                    {categories.find(c => c.id === categoryId)?.name || 'All Categories'}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.placeholderText, { color: theme.colors.border }]}>
                  All Categories
                </Text>
              )}
              <ChevronRight size={18} color={theme.colors.text} />
            </TouchableOpacity>

            {/* Date Range */}
            <View style={styles.dateRangeContainer}>
              <View style={styles.datePickerWrapper}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Start Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.dates ? theme.colors.error : theme.colors.border,
                    }
                  ]}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Calendar size={18} color={theme.colors.text} />
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>
                    {format(startDate, 'MMM d, yyyy')}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.datePickerWrapper}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  End Date
                </Text>
                <TouchableOpacity
                  style={[
                    styles.datePickerButton,
                    {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: errors.dates ? theme.colors.error : theme.colors.border,
                    }
                  ]}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Calendar size={18} color={theme.colors.text} />
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>
                    {format(endDate, 'MMM d, yyyy')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            {errors.dates && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.dates}
              </Text>
            )}
            
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
              />
            )}
            
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={new Date(startDate.getTime() + 86400000)} // +1 day
              />
            )}

            <View style={styles.buttonContainer}>
              <Button
                onPress={handleSubmit}
                loading={isSubmitting}
                fullWidth
              >
                {editBudget ? 'Update Budget' : 'Create Budget'}
              </Button>
            </View>
          </ScrollView>
        </Card>

        {/* Category Picker Modal */}
        <Modal
          visible={showCategoryPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCategoryPicker(false)}
        >
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}>
            <Card style={styles.pickerContainer}>
              <View style={styles.pickerHeader}>
                <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>
                  Select a Category
                </Text>
                <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
                  <X size={20} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  {
                    backgroundColor: categoryId === null ? 'rgba(0,0,0,0.05)' : 'transparent',
                  },
                ]}
                onPress={() => {
                  setCategoryId(null);
                  setShowCategoryPicker(false);
                }}
              >
                <Text style={[styles.categoryItemText, { color: theme.colors.text }]}>
                  All Categories
                </Text>
              </TouchableOpacity>
              
              <ScrollView style={styles.categoryList}>
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryItem,
                      {
                        backgroundColor:
                          categoryId === category.id
                            ? `${category.color}20`
                            : 'transparent',
                      },
                    ]}
                    onPress={() => {
                      setCategoryId(category.id);
                      setShowCategoryPicker(false);
                    }}
                  >
                    <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                      <Text style={styles.categoryIconText}>{category.icon.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.categoryItemText, { color: theme.colors.text }]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Card>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  title: {
    fontSize: SIZES.xl,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    marginBottom: SIZES.spacing,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginBottom: SIZES.spacing * 2,
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: SIZES.md,
  },
  placeholderText: {
    fontSize: SIZES.md,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  datePickerWrapper: {
    flex: 1,
    marginRight: SIZES.spacing,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginBottom: SIZES.spacing,
  },
  dateText: {
    marginLeft: SIZES.spacing,
    fontSize: SIZES.sm,
  },
  errorText: {
    fontSize: SIZES.xs,
    marginBottom: SIZES.spacing * 2,
  },
  buttonContainer: {
    marginTop: SIZES.spacing,
    marginBottom: SIZES.spacing * 3,
  },
  pickerContainer: {
    width: '90%',
    maxHeight: '70%',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing * 2,
  },
  pickerTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
  },
  categoryList: {
    maxHeight: 400,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.spacing,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing,
  },
  categoryIconText: {
    color: 'white',
    fontSize: SIZES.md,
    fontWeight: '700',
  },
  categoryItemText: {
    fontSize: SIZES.md,
  },
});

export default BudgetForm;