$(document).ready(function(){
    //do something
    $("#thisButton").click(function(){
        processImage();
    });
    $(".send").click(function(){
        sendToSheet();
    });
    $("#inputImageFile").change(function(e){
      processImage(e.target.files[0]);
    });
});

function processImage(imageO ) {
  document.querySelector("#sourceImage").src = "";
  $('.send').hide();
  $("#textResult").html("")
  $('.loading').show();
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
      let myNode = document.querySelector("#textResult");
      $('.loading').hide();
      for(let x=0; x<recognitionArray.length;x++){
        let myTable = document.createElement("tr");
        myTable.innerHTML = '<td class="text">'+recognitionArray[x].text+'</td>'
        let myTd = document.createElement("td");
        let mySe = document.createElement("select");
        let myOp = []

        myOp[0] = document.createElement("option");
        myOp[1] = document.createElement("option");
        myOp[2] = document.createElement("option");
        myOp[3] = document.createElement("option");
        myOp[4] = document.createElement("option");
        myOp[5] = document.createElement("option");
        myOp[6] = document.createElement("option");
        myOp[7] = document.createElement("option");
        myOp[8] = document.createElement("option");
        myOp[9] = document.createElement("option");
        myOp[10] = document.createElement("option");
        myOp[11] = document.createElement("option");
        myOp[12] = document.createElement("option");
        myOp[13] = document.createElement("option");
        myOp[14] = document.createElement("option");

        myOp[0].value = '';
        myOp[1].value = 'cname';
        myOp[2].value = 'ename';
        myOp[3].value = 'title';
        myOp[4].value = 'etitle';
        myOp[5].value = 'department';
        myOp[6].value = 'edepartment';
        myOp[7].value = 'mobile';
        myOp[8].value = 'email';
        myOp[9].value = 'phone';
        myOp[10].value = 'fax';
        myOp[11].value = 'company';
        myOp[12].value = 'address';
        myOp[13].value = 'eaddress';
        myOp[14].value = 'businessID';

        myOp[0].innerHTML = '請選擇類別';
        myOp[1].innerHTML = '中文姓名';
        myOp[2].innerHTML = '英文姓名';
        myOp[3].innerHTML = '職稱';
        myOp[4].innerHTML = '英文職稱';
        myOp[5].innerHTML = '部門';
        myOp[6].innerHTML = '部門英文';
        myOp[7].innerHTML = '手機';
        myOp[8].innerHTML = 'email';
        myOp[9].innerHTML = '電話';
        myOp[10].innerHTML = '傳真';
        myOp[11].innerHTML = '公司名稱';
        myOp[12].innerHTML = '公司地址 ';
        myOp[13].innerHTML = '公司英文地址';
        myOp[14].innerHTML = '統編';

        for(var i=0; i<myOp.length; i++) {
            mySe.appendChild(myOp[i]);
        }
        myTd.appendChild(mySe)
        myTable.appendChild(myTd);
        myNode.appendChild(myTable);
      }
      $('.send').show();
      // $("#textResult").html(str);

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
function sendToSheet(){
  let myNode = document.querySelectorAll('tr');
  let oneData = {'id': "INCREMENT"}
  let passcheck = true;
  for (var i = 0; i < myNode.length; i++) {
    let key = myNode[i].querySelector('select').value;
    let value = myNode[i].querySelector('.text').innerText;
    if(key == '') {
      alert('請確認每個資料都已選擇類別！');
      passcheck = false;
      break;
    }else{
      oneData[key] = value;
    }
  }
  if(passcheck){
    fetch('https://sheetdb.io/api/v1/6helj6tgbivyp', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          data: oneData
      })
  })
    .then((response) => {
        alert("記錄成功！");
        $("#textResult").html("");
        $('.send').hide();
    })
    .catch((error) => {
        console.log(error)
    })
  }

}
