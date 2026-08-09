import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Upload, Activity, ShieldAlert, FileSpreadsheet, ExternalLink, Menu, X, Database, Map as MapIcon } from 'lucide-react';
import Papa from 'papaparse';
import { OutbreakMap } from './components/OutbreakMap';
import { INITIAL_OUTBREAKS, INITIAL_SURVEILLANCE_RECORDS } from './data/sampleData';

// Mock Data
const MOCK_OUTBREAKS = [
  { zone: 'East Hararghe', disease: 'Anthrax', cases: 45, deaths: 12, date: '2023-10-01' },
  { zone: 'West Hararghe', disease: 'Rabies', cases: 20, deaths: 18, date: '2023-10-05' },
  { zone: 'East Hararghe', disease: 'FMD', cases: 150, deaths: 5, date: '2023-10-12' },
  { zone: 'West Hararghe', disease: 'PPR', cases: 85, deaths: 30, date: '2023-10-15' },
  { zone: 'East Hararghe', disease: 'LSD', cases: 200, deaths: 10, date: '2023-10-20' },
];

const MOCK_TIME_SERIES = [
  { month: 'Jan', cases: 120, deaths: 15 },
  { month: 'Feb', cases: 150, deaths: 20 },
  { month: 'Mar', cases: 80, deaths: 10 },
  { month: 'Apr', cases: 200, deaths: 25 },
  { month: 'May', cases: 180, deaths: 22 },
  { month: 'Jun', cases: 250, deaths: 35 },
];

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [outbreaks, setOutbreaks] = useState(MOCK_OUTBREAKS);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            console.log('Parsed CSV data:', results.data);
            alert(`Successfully imported ${results.data.length} records from CSV.`);
            // Mock adding the new data to the state
            if (results.data.length > 0) {
              setOutbreaks([...MOCK_OUTBREAKS]); // Re-trigger state for demonstration
            }
          }
        });
      } else {
        alert('Excel/Drive integration mock: File selected. In production, this would parse XLSX.');
      }
    }
  };

  const totalCases = outbreaks.reduce((sum, item) => sum + item.cases, 0);
  const totalDeaths = outbreaks.reduce((sum, item) => sum + item.deaths, 0);
  const overallCFR = totalCases > 0 ? ((totalDeaths / totalCases) * 100).toFixed(1) : '0';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {isSidebarOpen && <span className="font-bold text-lg text-primary">HRVL Portal</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Activity size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('import')}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'import' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Upload size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Data Import</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('database')}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'database' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Database size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Firebase Sync</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('map')}
            className={`flex items-center w-full p-3 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <MapIcon size={20} />
            {isSidebarOpen && <span className="ml-3 font-medium">Geospatial Map</span>}
          </button>
          
          <div className="pt-8 mt-8 border-t border-gray-200">
            <a 
              href="https://www.research4life.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ExternalLink size={20} />
              {isSidebarOpen && <span className="ml-3 font-medium">Research4Life</span>}
            </a>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            Epizootiological Surveillance & Disease Intelligence
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Hararghe Zones Active</span>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              HR
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Scorecards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Reported Cases</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCases}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Activity size={24} />
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Mortalities</p>
                    <p className="text-3xl font-bold text-gray-900">{totalDeaths}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                    <ShieldAlert size={24} />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Overall CFR (Case Fatality Rate)</p>
                    <p className="text-3xl font-bold text-gray-900">{overallCFR}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                    <Activity size={24} />
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Disease Trends (Monthly)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={MOCK_TIME_SERIES}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cases" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="deaths" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6">Zone CFR Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={outbreaks}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="zone" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'transparent'}} />
                        <Legend />
                        <Bar dataKey="cases" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="deaths" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Outbreaks Table */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 bg-gray-50/50">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Outbreak Reports</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium">Zone</th>
                        <th className="px-6 py-4 font-medium">Disease</th>
                        <th className="px-6 py-4 font-medium">Cases</th>
                        <th className="px-6 py-4 font-medium">Deaths</th>
                        <th className="px-6 py-4 font-medium">CFR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {outbreaks.map((item, idx) => {
                        const cfr = ((item.deaths / item.cases) * 100).toFixed(1);
                        return (
                          <tr key={idx} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-sm text-gray-900">{item.date}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.zone}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                {item.disease}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.cases}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{item.deaths}</td>
                            <td className="px-6 py-4 text-sm font-medium text-orange-600">{cfr}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="max-w-3xl mx-auto mt-12">
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileSpreadsheet size={40} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Surveillance Data</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Upload CSV or Excel spreadsheets containing outbreak records to update the dashboard in real-time.
                </p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 hover:border-blue-500 transition-colors cursor-pointer relative">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                  <Upload size={32} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">CSV, XLSX (max 10MB)</p>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                  <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
                    Import from Google Drive
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'database' && (
            <div className="max-w-3xl mx-auto mt-12">
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                    <Database size={24} className="text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Firebase Synchronization</h2>
                    <p className="text-gray-500">Manage cloud database connections</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">Connection Status</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                        Connected (Mock)
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      The application is configured to sync Hararghe zone reports with Firebase Cloud Firestore.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Configure Integration</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      To fully enable live Firebase syncing, add your Firebase config to the <code>.env</code> file:
                    </p>
                    <pre className="bg-white p-3 rounded border border-blue-100 text-xs text-gray-700 overflow-x-auto">
                      {`VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="max-w-7xl mx-auto mt-6 h-[calc(100vh-12rem)] min-h-[600px]">
              <OutbreakMap 
                outbreaks={INITIAL_OUTBREAKS}
                records={INITIAL_SURVEILLANCE_RECORDS}
                darkMode={false}
                selectedZone="All"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
