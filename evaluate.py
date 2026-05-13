import os
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from sklearn.metrics import classification_report

MODEL_PATH = r"G:\All projects\petsfiy-main\DogDiseaseAI\model\dog_skin_model_v2.h5"
model = load_model(MODEL_PATH)
print("✅ Model loaded successfully!")

classes = ["demodicosis","Dermatitis","Fungal_infections","Healthy","Hypersensitivity","ringworm"]

TEST_FOLDER = r"G:\All projects\petsfiy-main\backend\DogDiseaseAI\dataset\val"

y_true = []
y_pred = []

for cls in os.listdir(TEST_FOLDER):
    cls_path = os.path.join(TEST_FOLDER, cls)
    if not os.path.isdir(cls_path):
        continue
    for img_name in os.listdir(cls_path):
        img_path = os.path.join(cls_path, img_name)
        try:
            img = image.load_img(img_path, target_size=(224,224))
            img_array = image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0)
            img_array /= 255.0
            preds = model.predict(img_array, verbose=0)[0]
            pred_class = classes[np.argmax(preds)]
            y_true.append(cls)
            y_pred.append(pred_class)
        except Exception as e:
            print(f"Error on {img_path}: {e}")
            break

print(classification_report(y_true, y_pred, target_names=classes))