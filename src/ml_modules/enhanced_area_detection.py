"""
Enhanced Area Detection Module
Provides area calculation utilities for satellite image analysis.
"""

import numpy as np
from typing import Tuple, Optional


class AreaCalculator:
    """
    Calculator for estimating areas in satellite images.
    """
    
    def __init__(self, pixel_size_m: float = 10.0):
        """
        Initialize the area calculator.
        
        Args:
            pixel_size_m: Size of each pixel in meters (default: 10m for typical satellite imagery)
        """
        self.pixel_size_m = pixel_size_m
        self.pixel_area_m2 = pixel_size_m ** 2
    
    def calculate_water_area(self, image_array: np.ndarray) -> dict:
        """
        Calculate water area in an image using simple color-based detection.
        
        Args:
            image_array: RGB image as numpy array (H, W, 3)
            
        Returns:
            Dictionary with water area information including area_km2, pixel_count, and confidence
        """
        if len(image_array.shape) != 3 or image_array.shape[2] != 3:
            raise ValueError("Image array must be RGB format (H, W, 3)")
        
        # Convert to float for calculations
        img = image_array.astype(np.float32) / 255.0
        
        # Simple water detection using blue channel dominance
        # Water typically has higher blue values compared to red and green
        blue_channel = img[:, :, 2]
        red_channel = img[:, :, 0]
        green_channel = img[:, :, 1]
        
        # Water mask: blue > red and blue > green, with minimum blue threshold
        water_mask = (
            (blue_channel > red_channel) & 
            (blue_channel > green_channel) & 
            (blue_channel > 0.3)  # Minimum blue threshold
        )
        
        # Calculate area
        water_pixels = np.sum(water_mask)
        water_area_m2 = water_pixels * self.pixel_area_m2
        water_area_km2 = water_area_m2 / 1_000_000  # Convert to km²
        
        # Calculate confidence based on how much of the image is detected as water
        total_pixels = image_array.shape[0] * image_array.shape[1]
        water_percentage = (water_pixels / total_pixels) * 100
        
        # Confidence based on water percentage (more water = higher confidence for water bodies)
        confidence = min(water_percentage / 10.0, 1.0)  # Scale to 0-1
        
        return {
            'area_km2': float(water_area_km2),
            'pixel_count': int(water_pixels),
            'total_pixels': int(total_pixels),
            'percentage': float(water_percentage),
            'confidence': float(confidence)
        }
    
    def calculate_vegetation_area(self, image_array: np.ndarray) -> dict:
        """
        Calculate vegetation area using NDVI-like approach.
        
        Args:
            image_array: RGB image as numpy array (H, W, 3)
            
        Returns:
            Dictionary with vegetation area information including area_km2, pixel_count, and confidence
        """
        if len(image_array.shape) != 3 or image_array.shape[2] != 3:
            raise ValueError("Image array must be RGB format (H, W, 3)")
        
        # Convert to float for calculations
        img = image_array.astype(np.float32) / 255.0
        
        # Simple vegetation detection using green channel dominance
        green_channel = img[:, :, 1]
        red_channel = img[:, :, 0]
        blue_channel = img[:, :, 2]
        
        # Vegetation mask: green dominant with minimum threshold
        vegetation_mask = (
            (green_channel > red_channel) & 
            (green_channel > blue_channel) & 
            (green_channel > 0.4)  # Minimum green threshold
        )
        
        # Calculate area
        vegetation_pixels = np.sum(vegetation_mask)
        vegetation_area_m2 = vegetation_pixels * self.pixel_area_m2
        vegetation_area_km2 = vegetation_area_m2 / 1_000_000  # Convert to km²
        
        # Calculate confidence and percentage
        total_pixels = image_array.shape[0] * image_array.shape[1]
        vegetation_percentage = (vegetation_pixels / total_pixels) * 100
        confidence = min(vegetation_percentage / 20.0, 1.0)  # Scale to 0-1
        
        return {
            'area_km2': float(vegetation_area_km2),
            'pixel_count': int(vegetation_pixels),
            'total_pixels': int(total_pixels),
            'percentage': float(vegetation_percentage),
            'confidence': float(confidence)
        }
    
    def calculate_urban_area(self, image_array: np.ndarray) -> dict:
        """
        Calculate urban/built-up area using brightness and color characteristics.
        
        Args:
            image_array: RGB image as numpy array (H, W, 3)
            
        Returns:
            Dictionary with urban area information including area_km2, pixel_count, and confidence
        """
        if len(image_array.shape) != 3 or image_array.shape[2] != 3:
            raise ValueError("Image array must be RGB format (H, W, 3)")
        
        # Convert to float for calculations
        img = image_array.astype(np.float32) / 255.0
        
        # Urban areas typically have similar RGB values (grayish) and higher brightness
        grayscale = np.mean(img, axis=2)
        rgb_std = np.std(img, axis=2)  # Low standard deviation indicates similar RGB values
        
        # Urban mask: moderate brightness with low color variation
        urban_mask = (
            (grayscale > 0.3) & 
            (grayscale < 0.8) & 
            (rgb_std < 0.15)  # Low color variation
        )
        
        # Calculate area
        urban_pixels = np.sum(urban_mask)
        urban_area_m2 = urban_pixels * self.pixel_area_m2
        urban_area_km2 = urban_area_m2 / 1_000_000  # Convert to km²
        
        # Calculate confidence and percentage
        total_pixels = image_array.shape[0] * image_array.shape[1]
        urban_percentage = (urban_pixels / total_pixels) * 100
        confidence = min(urban_percentage / 15.0, 1.0)  # Scale to 0-1
        
        return {
            'area_km2': float(urban_area_km2),
            'pixel_count': int(urban_pixels),
            'total_pixels': int(total_pixels),
            'percentage': float(urban_percentage),
            'confidence': float(confidence)
        }
    
    def get_pixel_area_km2(self) -> float:
        """Get the area covered by a single pixel in square kilometers."""
        return self.pixel_area_m2 / 1_000_000
    
    def set_pixel_size(self, pixel_size_m: float) -> None:
        """Update the pixel size and recalculate pixel area."""
        self.pixel_size_m = pixel_size_m
        self.pixel_area_m2 = pixel_size_m ** 2


def calculate_ndwi(image_array: np.ndarray) -> np.ndarray:
    """
    Calculate Normalized Difference Water Index (NDWI) approximation using RGB.
    
    Since we don't have NIR, we use a simplified approach:
    NDWI ≈ (Green - NIR) / (Green + NIR) 
    Approximated as: (Green - Red) / (Green + Red)
    
    Args:
        image_array: RGB image as numpy array (H, W, 3)
        
    Returns:
        NDWI array with values between -1 and 1
    """
    if len(image_array.shape) != 3 or image_array.shape[2] != 3:
        raise ValueError("Image array must be RGB format (H, W, 3)")
    
    # Convert to float for calculations
    img = image_array.astype(np.float32) / 255.0
    
    green = img[:, :, 1]
    red = img[:, :, 0]
    
    # Avoid division by zero
    denominator = green + red
    denominator = np.where(denominator == 0, 1e-8, denominator)
    
    ndwi = (green - red) / denominator
    
    return ndwi


def calculate_ndvi_approximation(image_array: np.ndarray) -> np.ndarray:
    """
    Calculate NDVI approximation using RGB channels.
    
    Since we don't have NIR, we use a simplified approach:
    NDVI ≈ (NIR - Red) / (NIR + Red)
    Approximated as: (Green - Red) / (Green + Red)
    
    Args:
        image_array: RGB image as numpy array (H, W, 3)
        
    Returns:
        NDVI approximation array with values between -1 and 1
    """
    return calculate_ndwi(image_array)  # Same calculation for RGB approximation
