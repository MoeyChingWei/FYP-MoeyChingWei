#!/usr/bin/env python3
"""
Phase 4 - Batch update remaining files with message and validation translations
"""
import os
import re

# Files already manually updated - skip these
SKIP_FILES = [
    'Profile.tsx',
    'ProfileResetPassword.tsx',
    'CreateUser.tsx',
    'Notifications.tsx',  # System notifications - keep English
]

# Base directory
BASE_DIR = r'C:\Users\mch\Desktop\FYP\FYP-MoeyChingWei\client\src\FrontEnd'

# Message translation mappings
MESSAGE_MAPPINGS = {
    # Generic patterns
    r'message\.success\(["\']([^"\']+)["\']\)': lambda m: f"message.success(tMsg('success.save'))",
    r'message\.error\(["\']([^"\']+)["\']\)': lambda m: f"message.error(tMsg('error.operationFailed'))",
    r'message\.warning\(["\']([^"\']+)["\']\)': lambda m: f"message.warning(tMsg('warning.unsavedChanges'))",
    r'message\.info\(["\']([^"\']+)["\']\)': lambda m: f"message.info(tMsg('info.processing'))",
}

def needs_translation_import(content):
    """Check if file needs messages/validation imports"""
    has_message_call = re.search(r'message\.(success|error|warning|info)\(', content)
    has_validation_rule = re.search(r'rules=\[.*?required.*?message:', content, re.DOTALL)
    has_translation_import = 'useTranslation' in content

    return has_translation_import and (has_message_call or has_validation_rule)

def add_translation_imports(content):
    """Add tMsg and tVal imports if needed"""
    # Check if already has tMsg
    if "t: tMsg" in content or "tMsg" in content:
        return content

    # Find existing useTranslation line
    pattern = r"(const \{ t \} = useTranslation\(['\"](\w+)['\"]\);)"
    match = re.search(pattern, content)

    if match:
        old_line = match.group(1)
        namespace = match.group(2)
        new_lines = f"const {{ t }} = useTranslation('{namespace}');\n  const {{ t: tMsg }} = useTranslation('messages');\n  const {{ t: tVal }} = useTranslation('validation');"
        content = content.replace(old_line, new_lines)

    return content

def update_message_calls(content):
    """Update message.success/error/warning/info calls"""

    # Success messages
    content = re.sub(
        r'message\.success\(t\(["\'][\w.]+\.messages\.(\w+Success|saved|created|updated|deleted)["\'].*?\)\)',
        "message.success(tMsg('success.save'))",
        content
    )
    content = re.sub(
        r'message\.success\(t\(["\'][\w.]+\.messages\.(create|update|save|upload)Success["\'].*?\)\)',
        lambda m: f"message.success(tMsg('success.{m.group(1)}'))",
        content
    )

    # Error messages
    content = re.sub(
        r'message\.error\(t\(["\'][\w.]+\.messages\.(\w+Failed|error)["\'].*?\)\)',
        "message.error(tMsg('error.operationFailed'))",
        content
    )
    content = re.sub(
        r'message\.error\(t\(["\'][\w.]+\.messages\.(create|update|save|upload|load)Failed["\'].*?\)\)',
        lambda m: f"message.error(tMsg('error.{m.group(1)}'))",
        content
    )

    # Warning messages
    content = re.sub(
        r'message\.warning\(t\(["\'][\w.]+\.messages\.\w+["\'].*?\)\)',
        "message.warning(tMsg('warning.unsavedChanges'))",
        content
    )

    # Info messages
    content = re.sub(
        r'message\.info\(t\(["\'][\w.]+\.messages\.\w+["\'].*?\)\)',
        "message.info(tMsg('info.processing'))",
        content
    )

    return content

def update_validation_rules(content):
    """Update validation rules to use tVal"""

    # Required field
    content = re.sub(
        r'\{ required: true, message: t\(["\'][\w.]+validation\.(\w+)Required["\']\) \}',
        "{ required: true, message: tVal('required') }",
        content
    )

    # Email validation
    content = re.sub(
        r'\{ type: ["\']email["\'], message: t\(["\'][\w.]+validation\.emailInvalid["\']\) \}',
        "{ type: 'email', message: tVal('email.invalid') }",
        content
    )

    # Min length
    content = re.sub(
        r'\{ min: (\d+), message: t\(["\'][\w.]+validation\.\w+MinLength["\']\) \}',
        lambda m: f"{{ min: {m.group(1)}, message: tVal('string.minLength', {{ min: {m.group(1)} }}) }}",
        content
    )

    return content

def process_file(filepath):
    """Process a single file"""
    filename = os.path.basename(filepath)

    # Skip if in skip list
    if filename in SKIP_FILES:
        print(f"  Skipping {filename} (already updated or excluded)")
        return False

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Check if needs translation
        if not needs_translation_import(content):
            return False

        # Add translation imports
        content = add_translation_imports(content)

        # Update message calls
        content = update_message_calls(content)

        # Update validation rules
        content = update_validation_rules(content)

        # Write back if changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ Updated {filename}")
            return True

        return False

    except Exception as e:
        print(f"  ✗ Error processing {filename}: {e}")
        return False

def main():
    """Main processing function"""
    print("Phase 4: Updating message and validation translations...")
    print()

    updated_count = 0
    processed_count = 0

    # Walk through all TypeScript/TSX files
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith(('.tsx', '.ts')) and not file.endswith('.test.tsx'):
                filepath = os.path.join(root, file)
                processed_count += 1

                if process_file(filepath):
                    updated_count += 1

    print()
    print(f"Processed {processed_count} files")
    print(f"Updated {updated_count} files")
    print()
    print("Manual review recommended for:")
    print("  - Complex validation rules")
    print("  - Custom error messages")
    print("  - Modal.confirm dialogs")

if __name__ == '__main__':
    main()
