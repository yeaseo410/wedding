const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "all 0.8s ease-out";
    observer.observe(section);
});

const canvas = document.getElementById('sakura');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const petals = [];

class Petal {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * -1;
        this.size = Math.random() * 8 + 5;
        this.speed = Math.random() * 1 + 1;
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 0.2 - 0.1;
    }

    draw() {
        ctx.beginPath();
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle * Math.PI / 180);
        // 꽃잎 모양과 색상 설정
        ctx.fillStyle = '#ffb7c5'; // 연분홍색
        ctx.arc(0, 0, this.size, 0, Math.PI / 2); // 반원 형태로 꽃잎 느낌
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.y += this.speed;
        this.x += Math.sin(this.y / 50); // 바람에 흔들리는 효과
        this.angle += this.spin;

        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animate);
}

// 꽃잎 개수 설정 (30~50개가 적당함)
for (let i = 0; i < 50; i++) {
    petals.push(new Petal());
}

animate();

// 화면 크기 조절 대응
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("계좌번호가 복사되었습니다.");
    }).catch(err => {
        // 구형 브라우저 대응
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert("계좌번호가 복사되었습니다.");
    });
}
// 1. Firebase 초기화 (복사한 설정값으로 교체하세요)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 2. 메시지 불러오기 (실시간 반영)
database.ref('messages').on('value', (snapshot) => {
    const data = snapshot.val();
    const listElement = document.getElementById('guestbook-list');
    listElement.innerHTML = ''; // 초기화

    for (let id in data) {
        const msg = data[id];
        const card = `
            <div class="guestbook-card">
                <div class="name">FROM. ${msg.name}</div>
                <div class="content">${msg.message}</div>
                <div class="date">${msg.date}</div>
            </div>`;
        listElement.insertAdjacentHTML('afterbegin', card); // 최신글이 위로
    }
});

// 3. 메시지 저장하기
function saveMessage() {
    const name = document.getElementById('guest-name').value;
    const message = document.getElementById('guest-message').value;
    const date = new Date().toLocaleString();

    if (name && message) {
        database.ref('messages').push({
            name: name,
            message: message,
            date: date
        });
        alert("축하 메시지가 등록되었습니다!");
        toggleInput(); // 창 닫기
    } else {
        alert("성함과 메시지를 모두 입력해주세요.");
    }
}

const bgm = document.getElementById('bgm');
const musicContainer = document.getElementById('music-container');

function toggleMusic() {
    if (bgm.paused) {
        bgm.play();
        musicContainer.classList.add('playing');
        document.querySelector('.music-text').innerText = "BGM OFF";
    } else {
        bgm.pause();
        musicContainer.classList.remove('playing');
        document.querySelector('.music-text').innerText = "BGM ON";
    }
}

var container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
var options = { 
    center: new kakao.maps.LatLng(37.5240, 127.1332), // 오륜교회 좌표
    level: 3 // 확대 레벨
};

var map = new kakao.maps.Map(container, options); // 지도 생성

// 마커가 표시될 위치입니다 
var markerPosition  = new kakao.maps.LatLng(37.5240, 127.1332); 

// 마커를 생성합니다
var marker = new kakao.maps.Marker({
    position: markerPosition
});

// 마커가 지도 위에 표시되도록 설정합니다
marker.setMap(map);
