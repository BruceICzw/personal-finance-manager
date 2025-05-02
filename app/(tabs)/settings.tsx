import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  ScrollView,
  Share,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';
import { SIZES } from '@/constants/theme';
import Card from '@/components/ui/Card';
import { Moon, Sun, ChevronRight, Download, Trash2, HelpCircle, Star, Share2 } from 'lucide-react-native';

export default function SettingsScreen() {
  const { theme, colorScheme, userTheme, setUserTheme } = useTheme();
  const { exportData } = useData();
  
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setUserTheme(newTheme);
  };
  
  const handleExportData = async () => {
    try {
      const data = await exportData();
      
      // Export as JSON file (on web) or share (on mobile)
      await Share.share({
        message: data,
        title: 'WealthWise Financial Data',
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'Unable to export your data. Please try again.');
    }
  };
  
  const handleResetConfirm = () => {
    Alert.alert(
      'Reset All Data',
      'This will permanently delete all your financial data. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: handleResetData,
        },
      ]
    );
  };
  
  const handleResetData = () => {
    // Implement data reset functionality
    Alert.alert('Data Reset', 'All your financial data has been reset.');
  };

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Settings
        </Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Text>
          
          <Card style={styles.settingsCard}>
            <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
              Theme
            </Text>
            
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: userTheme === 'light' 
                      ? `${theme.colors.primary}20` 
                      : theme.colors.cardBackground 
                  }
                ]}
                onPress={() => handleThemeChange('light')}
              >
                <Sun 
                  size={20} 
                  color={userTheme === 'light' ? theme.colors.primary : theme.colors.text} 
                />
                <Text 
                  style={[
                    styles.themeText, 
                    { 
                      color: userTheme === 'light' 
                        ? theme.colors.primary 
                        : theme.colors.text 
                    }
                  ]}
                >
                  Light
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: userTheme === 'dark' 
                      ? `${theme.colors.primary}20` 
                      : theme.colors.cardBackground 
                  }
                ]}
                onPress={() => handleThemeChange('dark')}
              >
                <Moon 
                  size={20} 
                  color={userTheme === 'dark' ? theme.colors.primary : theme.colors.text} 
                />
                <Text 
                  style={[
                    styles.themeText, 
                    { 
                      color: userTheme === 'dark' 
                        ? theme.colors.primary 
                        : theme.colors.text 
                    }
                  ]}
                >
                  Dark
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  { 
                    backgroundColor: userTheme === 'system' 
                      ? `${theme.colors.primary}20` 
                      : theme.colors.cardBackground 
                  }
                ]}
                onPress={() => handleThemeChange('system')}
              >
                <Text 
                  style={[
                    styles.themeText, 
                    { 
                      color: userTheme === 'system' 
                        ? theme.colors.primary 
                        : theme.colors.text 
                    }
                  ]}
                >
                  System
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Data Management
          </Text>
          
          <Card style={styles.settingsCard}>
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleExportData}
            >
              <View style={styles.settingLeft}>
                <Download size={20} color={theme.colors.text} />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>
                  Export Data
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.text} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={handleResetConfirm}
            >
              <View style={styles.settingLeft}>
                <Trash2 size={20} color={theme.colors.error} />
                <Text style={[styles.settingText, { color: theme.colors.error }]}>
                  Reset All Data
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </Card>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About
          </Text>
          
          <Card style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color={theme.colors.text} />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>
                  Help & Support
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.text} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Star size={20} color={theme.colors.text} />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>
                  Rate the App
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.text} />
            </TouchableOpacity>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <Share2 size={20} color={theme.colors.text} />
                <Text style={[styles.settingText, { color: theme.colors.text }]}>
                  Share App
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.text} />
            </TouchableOpacity>
          </Card>
          
          <Text style={[styles.versionText, { color: theme.colors.text }]}>
            WealthWise v1.0.0
          </Text>
        </View>
      </ScrollView>
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
    marginBottom: SIZES.spacing,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing * 2,
  },
  section: {
    marginBottom: SIZES.spacing * 3,
  },
  sectionTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    marginBottom: SIZES.spacing,
  },
  settingsCard: {
    marginBottom: SIZES.spacing,
  },
  settingLabel: {
    fontSize: SIZES.md,
    fontWeight: '500',
    marginBottom: SIZES.spacing,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing,
    borderRadius: SIZES.radiusMd,
    marginHorizontal: SIZES.spacing / 2,
  },
  themeText: {
    marginLeft: SIZES.spacing / 2,
    fontSize: SIZES.sm,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.spacing * 1.5,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: SIZES.md,
    marginLeft: SIZES.spacing,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  versionText: {
    textAlign: 'center',
    fontSize: SIZES.sm,
    marginTop: SIZES.spacing,
    opacity: 0.7,
  },
});