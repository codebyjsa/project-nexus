'use client';

import { useState, useEffect } from 'react';
import TimetableGrid from '@/components/academics/TimetableGrid';
import LMSPanel from '@/components/academics/LMSPanel';
import PerformanceChart from '@/components/academics/PerformanceChart';

export default function AcademicsPage() {
    const [activeTab, setActiveTab] = useState('timetable');
    const [activeSemester, setActiveSemester] = useState('sem1');
    const [timetableData, setTimetableData] = useState(null);

    // Fetch timetable data for performance chart
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/timetable');
                const data = await response.json();
                setTimetableData(data);
            } catch (error) {
                console.error('Error fetching timetable:', error);
            }
        };

        fetchData();

        // Real-time polling
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 'timetable', label: 'Timetable', icon: '📅' },
        { id: 'lms', label: 'Assignments', icon: '📝' },
        { id: 'performance', label: 'Performance', icon: '📊' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Academic Cockpit</h1>
                    <p className="text-gray-400">Your personal academic command center</p>
                </div>

                {/* Semester Selector */}
                <div className="mb-6">
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-2 inline-flex gap-2">
                        {timetableData?.semesters?.map(semester => (
                            <button
                                key={semester.id}
                                onClick={() => setActiveSemester(semester.id)}
                                className={`px-6 py-3 rounded-[20px] font-medium transition-all duration-300 ${activeSemester === semester.id
                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                {semester.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-2 inline-flex gap-2">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-[20px] font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }`}
                            >
                                <span>{tab.icon}</span>
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="transition-all duration-500">
                    {activeTab === 'timetable' && <TimetableGrid semesterId={activeSemester} />}
                    {activeTab === 'lms' && <LMSPanel semesterId={activeSemester} />}
                    {activeTab === 'performance' && (
                        <PerformanceChart semesterId={activeSemester} timetableData={timetableData} />
                    )}
                </div>
            </div>
        </div>
    );
}
