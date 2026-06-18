import os
import glob
from PIL import Image

assets_dir = r"c:\Users\Tedja\Downloads\kkn\assets\team"
png_files = glob.glob(os.path.join(assets_dir, "DSCF4365*.png"))

print("Tracing precise polygon coordinates...")
for path in sorted(png_files):
    filename = os.path.basename(path)
    member_name = filename.replace("DSCF4365", "").replace(".png", "").lower()
    
    img = Image.open(path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    width, height = img.size
    pix = img.load()
    
    alpha = img.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        print(f"Member {member_name}: empty image.")
        continue
    
    left, upper, right, lower = bbox
    
    # Clamp coordinates to valid ranges
    left = max(0, left)
    upper = max(0, upper)
    right = min(width - 1, right)
    lower = min(height - 1, lower)
    
    # Sample X at intervals (e.g. 60 pixels)
    step = 80 # Larger step to simplify the SVG coordinates (fewer points)
    top_points = []
    bottom_points = []
    
    for x in range(left, right + 1, step):
        # Clamp x
        x_val = min(x, width - 1)
        y_top = None
        y_bottom = None
        
        # Scan from top
        for y in range(upper, lower + 1, 15):
            y_val = min(y, height - 1)
            if pix[x_val, y_val][3] > 20: # Alpha threshold
                y_top = y_val
                break
        
        # Scan from bottom
        for y in range(lower, upper - 1, -15):
            y_val = min(y, height - 1)
            if pix[x_val, y_val][3] > 20:
                y_bottom = y_val
                break
                
        if y_top is not None and y_bottom is not None:
            top_points.append((x_val, y_top))
            bottom_points.append((x_val, y_bottom))
            
    # Also append the exact rightmost edge boundary
    y_top_r = None
    y_bottom_r = None
    for y in range(upper, lower + 1, 15):
        y_val = min(y, height - 1)
        if pix[right, y_val][3] > 20:
            y_top_r = y_val
            break
    for y in range(lower, upper - 1, -15):
        y_val = min(y, height - 1)
        if pix[right, y_val][3] > 20:
            y_bottom_r = y_val
            break
    if y_top_r is not None:
        top_points.append((right, y_top_r))
        bottom_points.append((right, y_bottom_r))

    # Combine top points (left to right) and bottom points (right to left)
    polygon_points = top_points + list(reversed(bottom_points))
    
    # Format as SVG points string
    points_str = " ".join([f"{p[0]},{p[1]}" for p in polygon_points])
    print(f'\n<!-- {member_name.capitalize()} Hotspot -->')
    print(f'<polygon points="{points_str}" class="hotspot" data-member="{member_name}"></polygon>')
