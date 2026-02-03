# How to Run on Localhost

Since you don't have Node.js or Python installed, the easiest way to run this on `localhost` is using a tool called **"Live Server"**.

## Option 1: Using VS Code (Recommended)
If you are editing this code in **Visual Studio Code**:
1.  Click the **Extensions** icon on the left sidebar (blocks icon).
2.  Search for **`Live Server`** (by Ritwick Dey).
3.  Click **Install**.
4.  Once installed, open `index.html`.
5.  Right-click anywhere in the code and select **"Open with Live Server"**.
6.  This will automatically launch `http://127.0.0.1:5500/index.html` in your browser.

## Option 2: Install Node.js (For "npm" commands)
If you prefer using the command line:
1.  Download Node.js from [nodejs.org](https://nodejs.org/).
2.  Install it and restart your terminal.
3.  Run this command in this folder:
    ```bash
    npx http-server
    ```

## Option 3: Install Python
1.  Install Python from the Microsoft Store or python.org.
2.  Run:
    ```bash
    python -m http.server
    ```
