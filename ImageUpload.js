misty.AddReturnProperty("BumpSensor", "IsContacted");
misty.RegisterEvent("BumpSensor", "BumpSensor", 10, true);

function _BumpSensor(data) {
    var isPressed = data.AdditionalResults[0];

    // If isPressed is true, takes picture
    if (isPressed) {
        misty.TakePicture("MyPic", 375, 812, true, true)
    }
}

function _TakePicture(data) {
    var base64String = data.Result.Base64;
    misty.PlayAudio("s_SystemCameraShutter.wav")
    misty.Debug("Picture taken");
    var facePlusPlusKey = "EOR0Z1YLaiJvA-bkcOlXOILEzOpCiYoF"
    var facePlusPlusSecret = "8lR-X_CeSCjQf-grdECHk0Se85xILJYE"    
    // Send image as Base64 to Face++ API
    misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_base64=" + base64String + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");
    misty.Debug("Picture posted to Face++");
    // Upload the image to Imgur!
    // uploadImage(base64String);
}

// function uploadImage(imageData) {
//    var jsonBody = {
//        "image": imageData,
//        "type" : "base64",
//        "album": "<your-album-hash>"
//    };

//    var imgurToken = "<your-token>"
//    misty.SendExternalRequest("POST", "https://api.imgur.com/3/image", "Bearer", imgurToken, JSON.stringify(jsonBody), false, false, "", "application/json", "_analyzeImage");
// }

// function _analyzeImage(responseData) {
    
//    var link = JSON.parse(responseData.Result.ResponseObject.Data).data.link;
//    var facePlusPlusKey = "EOR0Z1YLaiJvA-bkcOlXOILEzOpCiYoF"
//    var facePlusPlusSecret = "8lR-X_CeSCjQf-grdECHk0Se85xILJYE"
    
    // Send URL of image to Face++ API
    // misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_url=" + link + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");

// }

// Handle Face++ response data
function _analyzeImageResponse(responseData) {
    var emotions = JSON.parse(responseData.Result.ResponseObject.Data).faces[0].attributes.emotion;
    misty.Debug(JSON.stringify(emotions));
    var maxEmotion = Object.keys(emotions).reduce((a, b) => emotions[a] > emotions[b] ? a : b);

    // This is what Face++ thinks you're feeling the most
    misty.Debug(maxEmotion);

    // Misty imitates your emotions
    switch(maxEmotion) {
        case "anger":
            misty.DisplayImage("e_Anger.jpg");
            misty.PlayAudio("s_Anger.wav")
            break;
        case "disgust":
            misty.DisplayImage("e_Disgust.jpg");
            misty.PlayAudio("s_Disgust.wav")
            break;
        case "fear":
            misty.DisplayImage("e_Fear.jpg");
            misty.PlayAudio("s_Fear.wav")
            break;
        case "happiness":
            misty.DisplayImage("e_Joy.jpg");
            misty.PlayAudio("s_Joy.wav")
            break;
        case "neutral":
            misty.DisplayImage("e_DefaultContent.jpg");
            misty.PlayAudio("s_Acceptance.wav")
            break;
        case "sadness":
            misty.DisplayImage("e_Sadness.jpg");
            misty.PlayAudio("s_Sadness.wav")
            break;
        case "surprise":
            misty.DisplayImage("e_Surprise.jpg");
            misty.PlayAudio("s_DisorientedConfused.wav")
            break;
        default:
            misty.Debug("Sorry, I don't know what you're feeling. Take another picture?");
            break;
    }
}

// Returns the public URL for your image
// function _imageUploadResponse(responseData) {
//    misty.Debug(JSON.parse(responseData.Result.ResponseObject.Data).data.link);
// }