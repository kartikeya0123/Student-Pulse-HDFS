#!/usr/bin/env python3
"""
MapReduce Execution Engine for StudentPulse.
Supports:
1. Native Python pipe simulation (Map -> Shuffle/Sort -> Reduce)
2. Standalone execution on local CSV or in-memory student records
3. Persisting final metrics to Supabase PostgreSQL table `analytics_results`
"""
import io
import sys
import subprocess
import os
from datetime import datetime

def run_local_pipeline(csv_data_or_path, persist_to_supabase=False):
    """
    Executes the MapReduce pipeline using mapper.py and reducer.py.
    """
    script_dir = os.path.dirname(os.path.abspath(__file__))
    mapper_path = os.path.join(script_dir, "mapper.py")
    reducer_path = os.path.join(script_dir, "reducer.py")

    # Read CSV text
    if os.path.exists(csv_data_or_path):
        with open(csv_data_or_path, "r", encoding="utf-8") as f:
            csv_content = f.read()
    else:
        csv_content = str(csv_data_or_path)

    # 1. Map Phase
    p_map = subprocess.Popen(
        [sys.executable, mapper_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    map_out, map_err = p_map.communicate(input=csv_content)
    if p_map.returncode != 0:
        raise RuntimeError(f"Mapper failed: {map_err}")

    # 2. Shuffle & Sort Phase
    sorted_lines = sorted(map_out.strip().split("\n"))
    sorted_input = "\n".join(sorted_lines) + "\n"

    # 3. Reduce Phase
    p_red = subprocess.Popen(
        [sys.executable, reducer_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    red_out, red_err = p_red.communicate(input=sorted_input)
    if p_red.returncode != 0:
        raise RuntimeError(f"Reducer failed: {red_err}")

    # Parse results
    results = {}
    for line in red_out.strip().split("\n"):
        parts = line.split("\t")
        if len(parts) >= 2:
            key = parts[0]
            try:
                val = float(parts[1])
                results[key] = val
            except ValueError:
                pass

    dataset_version = f"v_mapreduce_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    # Optionally persist to Supabase
    if persist_to_supabase:
        try:
            from supabase_client import get_supabase_client
            client = get_supabase_client()
            if client:
                rows = [
                    {
                        "metric_name": k,
                        "metric_value": v,
                        "dataset_version": dataset_version
                    }
                    for k, v in results.items()
                ]
                client.table("analytics_results").insert(rows).execute()
                print(f"[MapReduce] Persisted {len(rows)} metrics to Supabase analytics_results table.")
        except Exception as e:
            print(f"[MapReduce] Could not persist to Supabase: {e}")

    return {
        "dataset_version": dataset_version,
        "metrics": results,
        "raw_reduce_output": red_out,
        "timestamp": datetime.utcnow().isoformat() + "Z"
    }

if __name__ == "__main__":
    sample_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_students.csv")
    if os.path.exists(sample_file):
        out = run_local_pipeline(sample_file)
        print("MapReduce Results:", out["metrics"])
    else:
        print("Please provide a CSV file path.")
