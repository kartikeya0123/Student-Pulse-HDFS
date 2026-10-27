#!/usr/bin/env python3
"""
Hadoop MapReduce Reducer for Student Academic Dataset.
Reads sorted key-value pairs from sys.stdin:
<metric_name>\t<metric_value>
Computes count, sum, average, min, and max for each metric.
"""
import sys

def main():
    current_key = None
    metric_sum = 0.0
    metric_count = 0
    metric_min = float('inf')
    metric_max = float('-inf')

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        parts = line.split('\t')
        if len(parts) != 2:
            continue

        key, val_str = parts
        try:
            val = float(val_str)
        except ValueError:
            continue

        if current_key == key:
            metric_sum += val
            metric_count += 1
            if val < metric_min:
                metric_min = val
            if val > metric_max:
                metric_max = val
        else:
            if current_key:
                emit_result(current_key, metric_sum, metric_count, metric_min, metric_max)

            current_key = key
            metric_sum = val
            metric_count = 1
            metric_min = val
            metric_max = val

    if current_key and metric_count > 0:
        emit_result(current_key, metric_sum, metric_count, metric_min, metric_max)

def emit_result(key, metric_sum, count, metric_min, metric_max):
    avg = metric_sum / count
    if key == "pass_count":
        print(f"pass_rate\t{round(avg * 100, 2)}\t{count}")
    elif key == "total_students":
        print(f"total_students\t{count}\t{count}")
    else:
        print(f"avg_{key}\t{round(avg, 2)}\t{count}")
        if key == "exam_marks":
            print(f"highest_exam\t{round(metric_max, 2)}\t{count}")
            print(f"lowest_exam\t{round(metric_min, 2)}\t{count}")

if __name__ == "__main__":
    main()
