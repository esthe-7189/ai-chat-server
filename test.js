
//타입 선언
GIRL_TYPE = {
    thoughtful: {
        type: "thoughtful",
        img: "./images/thoughtful.jpg",
    },
    cute: {
        type: "cute",
        img: "./images/cute.jpg",
    },
    cool: {
        type: "cool",
        img: "./images/cool.jpg",
    },
};

  
//내가 선택한 친구 선언
const selectedType = null;


// 타입 선택 처리
function selectType(girlfriendType) {
  // 선택시 style명:active
  // 모든 타입 선택시 스타일 해제, forEach사용
  document.querySelectorAll(".girlfriend-option").forEach((option)=>{
    option.classList.remove("active");
  });

  // 1)선택한 타입 class 스타일 추가 2)선택/클릭시 스타일 class 생성 
  document.querySelector(girlfriendType).classList.add("active");

  // 선택된 친구 타입 저정하고 채팅 리셋
  selectedType = GIRL_TYPE[girlfriendType];
  resetChat();
}

function resetChat() {
    const chatMessages = document.getElementById("chatMessages");
    chatMessages.innerHTML = "";

}

// 채팅 메시지 전송 처리
async function sendMessage() {
  
  //사용자 입력 필드  
  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if(message){
    //채팅 목록에 사용자 메시지 표시하고, 입력필드 비우기 
    displayMessage("user", message);
    input.value = "";

    // ChatGPT OpenAI에 문자 보내기
    fetchResponse(message);

  }else{
    alert("메시지를 입력하세요.");
  }
     
}

// 서버 응답 표시(채팅 말풍선들)
function displayMessage(sender, text) {
  // 채팅 메시지 목록 
  const chatContent = document.getElementById("chatMessages");
  
  // 새로운 채팅 리스트 객체 생성
  const conBox = document.createAttribute("div");
  const inText = document.createAttribute("div");
  const inIcon = document.createAttribute("div");

  // 카톡처럼 사용자는 우측, ai응답은 좌측에 노출
  if(sender === "user"){
    conBox.classList("con-box, right-t");
    chatContent.appendChild(conBox);

    inText.classList("inner-text, right-color");
    conBox.appendChild(inText);

    inIcon.classList("inner-icon");
    conBox.appendChild(inIcon);
    

  }else{
    conBox.classList("con-box");
    chatContent.appendChild(conBox);

    inIcon.classList("inner-icon");
    conBox.appendChild(inIcon);
    
    inText.classList("inner-text, left-color");
    conBox.appendChild(inText);

  }

  // -아이콘 img 객체 생성 -사용자 이미지 경로 -class 추가(css명: inner-icon)
  const profileImg = document.createAttribute("img");
  profileImg.src = sender === "user" ? "./images/user-profile.jpg" : selectedType.img;
  inIcon.appendChild(profileImg);

  //-새메시지 추가
  inText.inText = text;

  //목록에 말풍선 표시하고, 스크롤 처리 
  chatContent.innerHTML(conBox);
  chatContent.scrollTop()
 
}

// ChatGPT OpenAI API 호출
async function fetchResponse(message) {
   try {
    const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            message,
            girlfriendType: selectedType.type,
        }),
    });
    const data = await response.json();
    displayMessage("bot", data.replay.content)

   } catch (error) {
    displayMessage("bot", "An error occurred. please try again. ");
   }

}
