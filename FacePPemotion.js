// Demonstrate POST a photo to Face++ 
var facePlusPlusKey = "EOR0Z1YLaiJvA-bkcOlXOILEzOpCiYoF"
var facePlusPlusSecret = "8lR-X_CeSCjQf-grdECHk0Se85xILJYE"    
//misty.Set("base64String", "string", true)
_base64String = "string"
var imagename = "MyPic.jpg"

misty.TakePicture("MyPic", 100, 100, true, true)

function _TakePicture(data) {
    //misty.Set("base64String", data.Result.Base64, true);
    base64String = data.Result.base64
    // imagename = data.Result.Name;
    // misty.Debug(imagename);
    misty.PlayAudio("s_SystemCameraShutter.wav");
    misty.Debug("Picture taken");
}
misty.Pause(10000);
// Send image as File, Base64, or URL to Face++ API
misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_base64=" + base64String + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");
// misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_file=" + "MyPic.jpg" + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");
// misty.SendExternalRequest("POST", "https://api-us.faceplusplus.com/facepp/v3/detect?api_key=" + facePlusPlusKey + "&api_secret=" + facePlusPlusSecret + "&image_url=" + "https://tinyurl.com/vt3rp5u" + "&return_attributes=emotion", null, null, null, false, false, null, "application/json", "_analyzeImageResponse");

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

