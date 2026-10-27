#!/usr/bin/env python3
"""
Hadoop MapReduce Mapper for Student Academic Dataset.
Reads CSV rows from sys.stdin and emits key-value pairs:
<metric_name>\t<metric_value>
"""
import sys
import csv

def main():
    reader = csv.reader(sys.stdin)
    first_row = True
    for row in reader:
        if not row or len(row) < 6:
            continue
        
        # Skip header row if present
        if first_row:
            first_row = False
            if "studentid" in row[0].lower() or "student" in row[0].lower():
                continue

        try:
            student_id = row[0].strip()
            attendance = float(row[1]) if row[1].strip() else None
            study_hours = float(row[2]) if row[2].strip() else None
            previous_score = float(row[3]) if row[3].strip() else None
            assignment_marks = float(row[4]) if row[4].strip() else None
            exam_marks = float(row[5]) if row[5].strip() else None

            if attendance is not None and 0 <= attendance <= 100:
                print(f"attendance\t{attendance}")
            if study_hours is not None and study_hours >= 0:
                print(f"study_hours\t{study_hours}")
            if previous_score is not None and 0 <= previous_score <= 100:
                print(f"previous_score\t{previous_score}")
            if assignment_marks is not None and 0 <= assignment_marks <= 100:
                print(f"assignment_marks\t{assignment_marks}")
            if exam_marks is not None and 0 <= exam_marks <= 100:
                print(f"exam_marks\t{exam_marks}")
                # Pass/Fail metric (1 = pass, 0 = fail)
                passed = 1.0 if exam_marks >= 40.0 else 0.0
                print(f"pass_count\t{passed}")
                print(f"total_students\t1.0")

        except (ValueError, IndexError):
            continue

if __name__ == "__main__":
    main()
