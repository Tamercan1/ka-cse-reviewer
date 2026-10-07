import json
import os
import glob

data_dir = 'data'
json_files = glob.glob(os.path.join(data_dir, '*.json'))

for f in json_files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            data = json.load(file)
            print(f"--- File: {os.path.basename(f)} ---")
            print(f"Number of records: {len(data)}")
            if len(data) > 0:
                print(f"Type: {type(data)}")
                if isinstance(data, list):
                    first_record = data[0]
                    print(f"Schema (keys of first item): {list(first_record.keys())}")
                    if 'type' in first_record:
                        types = set(item.get('type') for item in data)
                        print(f"Question types found: {types}")
                elif isinstance(data, dict):
                    print(f"Schema (keys of dict): {list(data.keys())[:5]} ... (truncated)")
                    first_val = next(iter(data.values()))
                    if isinstance(first_val, list) and len(first_val) > 0:
                        print(f"Schema of list item (keys): {list(first_val[0].keys())}")
            print()
    except Exception as e:
        print(f"Error reading {f}: {e}")
