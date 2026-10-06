import json
import os
import glob
import re
from collections import defaultdict

def check_string(s):
    issues = []
    if not isinstance(s, str):
        return ["Not a string"]
    if not s.strip():
        return ["Empty or whitespace only"]
    if s != s.strip():
        issues.append("Leading/trailing whitespace")
    if '  ' in s:
        issues.append("Excessive whitespace")
    if '&' in s and (';' in s or '#' in s):
         issues.append("Contains HTML entities")
    return issues

def audit_quiz_file(filepath):
    print(f"\n======================\nAuditing {filepath}\n======================")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"CRITICAL: Failed to load JSON - {e}")
        return

    ids = set()
    question_choice_hash = set()
    
    issues = defaultdict(list)
    
    required_keys = {'id', 'question', 'choices', 'answer', 'explanation'}
    
    for i, item in enumerate(data):
        item_id = item.get('id', f"INDEX_{i}")
        
        # Check required fields
        keys = set(item.keys())
        if keys != required_keys:
            issues['schema'].append(f"{item_id}: Keys mismatch. Found {keys}")
        
        # Check IDs
        if item_id in ids:
            issues['duplicate_id'].append(item_id)
        ids.add(item_id)
        
        # String checks
        for k in ['id', 'question', 'answer', 'explanation']:
            val = item.get(k)
            str_issues = check_string(val)
            if str_issues:
                issues['formatting'].append(f"{item_id} [{k}]: {', '.join(str_issues)}")
        
        # Check choices
        choices = item.get('choices', [])
        if not isinstance(choices, list):
            issues['schema'].append(f"{item_id}: choices is not a list")
        else:
            if len(choices) != 4:
                issues['choices'].append(f"{item_id}: expected 4 choices, got {len(choices)}")
            
            # For intentional duplicates, we ignore cler_15 and cler_34
            if len(set(choices)) != len(choices) and item_id not in ['cler_15', 'cler_34']:
                issues['choices'].append(f"{item_id}: duplicate choices found - {choices}")
                
            for c in choices:
                str_issues = check_string(c)
                if str_issues:
                    issues['formatting'].append(f"{item_id} [choice]: '{c}' - {', '.join(str_issues)}")
            
            # Answer key check
            answer = item.get('answer')
            if answer not in choices:
                issues['invalid_answer'].append(f"{item_id}: Answer '{answer}' not in choices")
                
        # Duplicate questions
        q_text = item.get('question', '')
        if isinstance(q_text, str):
            q_norm = q_text.lower().strip()
            
            # A duplicate is same question + same choices
            q_hash = q_norm + str(sorted(choices))
            
            if q_hash in question_choice_hash:
                issues['duplicate_question'].append(f"{item_id}: Exact duplicate question/choices")
            question_choice_hash.add(q_hash)
            
            # Passage check
            if "read the passage" in q_norm or "\n\n" in q_text:
                paragraphs = [p for p in q_text.split('\n\n') if p.strip()]
                if len(paragraphs) >= 2:
                    passage_text = paragraphs[1].strip()
                    if not re.search(r'[.?!"]$', passage_text):
                        issues['suspicious_passage'].append(f"{item_id}: Passage doesn't end with proper punctuation: '{passage_text[-30:]}'")
    
    for category, errs in issues.items():
        if errs:
            print(f"\n--- {category.upper()} ({len(errs)}) ---")
            for e in errs[:10]:
                print(e)
            if len(errs) > 10:
                print(f"... and {len(errs) - 10} more")

def audit_vocabulary():
    print("\n======================\nAuditing Vocabulary Data\n======================")
    try:
        with open('data/vocabulary.json', 'r', encoding='utf-8') as f:
            vocab = json.load(f)
        with open('data/vocab-quiz.json', 'r', encoding='utf-8') as f:
            quiz = json.load(f)
    except Exception as e:
        print(f"CRITICAL: Failed to load vocabulary JSON - {e}")
        return

    vocab_words = {}
    issues = defaultdict(list)
    
    # Audit vocabulary.json
    for day_data in vocab:
        day = day_data.get('day')
        words = day_data.get('words', [])
        vocab_words[day] = set()
        
        for w in words:
            word = w.get('word')
            if not word:
                continue
            if word in vocab_words[day]:
                issues['vocab_duplicate'].append(f"Day {day}: Duplicate word '{word}'")
            vocab_words[day].add(word)
            
            for k in ['word', 'definition', 'example']:
                str_issues = check_string(w.get(k))
                if str_issues:
                    issues['formatting'].append(f"Day {day} [{word}] [{k}]: {', '.join(str_issues)}")
    
    # Audit vocab-quiz.json
    for day_data in quiz:
        day = day_data.get('day')
        questions = day_data.get('questions', [])
        
        valid_words_for_day = vocab_words.get(day, set())
        
        for q in questions:
            # check choices and answer
            choices = q.get('choices', [])
            answer = q.get('answer')
            if answer not in choices:
                issues['invalid_answer'].append(f"Vocab Quiz Day {day}: Answer '{answer}' not in choices")
            
            # Find which word is being tested
            tested_word = None
            if answer in valid_words_for_day:
                tested_word = answer
            else:
                for w in valid_words_for_day:
                    if w.lower() in q.get('question', '').lower() or any(w.lower() in c.lower() for c in choices):
                        tested_word = w
                        break
            
            if not tested_word:
                issues['vocab_mismatch'].append(f"Vocab Quiz Day {day}: Question does not test a word from Day {day}. Question: {q.get('question')[:50]}...")

    for category, errs in issues.items():
        if errs:
            print(f"\n--- {category.upper()} ({len(errs)}) ---")
            for e in errs[:10]:
                print(e)
            if len(errs) > 10:
                print(f"... and {len(errs) - 10} more")

if __name__ == "__main__":
    for f in glob.glob('data/*.json'):
        if f not in ['data\\vocabulary.json', 'data\\vocab-quiz.json']:
            audit_quiz_file(f)
    audit_vocabulary()
