const menuBtn = document.getElementById("menuBtn");
const dropdown = document.getElementById("dropdown");

if (menuBtn) {
  menuBtn.onclick = () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  };
}

const toggleTheme = document.getElementById("toggleTheme");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (toggleTheme) toggleTheme.textContent = "☀️";
}

if (toggleTheme) {
  toggleTheme.onclick = () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      toggleTheme.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    } else {
      toggleTheme.textContent = "🌙";
      localStorage.setItem("theme", "light");
    }
  };
}

function isLowContrast(color1, color2) {
  function getLuminance(hex) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return Math.abs(getLuminance(color1) - getLuminance(color2)) < 100;
}

function generateQR() {
  const text = document.getElementById("text").value.trim();
  const size = parseInt(document.getElementById("size").value);

  if (!text) return alert("Enter text");

  let qrColor = document.getElementById("qrColor").value;
  let bgColor = document.getElementById("bgColor").value;

  if (isLowContrast(qrColor, bgColor)) {
    alert("Low contrast! Using safe colors.");
    qrColor = "#000000";
    bgColor = "#ffffff";
  }

  const qrBox = document.getElementById("qrcode");
  const previewBox = document.getElementById("previewBox");

  qrBox.innerHTML = "";

  const tempDiv = document.createElement("div");

  new QRCode(tempDiv, {
    text: text,
    width: size,
    height: size,
    colorDark: qrColor,
    colorLight: bgColor,
    correctLevel: QRCode.CorrectLevel.H
  });

  qrBox.appendChild(tempDiv);
  previewBox.classList.remove("hidden");

  setTimeout(() => {
    const img = tempDiv.querySelector("img");
    if (!img) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const scale = 2;
    canvas.width = size * scale;
    canvas.height = size * scale;

    const base = new Image();
    base.src = img.src;

    base.onload = function () {
      ctx.drawImage(base, 0, 0, canvas.width, canvas.height);

      const logoInput = document.getElementById("logoInput");

      if (logoInput && logoInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const logo = new Image();
          logo.src = e.target.result;

          logo.onload = function () {
            const logoSize = canvas.width * 0.22;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;

            const padding = 10;

            ctx.fillStyle = "#fff";
            ctx.fillRect(
              x - padding,
              y - padding,
              logoSize + padding * 2,
              logoSize + padding * 2
            );

            ctx.drawImage(logo, x, y, logoSize, logoSize);

            canvas.style.width = size + "px";
            canvas.style.height = size + "px";

            qrBox.innerHTML = "";
            qrBox.appendChild(canvas);
          };
        };

        reader.readAsDataURL(logoInput.files[0]);
      } else {
        canvas.style.width = size + "px";
        canvas.style.height = size + "px";

        qrBox.innerHTML = "";
        qrBox.appendChild(canvas);
      }
    };
  }, 200);

  const options = document.getElementById("downloadOptions");
  if (options) options.style.display = "block";

  const scrollBtn = document.getElementById("scrollBtn");
  if (scrollBtn) scrollBtn.style.display = "block";

  setTimeout(() => {
    document.getElementById("qrcode").scrollIntoView({
      behavior: "smooth"
    });
  }, 300);

  saveHistory(text);
}

function downloadPNG() {
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  link.download = "qr.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const canvas = document.querySelector("#qrcode canvas");
  if (!canvas) return;

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  pdf.addImage(imgData, "PNG", 10, 10, 100, 100);
  pdf.save("qr.pdf");
}

function saveHistory(data) {
  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];

  history.push({
    data,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("qrHistory", JSON.stringify(history));
}

function loadHistory() {
  const list = document.getElementById("historyList");
  if (!list) return;

  let history = JSON.parse(localStorage.getItem("qrHistory")) || [];

  list.innerHTML = "";

  history.reverse().forEach(item => {
    list.innerHTML += `
      <p>${item.data}<br><small>${item.time}</small></p>
      <hr>
    `;
  });
}

window.onload = loadHistory;

const scrollBtn = document.getElementById("scrollBtn");

if (scrollBtn) {
  scrollBtn.onclick = () => {
    document.getElementById("qrcode").scrollIntoView({
      behavior: "smooth"
    });
  };
}

let currentStream = null;
let useBackCamera = true;

async function startCamera() {
  const video = document.getElementById("video");

  const scanBox = document.getElementById("scanBox");
  if (scanBox) scanBox.classList.remove("active");

  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: useBackCamera ? { exact: "environment" } : "user"
      }
    });

    currentStream = stream;
    video.srcObject = stream;
    await video.play();

    setTimeout(() => startAutoScan(), 500);

  } catch {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    currentStream = stream;
    video.srcObject = stream;
    await video.play();

    setTimeout(() => startAutoScan(), 500);
  }
}

const switchBtn = document.getElementById("switchCameraBtn");
if (switchBtn) {
  switchBtn.onclick = () => {
    useBackCamera = !useBackCamera;
    startCamera();
  };
}

const scanBtn = document.getElementById("scanBtn");
const fileInput = document.getElementById("scanImageInput");
const scanResult = document.getElementById("scanResult");
const copyBtn = document.getElementById("copyBtn");

if (scanBtn && fileInput) {
  scanBtn.onclick = () => {
    const file = fileInput.files[0];
    if (!file) return alert("Upload file");

    const reader = new FileReader();

    reader.onload = e => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, canvas.width, canvas.height);

        if (code) {
          scanResult.textContent = code.data;
          copyBtn.style.display = "block";
        } else {
          scanResult.textContent = "No QR found";
        }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };
}

let scanning = false;

function startAutoScan() {
  const video = document.getElementById("video");
  const canvas = document.getElementById("scanCanvas");
  const ctx = canvas.getContext("2d");

  const scanResult = document.getElementById("scanResult");
  const copyBtn = document.getElementById("copyBtn");
  const scanBox = document.getElementById("scanBox");

  if (!canvas || !video) return;

  scanning = true;

  function scanFrame() {
    if (!scanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const scanSize = canvas.width * 0.5;
      const x = (canvas.width - scanSize) / 2;
      const y = (canvas.height - scanSize) / 2;

      const imageData = ctx.getImageData(x, y, scanSize, scanSize);
      const code = jsQR(imageData.data, scanSize, scanSize);

      if (code && code.data) {
        if (scanBox) scanBox.classList.add("active");

        scanResult.textContent = code.data;
        copyBtn.style.display = "block";

        navigator.clipboard.writeText(code.data);

        scanning = false;
        return;
      }
    }

    requestAnimationFrame(scanFrame);
  }

  setTimeout(scanFrame, 500);
}
