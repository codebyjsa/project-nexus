/**
 * Academics Page - Placeholder
 * Owner: SEHAJ
 * Features: Timetable, Grades
 */

'use client';

import Card from '@/components/ui/Card';

export default function AcademicsPage() {
    return (
        <div className="container pt-lg">
            <div className="mb-lg">
                <h1 className="h2 flex items-center gap-sm">
                    <span>📚</span>
                    <span>Academics</span>
                </h1>
                <p className="text-secondary">
                    Timetable, Grades & Courses
                </p>
            </div>

            <Card variant="glass" className="text-center py-2xl">
                <div className="text-5xl mb-md">🚧</div>
                <h3 className="h3 mb-sm">Coming Soon</h3>
                <p className="text-tertiary mb-md">
                    This section is being built by <strong>Sehaj</strong>
                </p>
                <div className="flex justify-center gap-md flex-wrap">
                    <span className="badge badge-info">📅 Timetable</span>
                    <span className="badge badge-warning">📊 Grades</span>
                    <span className="badge badge-success">📖 Courses</span>
                </div>
            </Card>
        </div>
    );
}
