#  Stylish QR Code Generator

A modern and feature-rich QR Code Generator and Scanner built using **HTML, CSS, and JavaScript**.

This project allows users to generate high-quality QR codes with customization options and scan QR codes from images and PDFs.

---

## 🚀 Features

### 🔹 QR Code Generator
- Generate QR codes from text or URLs
- Customize:
  - Color
  - Background
  - Size
- High-quality QR output (HD rendering)
- Add logo inside QR code (centered with safe padding)

### 🔹 Download Options
- Download QR as:
  - 📷 PNG Image
  - 📄 PDF File

### 🔹 QR Scanner
- Scan QR codes from:
  - 🖼️ Images
  - 📑 PDF files
- Extract and display content
- One-click copy to clipboard

### 🔹 UI / UX Features
- 🌙 Dark Mode (with persistence)
- ☀️ Light Mode toggle
- Smooth animations
- Responsive design
- Scroll-to-preview feature

### 🔹 History System
- Saves generated QR data
- Displays history with timestamp
- Scrollable UI (no layout break)

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**

### Libraries Used:
- `qrcodejs` → QR generation  
- `jsQR` → QR scanning  
- `pdf.js` → PDF reading  
- `jsPDF` → PDF download  

---

## 📁 Project Structure
📦 QR-Code-Generator
┣ 📄 home.html → Scanner page
┣ 📄 scan.html → QR generator
┣ 📄 history.html → History
┣ 📄 about.html → About page
┣ 📄 style.css → Styling
┣ 📄 script.js → Logic
┗ 📄 logo.png → App logo


---

## 📸 Screenshots

> (Add screenshots here for better presentation)

---

## ⚙️ How It Works

### 🔹 QR Generation
- Uses `qrcodejs` to generate QR
- Converts to canvas for:
  - High quality rendering
  - Logo overlay support

### 🔹 QR Scanning
- Uses `jsQR` to decode QR from image
- For PDF:
  - `pdf.js` renders page → canvas
  - QR is scanned from canvas pixels

### 🔹 Dark Mode
- Uses `localStorage` to save theme
- Applied globally across all pages

---

## 🧠 Key Concepts Used

- Canvas manipulation
- Image processing
- File handling (Image + PDF)
- DOM manipulation
- Local Storage
- UI/UX design

---

## 🔗 Live Demo

> (Add your live link if deployed)

---

## 👨‍💻 Author

**Sameer Kumar**

- GitHub: https://github.com/samkr214

---

## ⭐ Contribute

If you like this project, feel free to:
- ⭐ Star the repo
- 🍴 Fork it
- 🛠️ Improve it

---

## 📌 Future Improvements

- Bulk QR generation (optimized UI)
- QR with gradient styles
- Export history
- Multi-page PDF scanning

---

## 📄 License

This project is open-source and free to use.