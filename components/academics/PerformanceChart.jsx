'use client';

export default function PerformanceChart({ semesterId, timetableData }) {
    if (!timetableData) return null;

    const semester = timetableData.semesters?.find(s => s.id === semesterId);
    if (!semester) return null;

    // Calculate GPA
    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCourses = 0;

        semester.courses.forEach(course => {
            if (course.grades.length > 0) {
                const avgScore = course.grades.reduce((sum, g) => sum + (g.score / g.max) * 100, 0) / course.grades.length;

                let gradePoint = 0;
                if (avgScore >= 90) gradePoint = 10;
                else if (avgScore >= 80) gradePoint = 8;
                else if (avgScore >= 70) gradePoint = 6;
                else if (avgScore >= 60) gradePoint = 4;
                else gradePoint = 0;

                totalPoints += gradePoint;
                totalCourses++;
            }
        });

        return totalCourses > 0 ? (totalPoints / totalCourses).toFixed(2) : 0;
    };

    // Calculate submission rate
    const calculateSubmissionRate = () => {
        let totalAssignments = 0;
        let submittedAssignments = 0;

        semester.courses.forEach(course => {
            totalAssignments += course.assignments.length;
            submittedAssignments += course.assignments.filter(a => a.submitted).length;
        });

        return totalAssignments > 0 ? ((submittedAssignments / totalAssignments) * 100).toFixed(0) : 0;
    };

    // Get course grades
    const getCourseGrades = () => {
        return semester.courses
            .filter(c => c.grades.length > 0)
            .map(course => {
                const avgScore = course.grades.reduce((sum, g) => sum + (g.score / g.max) * 100, 0) / course.grades.length;
                return {
                    code: course.code,
                    score: avgScore.toFixed(1)
                };
            });
    };

    // Calculate achievements
    const calculateAchievements = () => {
        const achievements = [];
        const gpa = parseFloat(calculateGPA());

        // Top Performer
        if (gpa > 8) {
            achievements.push({
                icon: '🏆',
                title: 'Top Performer',
                description: 'GPA above 8.0'
            });
        }

        // On Time
        let onTimeCount = 0;
        semester.courses.forEach(course => {
            course.assignments.forEach(assignment => {
                if (assignment.submitted) {
                    const dueDate = new Date(assignment.dueDate);
                    const today = new Date();
                    if (today <= dueDate) onTimeCount++;
                }
            });
        });

        if (onTimeCount >= 5) {
            achievements.push({
                icon: '🎯',
                title: 'On Time',
                description: `${onTimeCount} assignments submitted before deadline`
            });
        }

        // Consistent
        let totalAssignments = 0;
        let submittedAssignments = 0;
        semester.courses.forEach(course => {
            totalAssignments += course.assignments.length;
            submittedAssignments += course.assignments.filter(a => a.submitted).length;
        });

        if (totalAssignments > 0 && submittedAssignments === totalAssignments) {
            achievements.push({
                icon: '📚',
                title: 'Consistent',
                description: 'No missed submissions'
            });
        }

        return achievements;
    };

    const gpa = calculateGPA();
    const submissionRate = calculateSubmissionRate();
    const courseGrades = getCourseGrades();
    const achievements = calculateAchievements();

    return (
        <div className="space-y-6">
            {/* GPA Card */}
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-8 text-center">
                <p className="text-sm text-gray-400 mb-2">Current GPA</p>
                <h2 className="text-6xl font-bold text-white mb-2">{gpa}</h2>
                <p className="text-xs text-gray-500">out of 10.0</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Submission Rate */}
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">Submission Rate</h3>
                    <div className="relative h-4 bg-gray-700/50 rounded-full overflow-hidden mb-2">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                            style={{ width: `${submissionRate}%` }}
                        ></div>
                    </div>
                    <p className="text-2xl font-bold text-white">{submissionRate}%</p>
                </div>

                {/* Total Courses */}
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-4">Enrolled Courses</h3>
                    <p className="text-4xl font-bold text-white">{semester.courses.length}</p>
                    <p className="text-xs text-gray-500 mt-2">
                        {semester.courses.filter(c => c.grades.length > 0).length} with grades
                    </p>
                </div>
            </div>

            {/* Course Grades Bar Chart */}
            {courseGrades.length > 0 && (
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Course Performance</h3>
                    <div className="space-y-3">
                        {courseGrades.map((course, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-gray-400">{course.code}</span>
                                    <span className="text-sm font-semibold text-white">{course.score}%</span>
                                </div>
                                <div className="relative h-3 bg-gray-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`absolute top-0 left-0 h-full transition-all duration-500 ${course.score >= 90
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                : course.score >= 80
                                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                                    : course.score >= 70
                                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                        : 'bg-gradient-to-r from-red-500 to-pink-500'
                                            }`}
                                        style={{ width: `${course.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Achievement Badges */}
            {achievements.length > 0 && (
                <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Achievements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-[20px] p-4 text-center hover:scale-105 transition-transform duration-300"
                            >
                                <div className="text-4xl mb-2">{achievement.icon}</div>
                                <h4 className="text-white font-semibold mb-1">{achievement.title}</h4>
                                <p className="text-xs text-gray-400">{achievement.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Grade Scale Reference */}
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-[28px] p-6">
                <h3 className="text-sm font-semibold text-white mb-3">Grade Scale</h3>
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                    <div>
                        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-2 mb-1">
                            <p className="text-white font-semibold">A</p>
                        </div>
                        <p className="text-gray-500">90+ = 10</p>
                    </div>
                    <div>
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-2 mb-1">
                            <p className="text-white font-semibold">B</p>
                        </div>
                        <p className="text-gray-500">80+ = 8</p>
                    </div>
                    <div>
                        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 mb-1">
                            <p className="text-white font-semibold">C</p>
                        </div>
                        <p className="text-gray-500">70+ = 6</p>
                    </div>
                    <div>
                        <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg p-2 mb-1">
                            <p className="text-white font-semibold">D</p>
                        </div>
                        <p className="text-gray-500">60+ = 4</p>
                    </div>
                    <div>
                        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 mb-1">
                            <p className="text-white font-semibold">F</p>
                        </div>
                        <p className="text-gray-500">&lt;60 = 0</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
