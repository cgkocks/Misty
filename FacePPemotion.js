// Demonstrate POST a photo to Face++ 
var facePlusPlusKey = "EOR0Z1YLaiJvA-bkcOlXOILEzOpCiYoF"
var facePlusPlusSecret = "8lR-X_CeSCjQf-grdECHk0Se85xILJYE"    
var base64String 
misty.TakePicture("MyPic", 200, 200, true, true)

function _TakePicture(data) {
    var base64String = data.Result.Base64;
    misty.PlayAudio("s_SystemCameraShutter.wav");
    misty.Debug("Picture taken");
//    misty.Debug(base64String)
}
misty.Pause(10000);
// Send image as Base64 to Face++ API
misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_base64=" + base64String + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");

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
misty.Debug("Program Completed")

// function _analyzeImage(responseData) {
//    var link = JSON.parse(responseData.Result.ResponseObject.Data).data.link;
//    var facePlusPlusKey = "EOR0Z1YLaiJvA-bkcOlXOILEzOpCiYoF"
//    var facePlusPlusSecret = "8lR-X_CeSCjQf-grdECHk0Se85xILJYE"
    // Send URL of image to Face++ API
    // misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_url=" + link + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");
// }

// Returns the public URL for your image
// function _imageUploadResponse(responseData) {
//    misty.Debug(JSON.parse(responseData.Result.ResponseObject.Data).data.link);
// }