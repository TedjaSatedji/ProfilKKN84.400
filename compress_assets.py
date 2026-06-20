import os
import shutil
import re
from PIL import Image

# Disable Pillow limit on image size to allow compression of massive resolution logo files
Image.MAX_IMAGE_PIXELS = None

# Configuration
WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(WORKSPACE_DIR, "assets")
BACKUP_DIR = os.path.join(WORKSPACE_DIR, "assets_backup")
FRONTEND_FILES = [
    os.path.join(WORKSPACE_DIR, "index.html"),
    os.path.join(WORKSPACE_DIR, "app.js"),
    os.path.join(WORKSPACE_DIR, "admin.html"),
    os.path.join(WORKSPACE_DIR, "admin.js")
]

# Image compression settings based on folder
TARGET_WIDTHS = {
    "team": 2080,         # Exact 1/3 scale of 6240x4160. Preserves aspect ratio.
    "profilepic": 500,   # Square avatars resolution.
    "logo": 600,         # Max dimension for logo icons.
    "default": 1200
}

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".JPG", ".PNG", ".JPEG"}

def backup_assets():
    print(f"Creating backup of assets to: {BACKUP_DIR}")
    if os.path.exists(BACKUP_DIR):
        print("Backup directory already exists. Skipping backup to prevent overwriting older originals.")
        return True
    try:
        shutil.copytree(ASSETS_DIR, BACKUP_DIR)
        print("Backup created successfully.")
        return True
    except Exception as e:
        print(f"Failed to create backup: {e}")
        return False

def compress_image(file_path):
    # Determine the target dimension based on parent folder name
    parent_dir = os.path.basename(os.path.dirname(file_path)).lower()
    target_dim = TARGET_WIDTHS.get(parent_dir, TARGET_WIDTHS["default"])
    
    orig_size = os.path.getsize(file_path)
    
    try:
        with Image.open(file_path) as img:
            width, height = img.size
            
            # Proportional resizing
            if parent_dir == "profilepic":
                # Profile pics are square. Force crop or proportional resize to max 500px
                max_dim = max(width, height)
                if max_dim > target_dim:
                    scale = target_dim / max_dim
                    new_size = (int(width * scale), int(height * scale))
                    img = img.resize(new_size, Image.Resampling.LANCZOS)
            else:
                # Resize by width if larger than target width
                if width > target_dim:
                    new_height = int((target_dim / width) * height)
                    img = img.resize((target_dim, new_height), Image.Resampling.LANCZOS)
            
            # Generate new webp path
            base, _ = os.path.splitext(file_path)
            webp_path = base + ".webp"
            
            # Save as WebP
            # WebP quality 82 is an excellent balance of size and quality
            img.save(webp_path, "WEBP", quality=82)
            
            new_size = os.path.getsize(webp_path)
            return webp_path, orig_size, new_size
            
    except Exception as e:
        print(f"Error compressing {file_path}: {e}")
        return None, 0, 0

def process_assets():
    if not os.path.exists(ASSETS_DIR):
        print(f"Assets directory not found at: {ASSETS_DIR}")
        return {}

    converted_files = {} # mapping of old relative path to new relative path
    total_orig_bytes = 0
    total_new_bytes = 0
    
    print("\nProcessing images...")
    for root, _, files in os.walk(ASSETS_DIR):
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in IMAGE_EXTENSIONS:
                full_path = os.path.join(root, file)
                
                # Check relative path
                rel_old_path = os.path.relpath(full_path, WORKSPACE_DIR).replace("\\", "/")
                
                print(f"Compressing: {rel_old_path}...", end="", flush=True)
                webp_path, orig_size, new_size = compress_image(full_path)
                
                if webp_path:
                    rel_new_path = os.path.relpath(webp_path, WORKSPACE_DIR).replace("\\", "/")
                    converted_files[rel_old_path] = rel_new_path
                    total_orig_bytes += orig_size
                    total_new_bytes += new_size
                    
                    # Delete original file to free space
                    os.remove(full_path)
                    
                    saved = orig_size - new_size
                    saved_pct = (saved / orig_size) * 100 if orig_size > 0 else 0
                    print(f" DONE. Saved: {saved/1024/1024:.2f}MB ({saved_pct:.1f}%)")
                else:
                    print(" FAILED.")
                    
    # Print summary
    if total_orig_bytes > 0:
        saved_total = total_orig_bytes - total_new_bytes
        saved_pct = (saved_total / total_orig_bytes) * 100
        print(f"\n=========================================")
        print(f"COMPRESSION SUMMARY:")
        print(f"Original Assets Size: {total_orig_bytes/1024/1024:.2f} MB")
        print(f"Compressed Assets Size: {total_new_bytes/1024/1024:.2f} MB")
        print(f"Total Space Saved: {saved_total/1024/1024:.2f} MB ({saved_pct:.1f}%)")
        print(f"=========================================\n")
    else:
        print("\nNo original assets found to compress.")
        
    return converted_files

def update_codebase_references(file_mappings):
    if not file_mappings:
        print("No files converted. References update skipped.")
        return

    print("Updating file references in codebase...")
    
    # Sort mappings by length of key in descending order to avoid partial path replacement issues
    sorted_mappings = sorted(file_mappings.items(), key=lambda x: len(x[0]), reverse=True)
    
    for file_path in FRONTEND_FILES:
        if not os.path.exists(file_path):
            continue
            
        print(f"Updating references in: {os.path.basename(file_path)}")
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                
            updated_content = content
            replacements_count = 0
            
            for old_path, new_path in sorted_mappings:
                # We need to replace references to the file.
                # References can be direct: "assets/team/DSCF4365.JPG"
                # Or sometimes just the filename depending on the context: "DSCF4365.JPG"
                old_filename = os.path.basename(old_path)
                new_filename = os.path.basename(new_path)
                
                # Replace exact relative paths first
                if old_path in updated_content:
                    updated_content = updated_content.replace(old_path, new_path)
                    replacements_count += 1
                
                # Replace exact filenames (to catch app.js references like "albet.JPG" inside profilepic)
                # But only if it has a common image extension to avoid replacing arbitrary words
                if old_filename in updated_content:
                    updated_content = updated_content.replace(old_filename, new_filename)
                    replacements_count += 1
            
            if replacements_count > 0:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(updated_content)
                print(f" -> Completed. Made {replacements_count} replacements.")
            else:
                print(" -> No references found.")
                
        except Exception as e:
            print(f"Failed to update references in {file_path}: {e}")

if __name__ == "__main__":
    print("=== KKN Asset Optimizer & WebP Converter ===")
    if backup_assets():
        mappings = process_assets()
        update_codebase_references(mappings)
        print("Optimization complete!")
    else:
        print("Asset optimization aborted due to backup failure.")
