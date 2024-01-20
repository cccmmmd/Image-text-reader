$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
    $("#inputImageFile").change(function(e){
      processImage(e.target.files[0]);
    });
});

function processImage(imageO ) {
  document.querySelector("#sourceImage").src = "";
  $("#textResult").html("");
    // **********************************************
    // *** Update or verify the following values. ***
    // **********************************************
    // $("#RecognitionCardNumber").text("XXXX XXXX XXXX XXXX");
    let endpoint = "https://switzerlandnorth.api.cognitive.microsoft.com/";
    if (!subscriptionKey) { throw new Error('Set your environment variables for your subscription key and endpoint.'); }

    var uriBase = endpoint + "vision/v3.2/read/analyze";

    var params = {
        "language": "zh-Hant",
    };
    // Display the image.
    let sourceImageUrl = ""
    if( imageO != undefined ){
      sourceImageUrl=URL.createObjectURL(imageO);
      $.ajax({
          url: uriBase,

          // Request headers.
          beforeSend: function(jqXHR){
              jqXHR.setRequestHeader("Content-Type","application/octet-stream");
              jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
          },

          type: "POST",
          processData:false,
          contentType:false,
          // Request body.
          data: imageO
      })
      .done(function(data, textStatus, jqXHR) {
        var operationLocation = jqXHR.getResponseHeader("Operation-Location");
        // Make the second REST API call and get the response.
        fetchText(operationLocation);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
            // Put the JSON description into the text area.
            $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));

            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    }else{
      sourceImageUrl = document.getElementById("inputImage").value;
      $.ajax({
          url: uriBase,

          // Request headers.
          beforeSend: function(jqXHR){
              jqXHR.setRequestHeader("Content-Type","application/json");
              jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
          },

          type: "POST",

          // Request body.
          data: '{"url": ' + '"' + sourceImageUrl + '"}',
      })
      .done(function(data, textStatus, jqXHR) {
        var operationLocation = jqXHR.getResponseHeader("Operation-Location");
        // Make the second REST API call and get the response.
        fetchText(operationLocation);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
            // Put the JSON description into the text area.
            $("#responseTextArea").val(JSON.stringify(jqXHR, null, 2));

            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                (jQuery.parseJSON(jqXHR.responseText).message) ?
                    jQuery.parseJSON(jqXHR.responseText).message :
                    jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    }
    document.querySelector("#sourceImage").src = sourceImageUrl;

    // This operation requires two REST API calls. One to submit the image
    // for processing, the other to retrieve the text found in the image.
    //
    // Make the first REST API call to submit the image for processing.

};
function fetchText(operationLocation) {
  $.ajax({
      url: operationLocation,

      // Request headers.
      beforeSend: function(jqXHR){
          jqXHR.setRequestHeader("Content-Type","application/json");
          jqXHR.setRequestHeader(
              "Ocp-Apim-Subscription-Key", subscriptionKey);
      },
      type: "GET",
  })
  .done(function(data) {
      // Show formatted JSON on webpage.
      // $("#responseTextArea").val(JSON.stringify(data, null, 2));
      if(data.status != 'succeeded'){
        fetchText(operationLocation);
      }
      let recognitionArray = data.analyzeResult.readResults[0].lines;
      let str = "";
      for(let x=0; x<recognitionArray.length;x++){
        str += recognitionArray[x].text + '<br/>'
      }
      $("#textResult").html(str);

  })
  .fail(function(jqXHR, textStatus, errorThrown) {
      // Display error message.
      var errorString = (errorThrown === "") ? "Error. " :
          errorThrown + " (" + jqXHR.status + "): ";
      errorString += (jqXHR.responseText === "") ? "" :
          (jQuery.parseJSON(jqXHR.responseText).message) ?
              jQuery.parseJSON(jqXHR.responseText).message :
              jQuery.parseJSON(jqXHR.responseText).error.message;
      alert(errorString);
  });
}
