# Data Directory

This directory contains datasets and data files for the Euro Clean ML project.

## Structure

```
data/
├── EuroSAT_RGB/          # Main EuroSAT dataset
│   ├── AnnualCrop/       # Annual crop images
│   ├── Forest/           # Forest images  
│   ├── HerbaceousVegetation/ # Herbaceous vegetation images
│   ├── Highway/          # Highway images
│   ├── Industrial/       # Industrial area images
│   ├── Pasture/          # Pasture images
│   ├── PermanentCrop/    # Permanent crop images
│   ├── Residential/      # Residential area images
│   ├── River/            # River images
│   └── SeaLake/          # Sea and lake images
└── processed/            # Processed datasets (if any)
```

## Dataset Information

**EuroSAT RGB Dataset:**
- Total classes: 10 land use categories
- Image format: RGB JPEG
- Resolution: 64x64 pixels
- Total images: ~27,000
- Source: Sentinel-2 satellite imagery

## Usage

The dataset is automatically loaded by the training and inference pipelines. Paths are configured in the backend configuration.
