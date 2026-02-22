# CSCE 679 — Assignment 1: Hong Kong Monthly Temperature Matrix View

This project implements a **Matrix View** visualization for **Hong Kong monthly temperature** using `temperature_daily.csv`.  
The matrix shows the **last 10 years available in the dataset**. Each cell represents a **(year, month)** pair, with color encoding temperature and an embedded mini line chart showing daily changes.

---

## Live Demo

Access the live demo here: https://mrkc2303.github.io/CSCE-679-Assignment-1/

---

## Demo Screenshot

![App Screenshot](https://github.com/user-attachments/assets/8aa7a960-757b-447b-896f-71e321eefa5a)
![App Screenshot](https://github.com/user-attachments/assets/2cdc4a9f-31bf-4e2d-8887-acad4f3087e4)


---

## Tech Stack

- **React** (UI + SVG rendering)
- **D3.js** (CSV loading, parsing, aggregation, scales, line generator)
- **Vite** (dev server + build tooling)

---

## Data Processing (How monthly values are computed)

The input CSV contains **daily** temperatures.

For each month (YYYY-MM):
- **Monthly MAX** = `max(daily max_temperature)` within that month  
- **Monthly MIN** = `min(daily min_temperature)` within that month  
- Daily values are also stored to render the mini line chart inside each cell.

---

## How to Run Locally

### 1. Clone GitHub Repository

```bash
git clone https://github.com/mrkc2303/CSCE-679-Assignment-1.git
cd CSCE-679-Assignment-1
```

### 2) Install dependencies
```bash
npm install
```

### 3) Start dev server
```bash
npm run dev
```

---

## Deployment

I used Github pages to deploy the vite app using the following process:

### 1) Set the base in `vite.config.js`:
```javascript
export default defineConfig({
  base: "/CSCE-679-Assignment-1/",
});
```

### 2) Ensure CSV loads with base URL
```javascript
d3.csv(`${import.meta.env.BASE_URL}temperature_daily.csv`)
```

### 3) Deploy
```javascript
npm run deploy
```

Now enable GitHub pages in Repo -> Settings -> Pages -> Branch: `gh-pages`

Before this process, you have to install `gh-pages` and add that

--

## ChatGPT Reflection

For this assignment, since I was already comfortable with ReactJS and building UIs using multiple frameworks, I was relatively new to D3.js. ChatGPT helped me mainly with the D3 parts, especially how to think about the data transformation and connect it to a visualization. It was mainly helpful for debugging issues, for example I got an error which I was confused about, it was when I hit the SVG error “Expected number, MNaN, NaN…”. It explained to me that it happens when x or y becomes NaN due to parsing or missing values issues. It helped me fix my mistake. It also gave me a step-by-step plan to fix my mistakes and work on the project in an organized manner. It also helped me to deploy the site on github pages, I have usually done deployment on gh pages for vanilla JS and deployments on AWS and tools like vercel, but I asked ChatGPT to help me deploy our vite site to gh pages.

You can access the document with detailed explaination in the root folder `CSCE 679-Assignment-1-ChatGPT Interaction Log.docx`
