import tensorflow as tf
import tf2onnx

model = tf.keras.models.load_model("dog_skin_model_fast.h5")

tf2onnx.convert.from_keras(
    model,
    output_path="dog_skin_model.onnx"
)
print("Done!")