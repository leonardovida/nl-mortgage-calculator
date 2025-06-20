'use client';

import React, { useState } from 'react';
import { useCalculationHistory, useLocalDataManager } from '../hooks/useDatabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface CalculationHistoryProps {
  isVisible: boolean;
  onClose: () => void;
}

export function CalculationHistory({ isVisible, onClose }: CalculationHistoryProps) {
  const { history, isLoading, error, reload } = useCalculationHistory();
  const { 
    syncStatus, 
    syncLocalData, 
    exportData, 
    importData, 
    clearAllData, 
    getStorageUsage,
    hasLocalData 
  } = useLocalDataManager();
  
  const [activeTab, setActiveTab] = useState<'history' | 'analytics' | 'settings'>('history');
  const [importText, setImportText] = useState('');
  const storageUsage = getStorageUsage();

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mortgage-calculator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = () => {
    try {
      const result = importData(importText);
      if (result.success) {
        alert('Data imported successfully!');
        setImportText('');
        reload();
      } else {
        alert(`Import failed: ${result.error?.message}`);
      }
    } catch (error) {
      alert(`Import failed: ${(error as Error).message}`);
    }
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      clearAllData();
      reload();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('nl-NL');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Calculation History & Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              View your saved calculations and manage your data
            </p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Data Management</TabsTrigger>
            </TabsList>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Calculations</h3>
                <Button 
                  variant="outline" 
                  onClick={() => reload()}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300">
                    Error loading history: {error.message}
                  </p>
                </div>
              )}

              {history.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No calculations found. Start using the calculator to see your history here.
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((calculation: any, index: number) => (
                    <Card key={calculation.id || index}>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Property Price</p>
                            <p className="font-semibold">
                              {formatCurrency(calculation.appState?.price || calculation.property_price || 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Loan Amount</p>
                            <p className="font-semibold">
                              {formatCurrency(calculation.calculationResults?.loan || calculation.loan_amount || 0)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                            <p className="font-semibold">
                              {formatDate(calculation.timestamp || new Date(calculation.created_at).getTime())}
                            </p>
                          </div>
                        </div>
                        {calculation.appState && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <span>Interest: {calculation.appState.interest}%</span>
                              <span>Savings: {formatCurrency(calculation.appState.savings)}</span>
                              <span>First-time buyer: {calculation.appState.isFirstTimeBuyer ? 'Yes' : 'No'}</span>
                              <span>Transfer tax: {calculation.appState.transferTaxRate}%</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <h3 className="text-lg font-semibold">Usage Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Calculation Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Calculations:</span>
                        <span className="font-semibold">{history.length}</span>
                      </div>
                      {history.length > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span>Average Property Price:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                history.reduce((sum, calc) => 
                                  sum + (calc.appState?.price || calc.property_price || 0), 0
                                ) / history.length
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Average Loan Amount:</span>
                            <span className="font-semibold">
                              {formatCurrency(
                                history.reduce((sum, calc) => 
                                  sum + (calc.calculationResults?.loan || calc.loan_amount || 0), 0
                                ) / history.length
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Data Sync Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Sync Status:</span>
                        <span className={`font-semibold ${
                          syncStatus.isSyncing ? 'text-blue-600' : 
                          syncStatus.error ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {syncStatus.isSyncing ? 'Syncing...' : 
                           syncStatus.error ? 'Error' : 'Synced'}
                        </span>
                      </div>
                      {syncStatus.lastSync && (
                        <div className="flex justify-between">
                          <span>Last Sync:</span>
                          <span className="font-semibold">
                            {syncStatus.lastSync.toLocaleTimeString()}
                          </span>
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={syncLocalData}
                        disabled={syncStatus.isSyncing}
                        className="w-full mt-2"
                      >
                        {syncStatus.isSyncing ? 'Syncing...' : 'Sync Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-4">
              <h3 className="text-lg font-semibold">Data Management</h3>

              <div className="space-y-4">
                {/* Storage Usage */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Storage Usage</CardTitle>
                    <CardDescription>
                      Local storage usage for offline functionality
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Used:</span>
                        <span>{(storageUsage.used / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span>{(storageUsage.available / 1024).toFixed(1)} KB</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {storageUsage.percentage.toFixed(1)}% used
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Export Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Export Data</CardTitle>
                    <CardDescription>
                      Download all your calculation data as a JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={handleExportData} className="w-full">
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Import Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Import Data</CardTitle>
                    <CardDescription>
                      Restore data from a previously exported JSON file
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <textarea
                      className="w-full h-32 p-3 border rounded-md resize-none font-mono text-sm"
                      placeholder="Paste your exported JSON data here..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                    />
                    <Button 
                      onClick={handleImportData} 
                      disabled={!importText.trim()}
                      className="w-full"
                    >
                      Import Data
                    </Button>
                  </CardContent>
                </Card>

                {/* Clear Data */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base text-red-600 dark:text-red-400">
                      Clear All Data
                    </CardTitle>
                    <CardDescription>
                      Permanently delete all locally stored calculation data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearData}
                      className="w-full"
                      disabled={!hasLocalData}
                    >
                      Clear All Local Data
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}