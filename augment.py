import os
import numpy as np
from tensorflow.keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array, save_img

TRAIN_PATH = r"G:\All projects\petsfiy-main\backend\DogDiseaseAI\dataset\train"
TARGET = 800

datagen = ImageDataGenerator(
    rotation_range=40,
    zoom_range=0.4,
    horizontal_flip=True,
    vertical_flip=True,
    brightness_range=[0.6, 1.4],
    shear_range=0.3,
    width_shift_range=0.2,
    height_shift_range=0.2,
)

for cls in os.listdir(TRAIN_PATH):
    cls_path = os.path.join(TRAIN_PATH, cls)
    if not os.path.isdir(cls_path):
        continue
    images = [f for f in os.listdir(cls_path) if not f.startswith("aug_")]
    current = len(os.listdir(cls_path))
    needed = TARGET - current
    if needed <= 0:
        print(f"✅ {cls}: already has {current} images, skipping")
        continue
    generated = 0
    for img_name in images:
        if generated >= needed:
            break
        img_path = os.path.join(cls_path, img_name)
        try:
            img = load_img(img_path, target_size=(224, 224))
            arr = img_to_array(img)
            arr = np.expand_dims(arr, axis=0)
            for batch in datagen.flow(arr, batch_size=1):
                save_img(
                    os.path.join(cls_path, f"aug_{generated}_{img_name}"),
                    batch[0]
                )
                generated += 1
                if generated >= needed:
                    break
        except:
            pass
    print(f"✅ {cls}: generated {generated} new images, total: {current + generated}")

print("Done!")