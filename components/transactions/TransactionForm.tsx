import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { format, parseISO } from 'date-fns';
import { DollarSign, Calendar, AlignLeft, X, ChevronRight } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Transaction, TransactionType, Category } from '@/types';
import { SIZES } from '@/constants/theme';

interface TransactionFormProps {
  isVisible: boolean;
  onClose: () => void;
  editTransaction?: Transaction;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  isVisible,
  onClose,
  editTransaction,
}) => {
  const { theme } = useTheme();
  const { categories, addTransaction, updateTransaction } = useData();
  
  // Form state
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [categoryId, setCategoryId] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set form values if editing an existing transaction
  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type);
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description);
      setDate(parseISO(editTransaction.date));
      setCategoryId(editTransaction.categoryId);
    } else {
      // Default values for new transaction
      setType('expense');
      setAmount('');
      setDescription('');
      setDate(new Date());
      setCategoryId('');
    }
  }, [editTransaction, isVisible]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!categoryId) {
      newErrors.category = 'Please select a category';
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
      
      const transactionData = {
        type,
        amount: parseFloat(amount),
        description,
        date: date.toISOString(),
        categoryId,
      };
      
      if (editTransaction) {
        await updateTransaction({
          ...transactionData,
          id: editTransaction.id,
        });
      } else {
        await addTransaction(transactionData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === type);
  console.log("Categories", categories);
  console.log("Filtered Categories", filteredCategories);
  
  

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
              {editTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Transaction Type Selection */}
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Transaction Type
            </Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { 
                    backgroundColor: type === 'income' 
                      ? theme.colors.primary 
                      : theme.colors.inputBackground,
                    borderTopLeftRadius: SIZES.radiusMd,
                    borderBottomLeftRadius: SIZES.radiusMd,
                  }
                ]}
                onPress={() => setType('income')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: type === 'income' ? 'white' : theme.colors.text }
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  { 
                    backgroundColor: type === 'expense' 
                      ? theme.colors.secondary 
                      : theme.colors.inputBackground,
                    borderTopRightRadius: SIZES.radiusMd,
                    borderBottomRightRadius: SIZES.radiusMd,
                  }
                ]}
                onPress={() => setType('expense')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    { color: type === 'expense' ? 'white' : theme.colors.text }
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <Input
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0.00"
              icon={<DollarSign size={18} color={theme.colors.text} />}
              error={errors.amount}
            />

            {/* Date Picker */}
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Date</Text>
            <TouchableOpacity
              style={[
                styles.datePickerButton,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: errors.date ? theme.colors.error : theme.colors.border,
                }
              ]}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={18} color={theme.colors.text} />
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {format(date, 'MMMM d, yyyy')}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {/* Category Selection */}
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Category</Text>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                {
                  backgroundColor: theme.colors.inputBackground,
                  borderColor: errors.category ? theme.colors.error : theme.colors.border,
                }
              ]}
              onPress={() => setShowCategoryPicker(true)}
            >
              {categoryId ? (
                <View style={styles.selectedCategory}>
                  <Text style={[styles.categoryText, { color: theme.colors.text }]}>
                    {categories.find(c => c.id === categoryId)?.name || 'Select a category'}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.placeholderText, { color: theme.colors.border }]}>
                  Select a category
                </Text>
              )}
              <ChevronRight size={18} color={theme.colors.text} />
            </TouchableOpacity>
            {errors.category && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.category}
              </Text>
            )}

            {/* Description Input */}
            <Input
              label="Description (Optional)"
              value={description}
              onChangeText={setDescription}
              placeholder="Add a description"
              multiline
              numberOfLines={3}
              icon={<AlignLeft size={18} color={theme.colors.text} />}
            />

            <View style={styles.buttonContainer}>
              <Button
                onPress={handleSubmit}
                variant={type === 'income' ? 'primary' : 'secondary'}
                loading={isSubmitting}
                fullWidth
              >
                {editTransaction ? 'Update' : 'Add'}
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
              
              <ScrollView style={styles.categoryList}>
                {filteredCategories.map((category) => (
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
  sectionTitle: {
    fontSize: SIZES.md,
    fontWeight: '500',
    marginBottom: SIZES.spacing,
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: SIZES.spacing * 2,
  },
  typeButton: {
    flex: 1,
    padding: SIZES.spacing * 1.5,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: SIZES.sm,
    fontWeight: '500',
    marginBottom: SIZES.spacing,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginBottom: SIZES.spacing * 2,
  },
  dateText: {
    marginLeft: SIZES.spacing,
    fontSize: SIZES.md,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.spacing * 1.5,
    borderRadius: SIZES.radiusMd,
    borderWidth: 1,
    marginBottom: SIZES.spacing,
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

export default TransactionForm;