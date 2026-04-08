# # from flask import Flask, request, jsonify
# # from tensorflow.keras.models import load_model
# # from tensorflow.keras.preprocessing import image
# # import numpy as np
# # import os

# # app = Flask(__name__)

# # # --------------------------
# # # تحميل الموديل
# # # --------------------------
# # MODEL_PATH = "DogDiseaseAI/model/dog_skin_model_fast.h5"
# # model = load_model(MODEL_PATH)

# # # --------------------------
# # # ترتيب الكلاسات (مهم جدًا)
# # # --------------------------
# # classes = ['Dermatitis','Fungal_infections','Healthy','Hypersensitivity','demodicosis','ringworm']

# # # --------------------------
# # # العلاجات
# # # --------------------------
# # treatments = {
# #     "demodicosis": "Apply medicated shampoo, consult vet for topical/oral antibiotics.",
# #     "Dermatitis": "Use anti-inflammatory ointments, check for allergens in food/environment.",
# #     "Fungal_infections": "Apply antifungal creams, keep area dry, consult vet if severe.",
# #     "Healthy": "No treatment needed, maintain hygiene and regular check-ups.",
# #     "Hypersensitivity": "Identify allergens, use antihistamines, consult vet.",
# #     "ringworm": "Use antifungal ointments/shampoos, isolate affected dog, consult vet."
# # }

# # # --------------------------
# # # API
# # # --------------------------
# # @app.route("/predict", methods=["POST"])
# # def predict():
# #     try:
# #         # ✅ check if file exists
# #         if "image" not in request.files:
# #             return jsonify({"error": "No image file provided. Make sure key name is 'image'"}), 400

# #         file = request.files["image"]

# #         if file.filename == "":
# #             return jsonify({"error": "Empty file name"}), 400

# #         # حفظ مؤقت
# #         filepath = "temp.jpg"
# #         file.save(filepath)

# #         # تجهيز الصورة
# #         img = image.load_img(filepath, target_size=(224,224))
# #         img_array = image.img_to_array(img)
# #         img_array = np.expand_dims(img_array, axis=0)
# #         img_array /= 255.0

# #         # prediction
# #         preds = model.predict(img_array, verbose=0)[0]

# #         top_index = np.argmax(preds)
# #         result = classes[top_index]
# #         confidence = float(preds[top_index])

# #         # حذف الصورة
# #         os.remove(filepath)

# #         return jsonify({
# #             "prediction": result,
# #             "confidence": round(confidence * 100, 2),
# #             "treatment": treatments[result]
# #         })

# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500


# # # --------------------------
# # # تشغيل السيرفر
# # # --------------------------
# # if __name__ == "__main__":
# #     app.run(debug=True)


# from flask import Flask, request, jsonify
# from tensorflow.keras.models import load_model
# from tensorflow.keras.preprocessing import image
# import numpy as np
# import os
# import gdown

# app = Flask(__name__)

# # --------------------------
# # تحميل الموديل
# # --------------------------
# MODEL_PATH = "dog_skin_model_fast.h5"
# GDRIVE_FILE_ID = "1VwefwSOzljKWbSCC7TmrEOI_yXn9hdzY"

# def download_model():
#     if not os.path.exists(MODEL_PATH):
#         print("Downloading model from Google Drive...")
#         gdown.download(
#             f"https://drive.google.com/uc?id={GDRIVE_FILE_ID}",
#             MODEL_PATH,
#             quiet=False
#         )
#         print("Model downloaded successfully!")

# download_model()
# model = load_model(MODEL_PATH)

# # --------------------------
# # ترتيب الكلاسات (مهم جدًا)
# # --------------------------
# classes = ['Dermatitis','Fungal_infections','Healthy','Hypersensitivity','demodicosis','ringworm']

# # --------------------------
# # العلاجات
# # --------------------------
# treatments = {
#     "demodicosis": "Apply medicated shampoo, consult vet for topical/oral antibiotics.",
#     "Dermatitis": "Use anti-inflammatory ointments, check for allergens in food/environment.",
#     "Fungal_infections": "Apply antifungal creams, keep area dry, consult vet if severe.",
#     "Healthy": "No treatment needed, maintain hygiene and regular check-ups.",
#     "Hypersensitivity": "Identify allergens, use antihistamines, consult vet.",
#     "ringworm": "Use antifungal ointments/shampoos, isolate affected dog, consult vet."
# }

# # --------------------------
# # API
# # --------------------------
# @app.route("/predict", methods=["POST"])
# def predict():
#     try:
#         if "image" not in request.files:
#             return jsonify({"error": "No image file provided. Make sure key name is 'image'"}), 400

#         file = request.files["image"]

#         if file.filename == "":
#             return jsonify({"error": "Empty file name"}), 400

#         filepath = "temp.jpg"
#         file.save(filepath)

#         img = image.load_img(filepath, target_size=(224, 224))
#         img_array = image.img_to_array(img)
#         img_array = np.expand_dims(img_array, axis=0)
#         img_array /= 255.0

#         preds = model.predict(img_array, verbose=0)[0]

#         top_index = np.argmax(preds)
#         result = classes[top_index]
#         confidence = float(preds[top_index])

#         os.remove(filepath)

#         return jsonify({
#             "prediction": result,
#             "confidence": round(confidence * 100, 2),
#             "treatment": treatments[result]
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# # --------------------------
# # تشغيل السيرفر
# # --------------------------
# if __name__ == "__main__":
#     port = int(os.environ.get("PORT", 5000))
#     app.run(host="0.0.0.0", port=port)














from flask import Flask, request, jsonify
import onnxruntime as ort
import numpy as np
from PIL import Image
import io
import os

app = Flask(__name__)

MODEL_PATH = "dog_skin_model.onnx"
session = ort.InferenceSession(MODEL_PATH)
input_name = session.get_inputs()[0].name
print("Model loaded successfully!")

classes = ['Dermatitis','Fungal_infections','Healthy','Hypersensitivity','demodicosis','ringworm']

treatments = {
    "demodicosis": "Apply medicated shampoo, consult vet for topical/oral antibiotics.",
    "Dermatitis": "Use anti-inflammatory ointments, check for allergens in food/environment.",
    "Fungal_infections": "Apply antifungal creams, keep area dry, consult vet if severe.",
    "Healthy": "No treatment needed, maintain hygiene and regular check-ups.",
    "Hypersensitivity": "Identify allergens, use antihistamines, consult vet.",
    "ringworm": "Use antifungal ointments/shampoos, isolate affected dog, consult vet."
}

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image file provided. Make sure key name is 'image'"}), 400

        file = request.files["image"]

        if file.filename == "":
            return jsonify({"error": "Empty file name"}), 400

        img = Image.open(io.BytesIO(file.read())).convert("RGB")
        img = img.resize((224, 224))
        img_array = np.array(img).astype(np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0

        preds = session.run(None, {input_name: img_array})[0][0]

        top_index = np.argmax(preds)
        result = classes[top_index]
        confidence = float(preds[top_index])

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