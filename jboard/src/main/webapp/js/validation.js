/**
 * 
 * 폼유효성 검사 자바스크립트
 * 
 */


//유효성 검사에 사용할 정규표현식
const reUid   = /^[a-z]+[a-z0-9]{4,19}$/g;
const rePass  = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{5,16}$/; //영소문자대문자숫자특수문자까지
const reName  = /^[가-힣]{2,10}$/ 
const reNick  = /^[a-zA-Zㄱ-힣0-9][a-zA-Zㄱ-힣0-9]*$/;
const reEmail = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
const reHp    = /^01(?:0|1|[6-9])-(?:\d{4})-\d{4}$/;

//유효성 검사 상태 변수
let isUidOk = false;
let isPassOk = false;
let isNameOk = false;
let isNickOk = false;
let isEmailOk = false;
let isHpOk = false;

document.addEventListener('DOMContentLoaded', function(){
	
	const btnCheckUid = document.getElementById('btnCheckUid');
	const btnCheckNick = document.getElementById('btnCheckNick');
	const btnCheckEmail = document.getElementById('btnCheckEmail');
	const btnEmailCode = document.getElementById('btnEmailCode');

	const uidResult = document.getElementsByClassName('uidResult')[0];
	const nickResult = document.getElementsByClassName('nickResult')[0];
	const emailResult = document.getElementsByClassName('emailResult')[0];
	const hpResult = document.getElementsByClassName('hpResult')[0];
	const passResult = document.getElementsByClassName('passResult')[0];
	const nameResult = document.getElementsByClassName('nameResult')[0];
	
	const auth = document.getElementsByClassName('auth')[0];
	
	const form = document.getElementsByTagName('form')[0];
	
	///////////////////////////////////////////////////////
	// 아이디 검사
	///////////////////////////////////////////////////////
	btnCheckUid.addEventListener('click', function(e){
					
		const value = form.uid.value;
		console.log('value : ' + value);
		
		//아이디 유효성 검사
		if(!value.match(reUid)){ //내가입력한 정규표현식이 일치하지않으면
			uidResult.innerText = '아이디가 유효하지 않습니다.';
			uidResult.style.color = 'red';
			isUidOk=false;
			return;
		}
		
		//아이디 중복체크 요청
		fetch('/jboard/user/check.do?col=uid&value='+value)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if(data.count > 0){
					uidResult.innerText = '이미 사용 중인 아이디 입니다.';
					uidResult.style.color = 'red';
					isUidOk=false;
				}else{
					uidResult.innerText = '사용 가능한 아이디 입니다.';
					uidResult.style.color = 'green';
					isUidOk=true;
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
	
	///////////////////////////////////////////////////////
	// 비밀번호 검사
	///////////////////////////////////////////////////////
	form.pass2.addEventListener('focusout', function(e){
		
		const pw1 = form.pass1.value;
		const pw2 = form.pass2.value;
		
		//비밀번호 유효성 검사
		if(!pw1.match(rePass)){
			passResult.innerText = '비밀번호가 유효하지 않습니다.';
			passResult.style.color = 'red';
			isPassOk=false;
			return;
		}
		//비밀번호 2회 일치여부
		if(pw1==pw2){
			passResult.innerText = '비밀번호가 일치합니다.';
			passResult.style.color = 'green';
			isPassOk=true;
		}
		else{
			passResult.innerText = '비밀번호가 일치하지 않습니다.';
			passResult.style.color = 'red';
			isPassOk=false;
		}
		
	});
	
	///////////////////////////////////////////////////////
	// 이름 검사
	///////////////////////////////////////////////////////
	form.name.addEventListener('focusout',function(e){
		const value = form.name.value;
		
		if(!value.match(reName)){
			nameResult.innerText = '이름이 유효하지않습니다.';
			nameResult.style.color = 'red';
			isNameOk = false;
		}
		else{
			nameResult.innerText = 'check';
			nameResult.style.color = 'green';
			isNameOk = true;
		}
			
			
		
	});
	
	
	///////////////////////////////////////////////////////
	// 별명 검사
	///////////////////////////////////////////////////////
	btnCheckNick.addEventListener('click', function(e){
					
		const value = form.nick.value;
		console.log('value : ' + value);
		
		//별명 유효성 검사
		if(!value.match(reNick)){
			nickResult.innerText = '별명이 유효하지 않습니다.';
			nickResult.style.color = 'red';
			isNickOk=false;
			return
		}
		
		//별명 중복 검사
		fetch('/jboard/user/check.do?col=nick&value='+value)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if(data.count > 0){
					nickResult.innerText = '이미 사용 중인 별명 입니다.';
					nickResult.style.color = 'red';
					isNickOk=false;
				}else{
					nickResult.innerText = '사용 가능한 별명 입니다.';
					nickResult.style.color = 'green';
					isNickOk=true;
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
	
	
	///////////////////////////////////////////////////////
	// 이메일 검사
	///////////////////////////////////////////////////////
	
	// 이메일 중복체크 요청
	let preventDblClick = false; //이중클릭방지를위한 상태변수
	
	btnCheckEmail.addEventListener('click', function(e){
		
		//이중 클릭 방지
		if(preventDblClick){
			return;
		}
		
		const value = form.email.value;
		console.log('value : ' + value);
		
		//이메일 유효성 검사
		if(!value.match(reEmail)){
			emailResult.innerText='이메일이 유효하지 않습니다.';
			emailResult.style.color= 'red';
			isEmailOk=false;
			return
		}
		
		//이중 클릭 방지 실행
		preventDblClick = true;
		emailResult.innerText='이메일 인증코드 전송 중입니다.';
		emailResult.style.color= 'green'
		
		
		fetch('/jboard/user/check.do?col=email&value='+value)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				
				//이중클릭방지 해제
				preventDblClick = false;
				if(data.count > 0){
					emailResult.innerText = '이미 사용 중인 이메일 입니다.';
					emailResult.style.color = 'red';
				}else{
					emailResult.innerText = '이메일 인증번호를 입력하세요.';
					emailResult.style.color = 'green';
					
					// 인증번호 입력 필드 띄우기
					auth.style.display = 'block';						
					
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
	
	// 이메일 코드 전송 버튼 클릭
	btnEmailCode.addEventListener('click', async function(e){
		
		const code = form.auth.value;
		
		//쿼리 문자열 생성(?code=1234)
		const params = new URLSearchParams();
		params.append("code", code);
		
		const response = await fetch('/jboard/user/check.do',{
			method: 'POST',
			body : params								
		});
		
		const data = await response.json();
		
		console.log(data);
		
		if(data.isMatched){
			alert('인증코드가 일치합니다.');
			emailResult.innerText='이메일이 인증되었습니다.';
			emailResult.style.color = 'green';
			isEmailOk=true;
		}
		else{
			alert('인증코드가 일치하지 않습니다.')
			emailResult.innerText='인증코드가 일치하지 않습니다.';
			emailResult.style.color = 'red';
			isEmailOk=false;
		}
		
	});
	
	
	///////////////////////////////////////////////////////
	// 휴대폰 검사
	///////////////////////////////////////////////////////
	
	// 휴대폰 중복 체크 
	form.hp.addEventListener('focusout', function(e){

		const value = form.hp.value;
		console.log('value : ' + value);
		
		if(!value.match(reHp)){
			hpResult.innerText = '휴대폰 번호가 유효하지 않습니다.';
			hpResult.style.color = 'red';
			isHpOk=false;
			return;
		}
		
		fetch('/jboard/user/check.do?col=hp&value='+value)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				if(data.count > 0){
					hpResult.innerText = '이미 사용 중인 휴대폰 입니다.';
					hpResult.style.color = 'red';
					isHpOk=false;
				}else{
					hpResult.innerText = '사용 가능한 휴대폰 입니다.';
					hpResult.style.color = 'green';
					isHpOk=true;
				}
			})
			.catch(err => {
				console.log(err);
			});
	});
	
	
	//최종 폼 전송 처리
	form.addEventListener('submit',function(e){
		
		//기본 폼전송 해제
		e.preventDefault();
		
		if(!isUidOk){//아이디가 유효하지않으면
			alert('아이디를 확인하세요.')
			return;
		}
		if(!isPassOk){//비밀번호가 유효하지않으면
			alert('비밀번호를 확인하세요.')
			return;
		}
		if(!isNameOk){//이름이 유효하지않으면
			alert('이름를 확인하세요.')
			return;
		}
		if(!isNickOk){//별명이 유효하지않으면
			alert('별명을 확인하세요.')
			return;
		}
		if(!isEmailOk){//이메일이 유효하지않으면
			alert('이메일을 확인하세요.')
			return;
		}
		if(!isHpOk){//휴대폰이 유효하지않으면
			alert('휴대폰을 확인하세요.')
			return;
		}
		
		//최종 폼 전송 실행
		form.submit();
	});
	
	
	
}); // DOMContentLoaded 끝






