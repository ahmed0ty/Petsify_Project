# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import onnxruntime as ort
# import numpy as np
# from PIL import Image
# import io
# import os

# app = Flask(__name__)
# CORS(app)

# MODEL_PATH = "dog_skin_model.onnx"
# session = ort.InferenceSession(MODEL_PATH)
# input_name = session.get_inputs()[0].name
# print("Model loaded successfully!")

# classes = ['demodicosis','Dermatitis','Fungal_infections','Healthy','Hypersensitivity','ringworm']

# treatments = {
#     "demodicosis": "Apply medicated shampoo, consult vet for topical/oral antibiotics.",
#     "Dermatitis": "Use anti-inflammatory ointments, check for allergens in food/environment.",
#     "Fungal_infections": "Apply antifungal creams, keep area dry, consult vet if severe.",
#     "Healthy": "No treatment needed, maintain hygiene and regular check-ups.",
#     "Hypersensitivity": "Identify allergens, use antihistamines, consult vet.",
#     "ringworm": "Use antifungal ointments/shampoos, isolate affected dog, consult vet."
# }

# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         if "image" not in request.files:
#             return jsonify({"error": "No image file provided. Make sure key name is 'image'"}), 400

#         file = request.files["image"]

#         if file.filename == "":
#             return jsonify({"error": "Empty file name"}), 400

#         img = Image.open(io.BytesIO(file.read())).convert("RGB")
#         img = img.resize((224, 224))
#         img_array = np.array(img).astype(np.float32)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array /= 255.0

#         preds = session.run(None, {input_name: img_array})[0][0]

#         top_index = np.argmax(preds)
#         confidence = float(preds[top_index])

#         if confidence < 0.6:
#             return jsonify({
#                 "prediction": "Not a dog",
#                 "confidence": round(confidence * 100, 2),
#                 "treatment": "This image does not appear to be a dog. Please upload a clear image of a dog."
#             })

#         result = classes[top_index]
#         return jsonify({
#             "prediction": result,
#             "confidence": round(confidence * 100, 2),
#             "treatment": treatments[result]
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host="0.0.0.0", port=port)








from flask import Flask, request, jsonify
from flask_cors import CORS
import onnxruntime as ort
import numpy as np
from PIL import Image
import io
import os
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Dog Disease Model
MODEL_PATH = "dog_skin_model.onnx"
session = ort.InferenceSession(MODEL_PATH)
input_name = session.get_inputs()[0].name
print("Disease model loaded successfully!")

# Dog Detector Model (MobileNetV2 من ImageNet)
dog_detector = tf.keras.applications.MobileNetV2(
    weights='imagenet', include_top=True
)
print("Dog detector loaded successfully!")

# Dog class indices في ImageNet (151 لـ 268 كلها كلاب)
DOG_CLASS_RANGE = range(151, 269)

classes = ['demodicosis','Dermatitis','Fungal_infections','Healthy','Hypersensitivity','ringworm']

treatments = {
    "demodicosis": "Apply medicated shampoo, consult vet for topical/oral antibiotics.",
    "Dermatitis": "Use anti-inflammatory ointments, check for allergens in food/environment.",
    "Fungal_infections": "Apply antifungal creams, keep area dry, consult vet if severe.",
    "Healthy": "No treatment needed, maintain hygiene and regular check-ups.",
    "Hypersensitivity": "Identify allergens, use antihistamines, consult vet.",
    "ringworm": "Use antifungal ointments/shampoos, isolate affected dog, consult vet."
}

def is_dog(img: Image.Image) -> bool:
    img_resized = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img_resized)
    img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)
    preds = dog_detector.predict(img_array, verbose=0)
    top_indices = np.argsort(preds[0])[::-1][:5]
    for idx in top_indices:
        if idx in DOG_CLASS_RANGE:
            return True
    return False

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided."}), 400

        file = request.files["image"]
        if file.filename == "":
            return jsonify({"error": "Empty file name"}), 400

        img = Image.open(io.BytesIO(file.read())).convert("RGB")

        # تحقق إن الصورة كلب
        if not is_dog(img):
            return jsonify({
                "prediction": "Not a dog",
                "confidence": 0,
                "treatment": "This image does not appear to be a dog. Please upload a clear image of a dog."
            })

        # تحليل المرض
        img_resized = img.resize((224, 224))
        img_array = np.array(img_resized).astype(np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        preds = session.run(None, {input_name: img_array})[0][0]
        top_index = np.argmax(preds)
        confidence = float(preds[top_index])

        result = classes[top_index]
        return jsonify({
            "prediction": result,
            "confidence": round(confidence * 100, 2),
            "treatment": treatments[result]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)