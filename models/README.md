# Models Directory

This directory contains trained machine learning models for the Euro Clean project.

## Files

- `model_epoch_30.pth`: Main EuroSAT land use classification model (PyTorch format)
  - Architecture: ResNet-based CNN
  - Training epochs: 30
  - Dataset: EuroSAT RGB
  - Classes: 10 land use categories

## Usage

The models are loaded by the backend services automatically. Model paths are configured in the backend configuration files.
