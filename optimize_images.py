#!/usr/bin/env python3
"""
Image optimization script for SENEC-Design website.
Compresses PNG images while maintaining quality.
"""

from PIL import Image
import os
from pathlib import Path

def optimize_png(input_path, quality=85):
    """
    Optimize a PNG image by recompressing it.
    
    Args:
        input_path: Path to the input image
        quality: Compression quality (0-100)
    """
    try:
        # Create backup
        backup_path = input_path.with_suffix('.png.bak')
        if not backup_path.exists():
            os.rename(input_path, backup_path)
            original_size = os.path.getsize(backup_path)
        else:
            original_size = os.path.getsize(input_path)
            return False, "Backup already exists"
        
        with Image.open(backup_path) as img:
            # Optimize and save
            img.save(input_path, 'PNG', optimize=True, compress_level=9)
            
            new_size = os.path.getsize(input_path)
            
            if new_size < original_size:
                reduction = ((original_size - new_size) / original_size) * 100
                # Remove backup if optimization was successful
                os.remove(backup_path)
                return True, f"{original_size/1024:.1f}KB → {new_size/1024:.1f}KB ({reduction:.1f}% reduction)"
            else:
                # Restore original if no improvement
                os.remove(input_path)
                os.rename(backup_path, input_path)
                return False, "No size reduction achieved"
                
    except Exception as e:
        # Restore backup on error
        if backup_path.exists():
            if input_path.exists():
                os.remove(input_path)
            os.rename(backup_path, input_path)
        return False, f"Error: {e}"

def main():
    images_dir = Path('/home/ubuntu/senec-design/public/images')
    
    images_to_optimize = [
        'battery-storage.png',
        'hero-home.png',
        'installation.png',
        'wallbox.png'
    ]
    
    print("Starting PNG optimization...")
    print("=" * 60)
    
    optimized_count = 0
    for image_name in images_to_optimize:
        input_path = images_dir / image_name
        if not input_path.exists():
            print(f"⚠ Skipping {image_name} (not found)")
            continue
        
        success, message = optimize_png(input_path)
        if success:
            print(f"✓ {image_name}")
            print(f"  {message}")
            optimized_count += 1
        else:
            print(f"⚠ {image_name}: {message}")
    
    print("=" * 60)
    print(f"Optimization complete! {optimized_count} images optimized.")

if __name__ == '__main__':
    main()
