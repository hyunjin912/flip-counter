/***************************************************************************************************************
* Author : Lee
* Plugin Name : adtCount
* File Name : adtCount.js
* Version : v1.00
****************************************************************************************************************/
(function(){
	var setCount = {
		set: function(adtCount, opt){
			var stopRendering;
			opt = opt||{};
			opt.type = opt.type||'time';
			opt.digits = opt.type === 'time'||opt.type === 'stopwatch' ? 6 : opt.digits||1; 
			switch(opt.type) {
				case 'time' :
					opt.start = null;
					opt.end = null;
					break;
				case 'stopwatch' :
					if(opt.start === undefined || opt.start === null) {
						opt.start = '01:00:00';
					}
					if(opt.end === undefined || opt.end === null) {
						opt.end = '00:00:00';
					}
					if(opt.start.length == 8
						&& opt.start.match(/\d{2}:\d{2}:\d{2}/) !== null
						&& opt.end.length == 8
						&& opt.end.match(/\d{2}:\d{2}:\d{2}/) !== null
					) {// 형식 일치

						var compareDateStart = new Date();
						var compareDateEnd = new Date();

						compareDateStart.setHours(opt.start.split(':')[0], opt.start.split(':')[1], opt.start.split(':')[2]);
						compareDateEnd.setHours(opt.end.split(':')[0], opt.end.split(':')[1], opt.end.split(':')[2]);

						compareDateStart = compareDateStart.getTime();
						compareDateEnd = compareDateEnd.getTime();

						if(compareDateStart > compareDateEnd) {// opt.start < opt.end 일치
							// opt.start = opt.start||'01:00:00';
							// opt.end = opt.end||'00:00:00';
							opt.start = opt.start;
							opt.end = opt.end;
						} else {
							stopRendering = true;
							console.error("end가 start와 같거나 클 수 없다\n올바른 예) start: '01:23:45', end: '00:12:34'");
						}
					} else {// 형식 불일치
						stopRendering = true;
						console.error("start 또는 end를 정해진 형식으로 작성하기\n올바른 예) start: '01:23:45', end: '00:12:34'");	
					}
				break;

				case 'downcount' :
				case 'upcount' :
					if(opt.start === undefined 
						|| opt.start === null 
						|| opt.end === undefined 
						|| opt.end === null
					) {// opt.start, opt.end가 undefined, null인 경우
						stopRendering = true;
						console.error("start와 end를 digits를 고려하여 숫자로 설정하기");
					} else {// opt.start, opt.end가 값이 있을 경우
						if(String(opt.start).match(/[^\d]/g)
							&& String(opt.end).match(/[^\d]/g)
						) {// 숫자 외의 것을 발견
							stopRendering = true;
							console.error("start와 end에는 숫자만 가능하다\n올바른 예)\ndowncount인 경우 => start: 20, end: 05\nupcount인 경우 => start: 10, end: 30");	
						} else {// 숫자 외의 것을 미발견
							if(String(opt.start).length == parseInt(opt.digits)
								&& String(opt.end).length == parseInt(opt.digits)
							) {// 자릿수 일치
								if(opt.type === 'downcount') {// 타입이 downcount
									if(parseInt(opt.start) > parseInt(opt.end)) {// opt.start > opt.end 일치
										opt.start = String(opt.start)||'9';
										opt.end = String(opt.end)||0;	
									} else {
										stopRendering = true;
						  				console.error("start가 end와 같거나 작을 수 없다\n올바른 예) start: 50, end: 20");	
									}
								} else {// 타입이 upcount
									if(parseInt(opt.end) > parseInt(opt.start)) {// opt.end > opt.start 일치
										opt.start = String(opt.start)||'0';
										opt.end = String(opt.end)||'9';	
									} else {
										stopRendering = true;
						  				console.error("end가 start와 같거나 작을 수 없다\n올바른 예) start: 20, end: 50");	
									}	
								}
								
					  		} else {
					  			// 자릿수 불일치
					  			stopRendering = true;
					  			console.error("start 또는 end의 자릿수를 digits와 일치시키기\n올바른 예) digits: 5, start: 00125");
					  		}
						}
					}
				break;
			}
			
			switch(opt.type) {
				case 'time' : 
				case 'stopwatch' :
					opt.type === 'time' ? adtCount.classList.add('time') : adtCount.classList.add('stopwatch');

					for(var i = 0; i < opt.digits / 2; i++) {
						var bundleElem = document.createElement('div');
						bundleElem.classList.add('bundle');
						bundleElem.innerHTML = ''
							+'<div class="digit">'
								+'<div class="hidden">'
									+'<span>1</span>'
								+'</div>'
								+'<div class="top">'
									+'<div class="front">'
										+'<span>0</span>'
									+'</div>'
									+'<div class="back">'
										+'<span>1</span>'
									+'</div>'
								+'</div>'
								+'<div class="bottom">'
									+'<span>0</span>'
								+'</div>'
							+'</div>'
							+'<div class="digit">'
								+'<div class="hidden">'
									+'<span>1</span>'
								+'</div>'
								+'<div class="top">'
									+'<div class="front">'
										+'<span>0</span>'
									+'</div>'
									+'<div class="back">'
										+'<span>1</span>'
									+'</div>'
								+'</div>'
								+'<div class="bottom">'
									+'<span>0</span>'
								+'</div>'
							+'</div>';

						adtCount.appendChild(bundleElem);
					}
				break;

				case 'downcount' : 
				case 'upcount' :
					opt.type === 'downcount' ? adtCount.classList.add('downcount') : adtCount.classList.add('upcount');

					var bundleElem = document.createElement('div');
					bundleElem.classList.add('bundle');
					for(var i = 0; i < opt.digits; i++) {
						var digitElem = document.createElement('div');
						digitElem.classList.add('digit');
						digitElem.innerHTML = ''
							+'<div class="hidden">'
								+'<span>1</span>'
							+'</div>'
							+'<div class="top">'
								+'<div class="front">'
									+'<span>0</span>'
								+'</div>'
								+'<div class="back">'
									+'<span>1</span>'
								+'</div>'
							+'</div>'
							+'<div class="bottom">'
								+'<span>0</span>'
							+'</div>';

						bundleElem.appendChild(digitElem);
					}
					adtCount.appendChild(bundleElem);
				break;
			}

			if(stopRendering) return;

			var digitElems = document.querySelectorAll('.digit');
			digitElems.forEach(function(digitElem, idx){
				var [hidden, top, bottom] = digitElem.children;
				var [front, back] = top.children;
				var topNextNum = hidden.children[0]; // 뒤에 숨겨져 있는 숫자 중 윗부분
				var bottomNextNum = back.children[0]; // 뒤에 숨겨져 있는 숫자 중 아랫부분
				var topPrevNum = front.children[0]; // 앞에 보이는 숫자 중 윗부분
				var bottomPrevNum = bottom.children[0]; // 앞에 보이는 숫자 중 아랫부분

				var nextNum; // 뒤에 숨겨져 있는 숫자를 담을 변수
				var prevNum; // 앞에 보이는 숫자를 담을 변수
				var timeNum; // Date객체에서 시간부분만 담을 변수(opt.type == 'time'||'stopwatch'), nextNum||prevNum 담을 변수
				var timeStr; // 시간부분을 ':'를 빼고 담을 변수(opt.type == 'time'||'stopwatch'), timeNum 담을 변수
				var compareTime; // 이전 숫자와 현재 숫자를 비교하기 위해 이전 숫자를 담을 변수

				if(opt.type === 'time' || opt.type === 'stopwatch') {
					if(opt.type === 'time') {
						nextNum = new Date();
						prevNum = new Date();
					}
					else if(opt.type === 'stopwatch') {
						var today = new Date();
						var startTime = opt.start.split(':');
						var endTime = opt.end.split(':').join('');

						nextNum = new Date(today.setHours(startTime[0], startTime[1], startTime[2]));
						prevNum = new Date(today.setHours(startTime[0], startTime[1], startTime[2]));
					}

					timeNum = prevNum.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
					timeStr = timeNum.split(':').join('');
					compareTime = timeStr[idx];
					topPrevNum.textContent = timeStr[idx];
					bottomPrevNum.textContent = timeStr[idx];
				}

				if(opt.type === 'downcount' || opt.type === 'upcount') {
					if(opt.type === 'downcount') {
						nextNum = opt.start;
						prevNum = opt.start;
					}
					else if(opt.type === 'upcount') {
						nextNum = opt.start;
						prevNum = opt.start;
					}
				
					timeStr = timeNum = prevNum;
					compareTime = timeStr[idx];
					topPrevNum.textContent = timeStr[idx];
					bottomPrevNum.textContent = timeStr[idx];
				}

				var clear1;
				var clear2;
				function nextNumChange() {
					if(opt.type === 'time' || opt.type === 'stopwatch') {
						if(opt.type === 'time') {
							nextNum.setSeconds(nextNum.getSeconds() + 1);
						}
						else if(opt.type === 'stopwatch') {
							if(timeStr === endTime) {
								clearInterval(clear1);
								clearTimeout(clear2);
								return;
							}
							nextNum.setSeconds(nextNum.getSeconds() - 1);
						}

						timeNum = nextNum.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
						timeStr = timeNum.split(':').join('');
					}

					if(opt.type === 'downcount' || opt.type === 'upcount') {
						if(opt.type === 'downcount') {
							if(timeStr === opt.end) {
								clearInterval(clear1);
								clearTimeout(clear2);
								return;
							}
							nextNum = Number(nextNum) - 1;
						}
						else if(opt.type === 'upcount') {
							if(timeStr === opt.end) {
								clearInterval(clear1);
								clearTimeout(clear2);
								return;
							}
							nextNum = Number(nextNum) + 1;
						}

						timeStr = timeNum = String(nextNum).padStart(opt.digits, '0');
					}

					if(compareTime != timeStr[idx]) {
						top.classList.add('tic');
						topNextNum.textContent = timeStr[idx];
						bottomNextNum.textContent = timeStr[idx];
					}

					compareTime = timeStr[idx];
					clear2 = setTimeout(prevNumChange, 500);
				}

				function prevNumChange() {
					if(opt.type === 'time' || opt.type === 'stopwatch') {
						if(opt.type === 'time') {
							prevNum.setSeconds(prevNum.getSeconds() + 1);
						}
						else if(opt.type === 'stopwatch') {
							prevNum.setSeconds(prevNum.getSeconds() - 1);
						}

						timeNum = prevNum.toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0];
						timeStr = timeNum.split(':').join('');
					}

					if(opt.type === 'downcount' || opt.type === 'upcount') {
						if(opt.type === 'downcount') {
							prevNum = Number(prevNum) - 1;
						}
						else if(opt.type === 'upcount') {
							prevNum = Number(prevNum) + 1;
						}

						timeStr = timeNum = String(prevNum).padStart(opt.digits, '0');
					}

					top.classList.remove('tic');
					topPrevNum.textContent = timeStr[idx];
					bottomPrevNum.textContent = timeStr[idx];
				}

				clear1 = setInterval(nextNumChange, 1000);
			});
		}
	}

	HTMLElement.prototype.setCount = function(opt){
		if(this.id !== 'adtCount') {
			console.error('id를 adtCount로 해야 합니다')
			return;	
		}
		setCount.set(this, opt);
	}

})();