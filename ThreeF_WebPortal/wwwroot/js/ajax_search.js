
$(document).ready(function () {
    //Init autocomplete search
    $.typeahead({
        input: '.js-typeahead-product_v2',
        minLength: 1, //2
        maxLength: false,
        //order: "asc",
        maxItem: 20,
        filter: false, //false is not filter data
        accent: true, //true is search without unicode
        offset: false, // true is first character matched
        hint: false,
        highlight: false,
        dynamic: true,
        delay: 1000,
        href: location.origin + "/san-pham/{{nameSlug}}-{{id}}",
        source: {
            product: {
                display: ["name"],
                //data: [{
                //    "id": 0,
                //    "name": "",
                //    "nameSlug": "",
                //    "imageUrl": "",
                //    "price": 0,
                //    "discount": 0
                //}],
                ajax: {
                    type: "GET",
                    url: "/Product/QuickSearch",
                    data: { keyword: "{{query}}" },
                    callback: {
                        done: function (response) {
                            return response.result === 1 && response.data != null && response.data.length > 0 ? response.data : [];
                        }
                    }
                },
                template: function (query, item) {
                    return `<div class="man-section"><div class="image-section"><img style="border-radius:4px;" src="{{imageUrl}}" onerror="this.onerror=null;this.src='/assets/images/error/product_1x1_medium.png';"></div><div class="description-section"><h4 class="sp-line-2">{{name}}</h4><span class="text-danger" title="${IsNullOrEmty(item.name) ? "" : item.name}">${RawSearchProductPrice(item.productPriceObjs)}${RawSearchProductRatioDiscount(item.productPriceObjs)}</div></div>`;
                }
            }
        },
        emptyTemplate: '<div class="empty-message">Không tìm thấy sản phẩm phù hợp!</div>',
        callback: {
            onClick: function (node, a, item, event) {
            },
            onSubmit: function (node, form, item, event) {
            }
        }
    });
});

//-------------------
//Init voice search
var SpeechRecognition, recognition, searchBoxInputSpeech, titleSpeech, contentSpeech, btnStartSpeak, btnShowSpeech;
if ("webkitSpeechRecognition" in window) {
    // Speech Recognition Stuff goes here
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    searchBoxInputSpeech = document.querySelectorAll('.js-typeahead-product_v2');
    titleSpeech = document.getElementById('titleSpeech');
    contentSpeech = document.getElementById('contentSpeech');
    btnStartSpeak = document.getElementById('btnStartSpeak');
    btnShowSpeech = document.querySelectorAll('.btnShowSpeech');
    for (n = 0; n < btnShowSpeech.length; ++n) {
        btnShowSpeech[n].addEventListener("click", function () {
            $('#listen-voice-modal').modal({ backdrop: 'static', keyboard: false }).modal('show');
        });
    }
} else {
    btnShowSpeech = document.querySelectorAll('.btnShowSpeech');
    for (n = 0; n < btnShowSpeech.length; ++n) {
        btnShowSpeech[n].remove();
    }
    var zoneButtonSearchMobile = document.querySelectorAll('.mobile .typeahead__button');
    for (n = 0; n < zoneButtonSearchMobile.length; ++n) {
        zoneButtonSearchMobile[n].style.width = "34px";
    }
    console.log("Speech Recognition Not Available.");
}

var timeoutTitleSpeechChange, tmpSaveRecognitionText;
function RunSpeech() {
    btnStartSpeak.classList.add('active');
    titleSpeech.textContent = "Hãy nói gì đó";
    contentSpeech.textContent = "";
    timeoutTitleSpeechChange = setTimeout(function () {
        titleSpeech.textContent = "Nhấn để kết thúc";
    }, 1000);
    setValueInput(searchBoxInputSpeech, '');
    tmpSaveRecognitionText = '';
    $('#btnSearchVoice').fadeOut(0);

    recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    $('#btnStartSpeak').attr('onclick', 'StopSpeech()');

    recognition.onresult = function (event) {
        var speechResult = event.results[0][0].transcript.toLowerCase();
        setValueInput(searchBoxInputSpeech, speechResult);
        contentSpeech.textContent = speechResult;
        tmpSaveRecognitionText = speechResult;
        if (!IsNullOrEmty(tmpSaveRecognitionText))
            $('#btnSearchVoice').fadeIn(0);
    }

    recognition.onspeechend = function () {
        recognition.stop();
        btnStartSpeak.classList.remove('active');
        titleSpeech.textContent = "Nhấn để nói";
        $('#btnStartSpeak').attr('onclick', 'RunSpeech()');
        if (!IsNullOrEmty(tmpSaveRecognitionText))
            $('#btnSearchVoice').fadeIn(0);
        
    }

    recognition.onerror = function (event) {
        btnStartSpeak.classList.remove('active');
        switch (event.error) {
            case "no-speech": titleSpeech.textContent = "Không nhận được âm thanh! Nhấn để thử lại."; break;
            case "not-allowed": titleSpeech.textContent = "Vui lòng cho phép sử dụng micro trên website!"; break;
            default: titleSpeech.textContent = "Xảy ra lỗi! Thử lại hoặc tải lại trang!"; break;
        }
        clearTimeout(timeoutTitleSpeechChange);
        setValueInput(searchBoxInputSpeech, '');
        contentSpeech.textContent = "";
        $('#btnStartSpeak').attr('onclick', 'RunSpeech()');
    }

    recognition.onaudiostart = function (event) {
        //Fired when the user agent has started to capture audio.
        //console.log('SpeechRecognition.onaudiostart');
    }

    recognition.onaudioend = function (event) {
        //Fired when the user agent has finished capturing audio.
        //console.log('SpeechRecognition.onaudioend');
    }

    recognition.onend = function (event) {
        //Fired when the speech recognition service has disconnected.
        //console.log('SpeechRecognition.onend');
    }

    recognition.onnomatch = function (event) {
        //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
        //console.log('SpeechRecognition.onnomatch');
    }

    recognition.onsoundstart = function (event) {
        //Fired when any sound — recognisable speech or not — has been detected.
        //console.log('SpeechRecognition.onsoundstart');
    }

    recognition.onsoundend = function (event) {
        //Fired when any sound — recognisable speech or not — has stopped being detected.
        //console.log('SpeechRecognition.onsoundend');
    }

    recognition.onspeechstart = function (event) {
        //Fired when sound that is recognised by the speech recognition service as speech has been detected.
        //console.log('SpeechRecognition.onspeechstart');
    }

    recognition.onstart = function (event) {
        //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
        //console.log('SpeechRecognition.onstart');
    }
}

function StopSpeech() {
    if (recognition !== undefined) {
        recognition.stop();
        clearTimeout(timeoutTitleSpeechChange);
        btnStartSpeak.classList.remove('active');
        titleSpeech.textContent = "Nhấn để nói";
    }
    $('#btnStartSpeak').attr('onclick', 'RunSpeech()');
}

function setValueInput(list, value) {
    for (n = 0; n < list.length; ++n) {
        list[n].value = value;
    }
}

function SubmitSearchProductForm() {
    location.href = "/san-pham?keyword=" + tmpSaveRecognitionText;
}

function RawSearchProductPrice(priceObj) {
    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
        html = `${_textOhterResource.contact}`;
    } else {
        if (priceObj.length === 1) {
            html = `${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}
                    <del class="font-12">${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del>`;
        } else {
            let price = priceObj.map(x => x.priceOut);
            let discount = priceObj.map(x => x.discount);
            let priceDiscount = priceObj.map(x => x.priceOut - x.discount);
            let priceIsAllEqual = price.every((val, i, arr) => val === arr[0]);
            let discountIsAllEqual = discount.every((val, i, arr) => val === arr[0]);
            let priceDiscountIsAllEqual = priceDiscount.every((val, i, arr) => val === arr[0]);
            if (priceIsAllEqual && discountIsAllEqual) {
                html = `${priceObj[0].priceOut === 0 ? _textOhterResource.contact : (priceObj[0].discount > 0 ? FormatToVND(CalDiscountPrice(priceObj[0].priceOut, priceObj[0].discount)) : FormatToVND(priceObj[0].priceOut))}
                        <del class="font-12">${priceObj[0].discount > 0 ? FormatToVND(priceObj[0].priceOut) : ""}</del>`;
            } else if (priceDiscountIsAllEqual) {
                html = `<h4>${FormatToVND(priceDiscount[0])}</h4>`;
            } else {
                let min = GetArrayMin(priceDiscount);
                let max = GetArrayMax(priceDiscount);
                html = `${FormatToVND(min)} ~ ${FormatToVND(max)}`;
            }
        }
    }
    return html;
}

function RawSearchProductRatioDiscount(priceObj) {
    let html = '';
    if (priceObj == undefined || priceObj == null || priceObj.length === 0) {
    } else {
        if (priceObj.length === 1) {
            if (priceObj[0].discount > 0) {
                tmpRatio = CalDiscountPriceRatioSearch(priceObj[0].discount, priceObj[0].priceOut);
                html = `<span class="discount_ratio search_box">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span>`;
            }
        } else {
            let price = priceObj.map(x => x.priceOut);
            let discount = priceObj.map(x => x.discount);
            let ratioDiscount = priceObj.map(x => CalDiscountPriceRatioSearch(x.discount, x.priceOut));
            let priceIsAllEqual = price.every((val, i, arr) => val === arr[0]);
            let discountIsAllEqual = discount.every((val, i, arr) => val === arr[0]);
            if (priceIsAllEqual && discountIsAllEqual) {
                if (priceObj[0].discount > 0) {
                    tmpRatio = CalDiscountPriceRatioSearch(priceObj[0].discount, priceObj[0].priceOut);
                    html = `<span class="discount_ratio search_box">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span>`;
                }
            } else {
                let max = GetArrayMax(ratioDiscount);
                if (max > 0) {
                    tmpRatio = max;
                    html = `<span class="discount_ratio search_box">-${tmpRatio < 10 ? "0" + tmpRatio : tmpRatio}%</span>`;
                }
            }
        }
    }
    return html;
}

function CalDiscountPriceRatioSearch(num1, num2) {
    if (num1 == null || num1 === 0) return 0;
    let result = parseInt(num1 * 100 / num2);
    return result > 0 ? result : 1;
}
