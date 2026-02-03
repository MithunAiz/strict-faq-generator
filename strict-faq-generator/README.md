# Strict FAQ Generator

A web-based tool that uses Google's Gemini API to generate purely fact-based FAQs from any source text you provide. Uniquely, it enforces "strict" mode—ensuring every answer is derived **exclusively** from the source document with zero hallucinations, complete with verbatim reference quotes.

![Strict FAQ Generator UI](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000)
*(Note: Replace with actual screenshot)*

## ✨ Features

- **Strict Fact Generation**: Generates 5 FAQs using only the provided text.
- **Verbatim Citations**: Every answer includes the exact sentence from the source used to derive the answer.
- **Tone Selection**: Choose from Strict, Friendly, ELI5 (Explain Like I'm 5), Sarcastic, or Pirate modes.
- **Custom Q&A**: Ask specific questions about the document to get fact-checked answers.
- **PDF Export**: Download your generated FAQs as a clean PDF.
- **Modern UI**: Premium dark mode design with glassmorphism effects and smooth animations.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **AI Model**: Google Gemini 1.5 Flash (via API)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **PDF Generation**: [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- **Font**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox).
- A Google Gemini API Key. (Get one for free at [Google AI Studio](https://aistudio.google.com/)).

### Installation

1.  **Clone the repository** (or download usage code):
    ```bash
    git clone https://github.com/your-username/strict-faq-generator.git
    cd strict-faq-generator
    ```

2.  **Configure API Key**:
    - Open `script.js` in your code editor.
    - Locate the line:
      ```javascript
      const API_KEY = "YOUR_API_KEY_HERE";
      ```
    - Replace the placeholder (or existing key) with your actual Gemini API Key.

### How to Run

Since this is a static web application, you can run it using any simple local server.

#### Option 1: VS Code Live Server (Recommended)
1.  Install the **Live Server** extension by Ritwick Dey in VS Code.
2.  Open `index.html`.
3.  Right-click anywhere and select **"Open with Live Server"**.

#### Option 2: Python (Built-in)
If you have Python installed:
```bash
python -m http.server
```
Then open `http://localhost:8000` in your browser.

#### Option 3: Node.js (http-server)
If you have Node.js installed:
```bash
npx http-server
```

## 📖 Usage

1.  **Paste Text**: Copy text from a contract, article, or document into the "Source Document" box.
2.  **Select Style**: Choose your desired tone (e.g., "Strict" for professional output).
3.  **Generate**: Click "Generate FAQs". The AI will analyze the text and produce 5 question-answer pairs with citations.
4.  **Ask Custom Questions**: Use the "Ask something specific" bar at the bottom to query the document further.
5.  **Export**: Click the download icon to save the results as a PDF.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
