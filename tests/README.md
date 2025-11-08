# Tests Directory

This directory contains test files for the Euro Clean ML project.

## Test Structure

```
tests/
├── unit/              # Unit tests
│   ├── test_models.py
│   ├── test_api.py
│   └── test_utils.py
├── integration/       # Integration tests
│   ├── test_pipeline.py
│   └── test_endpoints.py
├── fixtures/          # Test fixtures and data
│   ├── sample_images/
│   └── mock_data.json
└── conftest.py       # Pytest configuration
```

## Running Tests

```bash
# Install test dependencies
pip install pytest pytest-cov pytest-asyncio

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov=backend

# Run specific test file
pytest tests/unit/test_models.py

# Run with verbose output
pytest -v
```

## Test Categories

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **API Tests**: Test REST API endpoints
- **Model Tests**: Test ML model predictions and accuracy

## Writing Tests

Follow pytest conventions:
- Test files should start with `test_`
- Test functions should start with `test_`
- Use fixtures for common test data
- Mock external dependencies
