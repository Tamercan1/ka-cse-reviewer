import json
def get_dupes(filename):
    with open(filename, encoding='utf-8') as f:
        data = json.load(f)
    seen = {}
    for x in data:
        q_norm = x['question'].lower().strip()
        is_generic = 'choose the correct sentence' in q_norm or 'arrange the sentence logically' in q_norm
        k = q_norm if not is_generic else q_norm + str(sorted(x['choices']))
        if k in seen:
            print(f"DUPLICATE in {filename}: {x['id']} is duplicate of {seen[k]['id']}")
            print(f"  1: {seen[k]}")
            print(f"  2: {x}")
        else:
            seen[k] = x
get_dupes('data/analytical.json')
get_dupes('data/clerical.json')
get_dupes('data/verbal.json')
