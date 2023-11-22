# Flip-Counter  
[시간, 스톱워치, 업카운, 다운카운트]가 가능한 플립 카운터 입니다.
  
[DEMO](https://hyunjin912.github.io/flip-counter)  

![스크린샷](/screenshots/screenshot-01.png)

## 사용법
```html
<div id="adtCount"></div>
```
```javascript
document.querySelector('#adtCount').setCount();
```
  
## 옵션 
- type - 'time' | 'stopwatch' | 'upcount' | 'downcount'(기본: 'time')
- start - 시작
  - 'stopwatch'인 경우 - 'hh:mm:ss'
  - 'upcount' | 'downcount'인 경우 - '숫자'(digits를 고려해야 함) 
- end - 종료
  - 'stopwatch'인 경우 - 'hh:mm:ss'
  - 'upcount' | 'downcount'인 경우 - '숫자'(digits를 고려해야 함) 
- digits - '--count'타입에서 사용할 자릿 수

```javascript
interface StopwatchOption {
  type: string,
  start: string,
  end: string
}
interface CountOption {
  type: string,
  digits: number,
  start: string,
  end: string
}
const opt = {} as StopwatchOption | CountOption;

document.querySelector('.v1').setControl(opt);
```
