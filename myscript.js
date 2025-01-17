var session_time, interval_time, start_time, left_time;
var images = [];
var index = 0;
var iter;

var img_source = 'fgall';
var random_order = false;


var urls;

(function(){

	loadURLs(img_source);
	console.log(img_source);


}());

function modeSelect(e){
	img_source = e;
	console.log(e);
	if(e == 'lf'){
		$('.files').css('visibility','visible');
	}
	else{
		$('.files').css('visibility','hidden');
		loadURLs(img_source);
	}
}



function startTimer() {

	iter = Number($("input.times").val());

	if(img_source == 'lf') {
		images = getImages(iter);
		initialize();    
		changeImage(images[index]);
		countdown(session_time, 0);
	}
	if(img_source == 'fgall' || img_source == 'fgch' )  { 
		random_order = true;
		loadURLs(img_source);
		initialize();    
		if(images[index][1] !== undefined) $(".title").html(images[index][1]);
		else $(".title").html('');
		changeImage(images[index]);
		countdown(session_time, 0);       
	}

}


function loadURLs(type){
	var req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
	if(type == 'fgall') req.open("get", "./urls.txt", true); // アクセスするファイルを指定
	if(type == 'fgch') req.open("get", "./cinesco_hd.txt", true); // アクセスするファイルを指定
	req.send(null); // HTTPリクエストの発行

	// レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
	req.onload = function(){
		var text = req.responseText; // 渡されるのは読み込んだCSVデータ
		var arr = text.split('\n');
		var res = [];
		for(var i = 0; i < arr.length; i++){
			//空白行が出てきた時点で終了
			if(arr[i] == '') break;
			//","ごとに配列化
			res[i] = arr[i].split(',');
		}
		urls = res;
	}
	images = urls;
}

function getImages(i) {
	var images = [];
	$(".image").each(function () {
		images.push($(this).attr("src"));
	});
	return images;
}





function initialize() {
	if(!random_order) index = 0;
	else if(random_order) index = Math.floor(Math.random()*(images.length-1));
	left_time = 0;
	$(".slideshow").html("");
	$(".timer-wrapper").addClass("fullscreen");
	$(".countdown").css({ color: "white" });
	session_time = Number($("input.session").val());
	interval_time = Number($("input.interval").val());
	start_time = Date.now();
}


function changeImage(e) {
	var content = "<img class='slide-image uk-align-center' src='" + e + "'>";
	$(".slideshow").html(content);
}



var id;
function countdown(time, type) {
	id = setTimeout(function () {
		left_time = (time + 1) * 1000 - (Date.now() - start_time);
		if (left_time <= 0) {
			left_time = 0;
			if (type == 0) {
				$(".countdown").css({ color: "red" });
				start_time= Date.now();
				countdown(interval_time, 1);
			} else if (type == 1) {
				if (index == images.length - 1)  closeTimer(); 
				$(".countdown").css({ color: "white" });
				if(!random_order) index++;
				else if(random_order) {
					images.splice( index, 1 ) ;
					index = Math.floor(Math.random()*(images.length-1));
					if(images[index][1] !== undefined) $(".title").html(images[index][1]);
					else $(".title").html('');
				}
				changeImage(images[index]);
				start_time = Date.now();
				countdown(session_time, 0);
			}
			return;
		}
		var d = new Date(left_time);
		var m = d.getMinutes();
		var s = d.getSeconds();
		m = ("0" + m).slice(-2);
		s = ("0" + s).slice(-2);
		if (type == 0) $(".countdown").html(m + ":" + s);
		if (type == 1) $(".countdown").html("Until Next " + m + ":" + s);
		countdown(time,type);
	}, 100);
}


function closeTimer() {
	clearTimeout(id);
	delete session_time, interval_time, start_time, left_time;
	$(".timer-wrapper").removeClass("fullscreen");
	$("div .timer-wrapper").html(
		"<a href='#' onclick='closeTimer();' class='uk-icon-link uk-align-left uk-margin close' uk-icon='icon: close; ratio: 3.5'></a><span class='countdown'>00:00</span><div class='slideshow'></div>"
	);
}




function dragover(e) {
	e.preventDefault();
}


function drop(e) {
	e.preventDefault();
	files = e.dataTransfer.files;
	var num = 0;
	for (var i = 0; i < files.length; i++) {
		if (!files[i] || files[i].type.indexOf("image/") < 0) {
			continue;
		}

		var fileReader = new FileReader();

		fileReader.onload = function (event) {
			var loadedImageUri = event.target.result;
			var img = "<img class='image' src='" + loadedImageUri + "'>";
			var imgComp = "<div class='uk-card-media-top'>" + img + "</div>";
			var body =
				"<p><a onclick='removeImage(" +
				num +
				")' href='#' class='uk-icon-link' uk-icon='trash'></a></p>";
			var bodyComp = "<div class='uk-card-body'>" + body + "</div>";
			var component =
				"<div class='imagecard-" +
				num +
				"'><div class='uk-card uk-card-default'>" +
				imgComp +
				bodyComp +
				"</div></div>";
			$(component).appendTo("#prevbox");
			num++;
		};
		fileReader.readAsDataURL(files[i]);
	}
}


function removeImage(e) {
	$("div.imagecard-" + e).remove();
}

// document.addEventListener('keydown', (event) => {
	// var keyName = event.key;
	// if(keyName == 'ArrowRight'){
		// index++;
		// initialize();
		// changeImage(images[index]);
		// countdown(session_time, 0);       
	// }
	// if(keyName == 'ArrowLeft'){
		// index--;
		// initialize();
		// changeImage(images[index]);
		// countdown(session_time, 0);       
	// }
// });
