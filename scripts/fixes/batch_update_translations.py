#!/usr/bin/env python3
"""
Batch update Phase 4 translation files
Adds useTranslation hook and replaces message.* calls with translated versions
"""

import re
import os
from pathlib import Path

# List of files to update
FILES_TO_UPDATE = [
    "client/src/FrontEnd/pages/DashboardNew.tsx",
    "client/src/FrontEnd/pages/ResetPassword.tsx",
    "client/src/FrontEnd/pages/ForgetPassword.tsx",
    "client/src/FrontEnd/pages/settings/FeedbackSubmodule.tsx",
    "client/src/FrontEnd/pages/settings/CompanyAddressSubmodule.tsx",
    "client/src/FrontEnd/pages/categorySelection/LookupKindTable.tsx",
    "client/src/FrontEnd/pages/purchasing/GoodsReceivedNoteDetailSubmodule.tsx",
    "client/src/FrontEnd/pages/purchasing/PurchaseOrderApprovalDetail.tsx",
    "client/src/FrontEnd/pages/purchasing/PurchaseOrderApproval.tsx",
    "client/src/FrontEnd/pages/purchasing/PurchaseOrderReviewDetail.tsx",
    "client/src/FrontEnd/pages/purchasing/PurchaseOrderReview.tsx",
    "client/src/FrontEnd/pages/purchasing/PurchaseOrderCreation.tsx",
    "client/src/FrontEnd/pages/purchasing/ApprovalDetailSubmodule.tsx",
    "client/src/FrontEnd/pages/purchasing/ApprovalSubmodule.tsx",
    "client/src/FrontEnd/pages/purchasing/ReviewDetailSubmodule.tsx",
    "client/src/FrontEnd/pages/purchasing/ReviewSubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/CreateDeliveryFromGrnSubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/DeliveryDetailSubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/DeliverySubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/OrderAcknowledgementDetailSubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/OrderAcknowledgementSubmodule.tsx",
    "client/src/FrontEnd/pages/supplierFulfillment/SupplierFulfillmentHome.tsx",
    "client/src/FrontEnd/pages/userAccess/rbac/Roles.tsx",
    "client/src/FrontEnd/pages/userAccess/users/UserList.tsx",
    "client/src/FrontEnd/pages/userAccess/users/SupplierTypeSubmodule.tsx",
    "client/src/FrontEnd/components/purchasing/CreatableLookupSelect.tsx",
    "client/src/FrontEnd/components/ChatBot/ChatWindow.tsx",
    "client/src/FrontEnd/components/ChatBot/MultiAgentChatWindowEnhanced.tsx",
    "client/src/FrontEnd/components/ChatBot/AgentCollaboration.tsx",
    "client/src/FrontEnd/components/ChatBot/VoiceInput.tsx",
    "client/src/FrontEnd/components/ChatBot/ExportChat.tsx",
    "client/src/FrontEnd/components/ChatBot/SessionHistory.tsx",
    "client/src/FrontEnd/components/ChatBot/MultiAgentChatWindow.tsx",
    "client/src/FrontEnd/components/ChatBot/AgentSelector.tsx",
]

def add_translation_import(content):
    """Add useTranslation import if not present"""
    if 'useTranslation' in content:
        return content, False

    # Find the last import statement
    import_pattern = r'(import .+ from ["\'].+["\'];?\n)'
    imports = list(re.finditer(import_pattern, content))

    if imports:
        last_import = imports[-1]
        insert_pos = last_import.end()
        new_import = 'import { useTranslation } from "react-i18next";\n'
        content = content[:insert_pos] + new_import + content[insert_pos:]
        return content, True

    return content, False

def add_translation_hook(content):
    """Add const { t: tMsg } hook in component function"""
    if "t: tMsg" in content or "t:tMsg" in content:
        return content, False

    # Pattern to find component function start
    # Look for function ComponentName() or const ComponentName = () =>
    patterns = [
        r'(export default function \w+\([^)]*\)[^{]*\{)',
        r'(const \w+ = \([^)]*\)[^{]*=> \{)',
        r'(function \w+\([^)]*\)[^{]*\{)',
    ]

    for pattern in patterns:
        match = re.search(pattern, content)
        if match:
            insert_pos = match.end()
            # Add the hook right after function start
            hook_code = '\n  const { t: tMsg } = useTranslation(\'messages\');\n'
            content = content[:insert_pos] + hook_code + content[insert_pos:]
            return content, True

    return content, False

def replace_message_calls(content):
    """Replace message.success/error/warning/info calls"""
    replacements = {
        r'message\.success\(["\']([^"\']+)["\']\)': r"message.success(tMsg('success.save'))",
        r'message\.error\(["\']([^"\']+)["\']\)': r"message.error(tMsg('error.operationFailed'))",
        r'message\.warning\(["\']([^"\']+)["\']\)': r"message.warning(tMsg('warning.general'))",
        r'message\.info\(["\']([^"\']+)["\']\)': r"message.info(tMsg('info.general'))",
    }

    changed = False
    for pattern, replacement in replacements.items():
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            changed = True

    # Handle error messages with fallback: err?.message ?? "text"
    fallback_pattern = r'message\.(error|warning)\(err\?\.message \?\? ["\']([^"\']+)["\']\)'
    if re.search(fallback_pattern, content):
        content = re.sub(
            fallback_pattern,
            r"message.\1(err?.message ?? tMsg('error.operationFailed'))",
            content
        )
        changed = True

    return content, changed

def process_file(file_path):
    """Process a single file"""
    full_path = Path(file_path)

    if not full_path.exists():
        print(f"❌ File not found: {file_path}")
        return False

    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        changes_made = []

        # Step 1: Add import
        content, changed = add_translation_import(content)
        if changed:
            changes_made.append("Added import")

        # Step 2: Add hook
        content, changed = add_translation_hook(content)
        if changed:
            changes_made.append("Added hook")

        # Step 3: Replace message calls
        content, changed = replace_message_calls(content)
        if changed:
            changes_made.append("Replaced messages")

        if content != original_content:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Updated: {file_path} ({', '.join(changes_made)})")
            return True
        else:
            print(f"⏭️  Skipped (no changes needed): {file_path}")
            return False

    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    print("=" * 60)
    print("Phase 4 Translation Batch Update")
    print("=" * 60)
    print()

    base_dir = Path(__file__).parent
    os.chdir(base_dir)

    total = len(FILES_TO_UPDATE)
    updated = 0
    skipped = 0
    errors = 0

    for file_path in FILES_TO_UPDATE:
        result = process_file(file_path)
        if result is True:
            updated += 1
        elif result is False:
            skipped += 1
        else:
            errors += 1

    print()
    print("=" * 60)
    print(f"Summary: {updated} updated, {skipped} skipped, {errors} errors out of {total} files")
    print("=" * 60)
    print()
    print("⚠️  IMPORTANT: Manual review recommended for:")
    print("   - Complex validation rules")
    print("   - Custom error messages with specific wording")
    print("   - Context-specific translations")
    print()
    print("Next steps:")
    print("1. Review the changes")
    print("2. Run: cd client && npm run build")
    print("3. Test in browser with language switching")

if __name__ == "__main__":
    main()
