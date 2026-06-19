import os
import json
import re

def fix_json_file(filepath):
    """Fix JSON files by removing incorrect escapes and handling Chinese quotes properly."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Remove all backslash escapes that shouldn't be there
        content = content.replace('\\"', '"')
        content = content.replace('\\\\', '\\')

        # Parse and re-stringify to get valid JSON structure
        data = json.loads(content)

        # Convert back to JSON with proper formatting
        fixed_content = json.dumps(data, ensure_ascii=False, indent=2)

        # Write back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)

        print(f"✓ Fixed: {filepath}")
        return True

    except json.JSONDecodeError as e:
        print(f"✗ JSON Error in {filepath}: {e}")
        return False
    except Exception as e:
        print(f"✗ Error processing {filepath}: {e}")
        return False

def process_directory(directory):
    """Process all JSON files in directory recursively."""
    fixed_count = 0
    error_count = 0

    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.json'):
                filepath = os.path.join(root, file)
                if fix_json_file(filepath):
                    fixed_count += 1
                else:
                    error_count += 1

    print(f"\n{'='*60}")
    print(f"Total fixed: {fixed_count}")
    print(f"Total errors: {error_count}")
    print(f"{'='*60}")

if __name__ == "__main__":
    locales_dir = r"C:\Users\mch\Desktop\FYP\FYP-MoeyChingWei\client\src\i18n\locales"
    process_directory(locales_dir)
