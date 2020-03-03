import requests
from skimage import io 
import tensorflow.keras
import urllib.request
from PIL import Image
import numpy as np
import time

# ========== Pulling Image from Misty Endpoint =====================

robotIP = '192.168.1.21'
# URL = 'http://'+robotIP+'/api/cameras/fisheye'  
GetImageURL = 'http://'+ robotIP +'/api/cameras/rgb?base64=false&FileName=MyPicture&Width=320&Height=240&DisplayOnScreen=true&OverwriteExisting=true'

# =========== Create images for training set  =======================

# for i in range(30):
#     image = Image.open(urllib.request.urlopen(GetImageURL))
#    image.save('test6-' + str(i) + '.png')
#    print(i)

#print('DONE')

# # ============ Load and get model ready ==============================

np.set_printoptions(suppress=True)
model = tensorflow.keras.models.load_model('/Users/Chris/My Documents/Misty/Teachable Machine/keras_model.h5')
# Or use saved TM URL location of project https://teachablemachine.withgoogle.com/models/lTTP7o5R/ 
data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)

# # ========== Prediction ============================================

try:
   while True:

        image = Image.open(urllib.request.urlopen(GetImageURL))
        image.save('preview.png')
        image = image.resize((224, 224))
        image_array = np.asarray(image)
        normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
        data[0] = normalized_image_array
        prediction = model.predict(data)[0]
        print(prediction)
        if prediction[0] > 0.9:
            alertFallURL = 'http://'+ robotIP +'/api/skills/event'
            alertFallPayload = { "Skill" : "500c5e92-2d9c-49a8-85b9-175a44ce5349", "EventName": "fallDetectedMessage", "Payload": {"fallDetectedNow": "Yes"}}
            resp = requests.post(url = alertFallURL, json = alertFallPayload)
            print(resp.json())
            if resp.json()['result'] == True and resp.json()['status'] == "Success":
                print("Misty is now taking corresponding action")
                print("fallDetection resuming for 45 seconds")
                time.sleep(45)
                

        
except KeyboardInterrupt:
    pass

# "Payload": {"fallDetected": "true"},