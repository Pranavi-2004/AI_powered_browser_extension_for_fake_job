# HireShield – AI Powered Browser Extension for Fake Job Detection

## Project Overview

HireShield is an AI-powered browser extension developed to detect fraudulent job postings and recruitment scams in real time.
The system uses a fine-tuned BERT-based natural language processing model to analyze job descriptions extracted from online recruitment platforms and classify them as **Legitimate**, **Suspicious**, or **High Risk**.

The trained model is integrated with a FastAPI backend and connected to a Chrome browser extension, allowing users to scan job postings directly while browsing job portals.

---

## Project Architecture

Dataset → Data Preparation → BERT Model Training → Saved Model → FastAPI Backend → ngrok Tunnel → Chrome Extension → Fraud Prediction Output

---

## Project Modules

### 1. Data Preparation (`01_data_preparation.ipynb`)

This notebook prepares the dataset for training by performing:

* Dataset loading
* Missing value handling
* Text cleaning and normalization
* Label encoding
* Train-test split
* Class balancing using SMOTE

---

### 2. BERT Model Training (`02_hireshield_bert_training.ipynb`)

This notebook handles model development and evaluation:

* Tokenization using BERT tokenizer
* Fine-tuning BERT model
* Model training and validation
* Accuracy calculation
* Confusion matrix generation
* ROC-AUC evaluation

---

### 3. Backend Prediction Module (`03_backend_testing.ipynb` / backend files)

This module performs:

* Loading trained BERT model
* Receiving job description input
* Running fraud prediction
* Returning fraud probability and verdict

---

### 4. Chrome Extension

Extension files include:

* `manifest.json`
* `popup.html`
* `popup.js`
* `content.js`
* `styles.css`

The extension performs:

* Job text extraction from active webpage
* Sending extracted text to backend API
* Displaying fraud result in browser popup

---

## Technologies Used

* Python
* FastAPI
* Transformers (Hugging Face)
* PyTorch
* Scikit-learn
* Pandas
* Google Colab
* Visual Studio Code
* Chrome Extension APIs
* ngrok

---

## Requirements Installation

Install required libraries using:

pip install -r requirements.txt

Required libraries:

fastapi
uvicorn
transformers
torch
pandas
numpy
scikit-learn
pyngrok

---

## How to Run the Project

### Step 1: Start Backend Server

Open terminal inside backend folder and run:

uvicorn main:app --reload

If using direct Python file:

python main.py

Backend runs at:

http://127.0.0.1:8000

---

### Step 2: Start ngrok

ngrok is used to expose the local backend publicly so that the Chrome extension can communicate with the API.

Run:

ngrok http 8000

You will receive a forwarding URL like:

https://xxxx.ngrok-free.app

Copy this URL.

---

### Step 3: Update API URL in Extension

Open:

`popup.js` or `content.js`

Replace local backend URL:

http://127.0.0.1:8000/predict

with ngrok URL:

https://your-ngrok-url.ngrok-free.app/predict

Save the file.

---

### Step 4: Load Chrome Extension

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load Unpacked**
5. Select extension folder

---

### Step 5: Run Fraud Detection

1. Open any job portal
2. Click extension icon
3. Start scan
4. View fraud prediction result

---

## Important Notes

* Backend must always run before scanning.
* ngrok URL changes every session in free version.
* If ngrok URL changes, update extension API URL again.
* Keep backend and extension active simultaneously during testing.

---

## Output

The system returns:

* Fraud Probability
* Risk Level
* Suspicious Keywords
* Safety Verdict

---

## Expected Folder Structure

HireShield_Project/

├── notebooks/
├── backend/
├── extension/
├── documentation/
├── requirements.txt
└── README.md

---

## Developed For

AI Powered Browser Extension for Fake Job Post and Recruitment Scam Detection
