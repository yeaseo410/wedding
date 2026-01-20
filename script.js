// 1. 스크롤 애니메이션 (요소가 화면에 보일 때 나타남)
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
        this.size = Math.random() * 7 + 3;
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