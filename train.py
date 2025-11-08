import os
import json
import time
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
import torchvision.transforms as transforms
import torchvision.datasets as datasets
import torchvision.models as models

# === CONFIGURATION ===
DATA_DIR = r"C:\Users\HP\Downloads\EuroSAT_RGB-20250703T084903Z-1-001\EuroSAT_RGB"
CHECKPOINT_DIR = './checkpoints'
os.makedirs(CHECKPOINT_DIR, exist_ok=True)

MODEL_PATH = lambda epoch: os.path.join(CHECKPOINT_DIR, f'model_epoch_{epoch}.pth')
TRACKER_PATH = os.path.join(CHECKPOINT_DIR, 'epoch_tracker.json')

BATCH_SIZE = 32
EPOCHS = 30
IMG_SIZE = 64
LR = 1e-4

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"🖥️ Using device: {device}")

# === AUTO FIND LATEST CHECKPOINT ===
def find_latest_checkpoint():
    files = [f for f in os.listdir(CHECKPOINT_DIR) if f.startswith("model_epoch_") and f.endswith(".pth")]
    if not files:
        return 0
    epochs = [int(f.split('_')[-1].split('.')[0]) for f in files]
    return max(epochs)

# === MANUAL OR AUTO RESUME ===
MANUAL_RESUME_EPOCH = 20  # Set to None to auto-detect

if MANUAL_RESUME_EPOCH is not None:
    checkpoint_path = MODEL_PATH(MANUAL_RESUME_EPOCH)
    if os.path.exists(checkpoint_path):
        start_epoch = MANUAL_RESUME_EPOCH
        print(f"🔁 Manually resuming from epoch {start_epoch + 1}")
    else:
        print(f"⚠️ model_epoch_{MANUAL_RESUME_EPOCH}.pth not found. Starting from scratch.")
        start_epoch = 0
else:
    start_epoch = find_latest_checkpoint()
    print(f"🔁 Auto-detected checkpoint: Resuming from epoch {start_epoch + 1}" if start_epoch > 0 else "🚀 Starting from scratch.")

# === DATA TRANSFORMS ===
transform = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(10),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

# === LOAD DATASET ===
dataset = datasets.ImageFolder(root=DATA_DIR, transform=transform)
num_classes = len(dataset.classes)
print(f"📦 Loaded {len(dataset)} images across {num_classes} classes.")
print("📁 Classes:", dataset.classes)

train_len = int(0.8 * len(dataset))
val_len = len(dataset) - train_len
train_dataset, val_dataset = random_split(dataset, [train_len, val_len])

train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE)

# === MODEL SETUP ===
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
for param in model.parameters():
    param.requires_grad = True
model.fc = nn.Linear(model.fc.in_features, num_classes)
model = model.to(device)

# === LOAD CHECKPOINT SAFELY ===
if start_epoch > 0:
    checkpoint_path = MODEL_PATH(start_epoch)
    if os.path.exists(checkpoint_path):
        model.load_state_dict(torch.load(checkpoint_path, map_location=device))
        print(f"✅ Loaded model from {checkpoint_path}")
    else:
        print(f"⚠️ Checkpoint {checkpoint_path} missing. Starting from scratch.")
        start_epoch = 0

# === LOSS, OPTIMIZER, SCHEDULER ===
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=LR)
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)

# === TRAINING LOOP ===
total_start_time = time.time()
total_batches = len(train_loader)

for epoch in range(start_epoch, EPOCHS):
    epoch_start_time = time.time()
    model.train()
    running_loss, total, correct = 0.0, 0, 0

    for i, (images, labels) in enumerate(train_loader):
        images, labels = images.to(device), labels.to(device)

        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * images.size(0)
        _, preds = torch.max(outputs, 1)
        correct += (preds == labels).sum().item()
        total += labels.size(0)

        if (i + 1) % 100 == 0 or (i + 1) == total_batches:
            print(f"  Batch [{i+1}/{total_batches}] | Processed {total} images")

    avg_loss = running_loss / total
    train_acc = 100. * correct / total

    # === VALIDATION ===
    model.eval()
    val_correct, val_total = 0, 0
    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, preds = torch.max(outputs, 1)
            val_correct += (preds == labels).sum().item()
            val_total += labels.size(0)
    val_acc = 100. * val_correct / val_total

    epoch_time = time.time() - epoch_start_time
    total_elapsed_time = time.time() - total_start_time

    print(f"📊 Epoch [{epoch+1}/{EPOCHS}] | Loss: {avg_loss:.4f} | Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}% | Time: {epoch_time:.2f}s")

    # === REMAINING TIME ESTIMATION ===
    epochs_completed = epoch - start_epoch + 1
    epochs_remaining = EPOCHS - (epoch + 1)
    if epochs_remaining > 0:
        avg_epoch_time = total_elapsed_time / epochs_completed
        est_remaining = avg_epoch_time * epochs_remaining
        print(f"⏳ Estimated Remaining Time: {est_remaining / 60:.2f} min")
    else:
        print("✅ Final epoch completed.")

    # === SAVE CHECKPOINT ===
    torch.save(model.state_dict(), MODEL_PATH(epoch + 1))
    with open(TRACKER_PATH, 'w') as f:
        json.dump({"last_epoch": epoch + 1}, f)
    scheduler.step()

print("🎉 Training complete.")
