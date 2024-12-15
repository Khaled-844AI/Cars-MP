from flask import Flask, request, jsonify
import tensorflow as tf
import pickle
from PIL import Image
import io
import numpy as np
from flask_cors import CORS


TF_ENABLE_ONEDNN_OPTS=0

app = Flask(__name__)

CORS(app)

with open('Flask/models/model.pkl', 'rb') as f:
    data = pickle.load(f)

model = tf.keras.models.model_from_json(data['model_config'])
model.set_weights(data['model_weights'])

@app.route('/', methods=['GET'])
def hello_world():
    return "hello world"

@app.route('/', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return "No file part", 400  
    
    labels = ['cheap car', 'modern car', ' old car']
    image_file = request.files['image']  
    max_prob = 0
    predicted = ''

    Bytes_image = Image.open(io.BytesIO(image_file.read()))

    if Bytes_image.mode != 'RGB':
        Bytes_image = Bytes_image.convert('RGB')

    with io.BytesIO() as output:
        Bytes_image.save(output, format='JPEG')
        output.seek(0)
        image_array = np.array(Image.open(output))

    image_array = np.expand_dims(image_array , axis=0)
    predictions = model.predict(image_array)
    print(predictions)
    for i in range(len(predictions[0])):
        if predictions[0][i] > max_prob:
            max_prob = predictions[0][i]
            predicted = labels[i]


    return jsonify({'predicted':predicted})

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


