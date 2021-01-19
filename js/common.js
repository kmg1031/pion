
	console.log('common js');


	/*********************  public functions 	 	**********************/
	function addEvent(selector, trigger, func){
		var elarr = document.querySelectorAll(selector);
		elarr.forEach(e => {
			e.addEventListener(trigger,func);
		});
	}

	function getEId(id){
		return document.getElementById(id);
	}
	// vanilla ajax v0.2
	function ajax(ajaxObj){

		var url =  ajaxObj.url || "/";
		var data =  ajaxObj.data || "";
		var method  =  ajaxObj.method  || "POST";
		var type  =  ajaxObj.type  || "post";
		var dataType  =  ajaxObj.dataType  || "json";
		var contentType =  ajaxObj.contentType || "application/json";
		var debug =  ajaxObj.debug || false;
		var success = ajaxObj.success || (function(result){
			debug && console.log("success");
		});
		var complete = ajaxObj.complete || (function(result){
			debug && console.log("complete");
		});
		var error = ajaxObj.error || (function(result){
			debug && console.log("error");
		});

		// 형식 변환
		if(dataType == "json"){
			data = JSON.stringify(data);
		}

		// xmlhttp
		var xml;
		if (window.XMLHttpRequest) { 
			xml = new XMLHttpRequest();
		}

		xml.onreadystatechange = function(){
			try{
				if (xml.readyState === XMLHttpRequest.DONE) {
					debug && console.log("respons "+ xml.status);
					if (xml.status === 200) {
						success(xml.responseText);
					}
					complete(xml.responseText);
				}
			}catch(e){
				debug && console.log("통신에러");
				error(xml.responseText);
			}
		};

		xml.open(method, url, true);
		xml.setRequestHeader('Content-Type', contentType);
		xml.send(data);
	}

	function viewText(text){
		document.getElementById("viewBox").innerText = text;
	}

	/*********************  public functions end 	**********************/





	/********************** 	action functions 	**********************/
	
	// 유저 추가
	addEvent("#userCreateBtn","click",function(){
		console.log("userCreateBtn");

		var userId = document.getElementById('createUserId');
		var userPw = document.getElementById('createUserPw');
		var userName = document.getElementById('createUserName');
		data = {
			userId : userId.value,
			userPw : userPw.value,
			userName : userName.value,
		}
		ajax({
			url : "/user/create",
			data : data,
			success : function(result){
				viewText(result);
			}
		});
	})

	//로그인
	addEvent("#loginBtn","click",function(){
		console.log("login test");

		var userId = document.getElementById('userId');
		var userPw = document.getElementById('userPw');
		data = {
			userId : userId.value,
			userPw : userPw.value,
		}
		ajax({
			url : "/login",
			data : data,
			success : function(result){
				viewText(result);
			}
		});
	})


/* 모달 컨트롤러
	// // 모달 이벤트 전파 방지
	// addEvent(".modal","click",function(event){
	// 	event.stopPropagation();
	// })

	// // 모달 show
	// addEvent("#loginModalbtn", "click", function(){
	// 	var loginModal = document.getElementById("loginModal");
	// 	document.getElementById('modalBackground').style.display = "block";
	// 	loginModal.style.display = "block";
	// 	console.log(loginModal);
	// });

	// // 공용 모달 hide
	// document.getElementById('modalBackground').addEventListener('click',function(){
	// 	this.style.display = "none";
	// 	var modal = document.querySelectorAll(".modal");
	// 	modal.forEach(e =>{
	// 		e.style.display = "none";
	// 	})
	// },false);
*/

	// ajax test
	addEvent("#pushBtn","click",function(){
		ajax({
			data :{
				mas : "test123124124",
			},
			url : "/push",
			success : function(result){
				viewText(result);
			}
		});
	})



	/********************** action functions  end	**********************/