import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'timetable.json');

// Helper: Read timetable data
function readTimetable() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { semesters: [] };
  }
}

// Helper: Write timetable data
function writeTimetable(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Helper: Check time slot overlap
function checkOverlap(newStart, newEnd, existingStart, existingEnd) {
  return newStart < existingEnd && newEnd > existingStart;
}

// Helper: Convert time string to minutes
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

// GET: Return full timetable
export async function GET() {
  const data = readTimetable();
  return NextResponse.json(data);
}

// POST: Add operations
export async function POST(request) {
  try {
    const body = await request.json();
    const { type } = body;
    const data = readTimetable();

    switch (type) {
      case 'add_semester': {
        const { id, name } = body;
        data.semesters.push({
          id,
          name,
          courses: []
        });
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Semester added' });
      }

      case 'add_course': {
        const { semesterId, course } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        semester.courses.push({
          ...course,
          schedule: course.schedule || [],
          assignments: course.assignments || [],
          grades: course.grades || []
        });
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Course added' });
      }

      case 'add_slot': {
        const { semesterId, courseId, slot } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }

        // Conflict detection
        const newStart = timeToMinutes(slot.start);
        const newEnd = timeToMinutes(slot.end);

        for (const sem of data.semesters) {
          for (const c of sem.courses) {
            for (const existingSlot of c.schedule) {
              if (existingSlot.day === slot.day) {
                const existingStart = timeToMinutes(existingSlot.start);
                const existingEnd = timeToMinutes(existingSlot.end);

                if (checkOverlap(newStart, newEnd, existingStart, existingEnd)) {
                  return NextResponse.json({
                    success: false,
                    error: `Conflict detected with ${c.code} on ${slot.day} at ${existingSlot.start}-${existingSlot.end}`
                  }, { status: 400 });
                }

                // Classroom occupancy check
                if (existingSlot.room === slot.room && checkOverlap(newStart, newEnd, existingStart, existingEnd)) {
                  return NextResponse.json({
                    success: false,
                    error: `Room ${slot.room} is already occupied on ${slot.day} at ${existingSlot.start}-${existingSlot.end}`
                  }, { status: 400 });
                }
              }
            }
          }
        }

        course.schedule.push(slot);
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Slot added' });
      }

      case 'add_assignment': {
        const { semesterId, courseId, assignment } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        course.assignments.push(assignment);
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Assignment added' });
      }

      case 'add_grade': {
        const { semesterId, courseId, grade } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        course.grades.push(grade);
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Grade added' });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid operation type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: Update operations
export async function PUT(request) {
  try {
    const body = await request.json();
    const { type } = body;
    const data = readTimetable();

    switch (type) {
      case 'update_slot': {
        const { semesterId, courseId, slotIndex, updates } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        if (slotIndex < 0 || slotIndex >= course.schedule.length) {
          return NextResponse.json({ success: false, error: 'Invalid slot index' }, { status: 400 });
        }
        course.schedule[slotIndex] = { ...course.schedule[slotIndex], ...updates };
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Slot updated' });
      }

      case 'submit_assignment': {
        const { semesterId, courseId, assignmentId, submitted } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        const assignment = course.assignments.find(a => a.id === assignmentId);
        if (!assignment) {
          return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
        }
        assignment.submitted = submitted;
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Assignment submission updated' });
      }

      case 'update_grade': {
        const { semesterId, courseId, assignmentId, grade } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        const assignment = course.assignments.find(a => a.id === assignmentId);
        if (!assignment) {
          return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
        }
        assignment.grade = grade;
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Grade updated' });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid operation type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Remove operations
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { type } = body;
    const data = readTimetable();

    switch (type) {
      case 'delete_slot': {
        const { semesterId, courseId, slotIndex } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        if (slotIndex < 0 || slotIndex >= course.schedule.length) {
          return NextResponse.json({ success: false, error: 'Invalid slot index' }, { status: 400 });
        }
        course.schedule.splice(slotIndex, 1);
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Slot deleted' });
      }

      case 'delete_assignment': {
        const { semesterId, courseId, assignmentId } = body;
        const semester = data.semesters.find(s => s.id === semesterId);
        if (!semester) {
          return NextResponse.json({ success: false, error: 'Semester not found' }, { status: 404 });
        }
        const course = semester.courses.find(c => c.id === courseId);
        if (!course) {
          return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 });
        }
        const assignmentIndex = course.assignments.findIndex(a => a.id === assignmentId);
        if (assignmentIndex === -1) {
          return NextResponse.json({ success: false, error: 'Assignment not found' }, { status: 404 });
        }
        course.assignments.splice(assignmentIndex, 1);
        writeTimetable(data);
        return NextResponse.json({ success: true, message: 'Assignment deleted' });
      }

      default:
        return NextResponse.json({ success: false, error: 'Invalid operation type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
