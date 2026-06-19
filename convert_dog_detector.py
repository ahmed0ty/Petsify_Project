import tensorflow as tf
import tf2onnx

model = tf.keras.applications.MobileNetV2(weights='imagenet', include_top=True)

tf2onnx.convert.from_keras(
    model,
    output_path="mobilenet_v2.onnx"
)
print("Done!")