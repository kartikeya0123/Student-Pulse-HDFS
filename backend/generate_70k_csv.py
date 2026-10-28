#!/usr/bin/env python3
"""
Generates a realistic 70,000-student academic performance CSV dataset.
Uses seeded random distributions with realistic correlations between metrics.
"""
import csv
import random
import os
import math

SEED = 42
NUM_STUDENTS = 70000
OUTPUT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "sample_students.csv")

def clamp(val, lo=0.0, hi=100.0):
    return max(lo, min(hi, val))

def generate_dataset():
    rng = random.Random(SEED)
    
    with open(OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["StudentID", "Attendance", "StudyHours", "PreviousScore", "AssignmentMarks", "ExamMarks"])
        
        for i in range(1, NUM_STUDENTS + 1):
            student_id = f"STU{i:06d}"
            
            # Base academic profile archetype (creates realistic clusters)
            archetype = rng.random()
            
            if archetype < 0.08:
                # ~8% Very weak students
                base_att = rng.gauss(42, 10)
                base_study = rng.gauss(1.2, 0.6)
                base_prev = rng.gauss(35, 12)
            elif archetype < 0.20:
                # ~12% Struggling students
                base_att = rng.gauss(58, 8)
                base_study = rng.gauss(2.2, 0.8)
                base_prev = rng.gauss(48, 10)
            elif archetype < 0.45:
                # ~25% Below-average students
                base_att = rng.gauss(68, 7)
                base_study = rng.gauss(3.2, 0.9)
                base_prev = rng.gauss(58, 8)
            elif archetype < 0.75:
                # ~30% Average students
                base_att = rng.gauss(78, 6)
                base_study = rng.gauss(4.5, 1.0)
                base_prev = rng.gauss(70, 7)
            elif archetype < 0.92:
                # ~17% Good students
                base_att = rng.gauss(88, 5)
                base_study = rng.gauss(5.8, 0.8)
                base_prev = rng.gauss(80, 6)
            else:
                # ~8% Excellent students
                base_att = rng.gauss(95, 3)
                base_study = rng.gauss(7.0, 0.7)
                base_prev = rng.gauss(90, 4)
            
            attendance = round(clamp(base_att), 1)
            study_hours = round(clamp(base_study, 0.0, 10.0), 1)
            previous_score = round(clamp(base_prev), 1)
            
            # Assignment marks correlate with study hours and previous score
            assignment_noise = rng.gauss(0, 5)
            assignment_marks = round(clamp(
                0.4 * previous_score + 0.3 * (study_hours * 12) + 0.3 * attendance * 0.8 + assignment_noise
            ), 1)
            
            # Exam marks: primary outcome, correlated with all factors + noise
            exam_noise = rng.gauss(0, 6)
            exam_marks = round(clamp(
                0.30 * previous_score +
                0.25 * assignment_marks +
                0.20 * (study_hours * 11) +
                0.15 * attendance * 0.9 +
                0.10 * rng.gauss(60, 15) +
                exam_noise
            ), 1)
            
            # Small chance (~1.5%) of missing data to test data quality panel
            if rng.random() < 0.005:
                attendance = ""
            if rng.random() < 0.005:
                study_hours = ""
            if rng.random() < 0.005:
                exam_marks = ""
            
            writer.writerow([student_id, attendance, study_hours, previous_score, assignment_marks, exam_marks])
    
    print(f"Generated {NUM_STUDENTS:,} student records -> {OUTPUT_PATH}")
    print(f"File size: {os.path.getsize(OUTPUT_PATH) / 1024:.1f} KB")

if __name__ == "__main__":
    generate_dataset()
