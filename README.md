# 🌍 EcoKnowledge & EcoCity Architect
> **A Dual-Engine AI Platform Gamifying Nature-Based Solutions in Urban Planning**

[![Phase 1 Framework](https://img.shields.io/badge/Engine-Geospatial_XGBoost-10b981?style=for-the-badge&logo=scikit-learn&logoColor=white)](#) 
[![Phase 2 Framework](https://img.shields.io/badge/Engine-Spatial_CNN-3b82f6?style=for-the-badge&logo=tensorflow&logoColor=white)](#) 
[![Frontend](https://img.shields.io/badge/UI-React_%7C_Three.js-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![Backend](https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](#)

*This README serves as the unified documentation for both the **[Grid by Grid Analysis](https://github.com/Codebank-Pranav-Tej-Ch-Network/Ecology-Project/)** and the **[3D Gamified Frontend Repository](https://github.com/Sathwik6174/EcoKnowledge-Game)**.*

---

## 🚀 The Vision: Why EcoCity?
Rapid urbanization erodes ecological stability, turning once-breathable cities into concrete heat traps. Environmental scientists possess the data to fix this, but traditional urban planners and the general public lack the interactive tools to truly *understand* the spatial impact of their designs.

**EcoKnowledge & EcoCity Architect** bridges this gap. We transformed 20+ years of satellite telemetry across **13 Smart Cities** in Andhra Pradesh into an immersive, AI-driven Decision Support System (DSS). 

### 📈 Societal Impact by the Numbers
* **8 Million+ Lives Impacted:** Directly modelling the urban environments of tier-2 and tier-1 Indian cities.
* **12,267 Micro-Grids:** The state of AP was mapped into 1km² geo-spatial grids for ultra-high-resolution climate tracking.
* **Predictive Policy:** Proving to policymakers mathematically that simply "planting trees" isn't enough—they must be woven into the urban fabric to counteract PM 2.5 and Urban Heat Islands.

---

## 🧠 Model Technicality & AI Architecture

To create a flawless simulator, we had to build two distinct "Brains": one to understand the *statistics* of the real world, and one to understand the *spatial geometry* of future designs.

### Phase 1: The Statistical Ground-Truth Engine (Random Forest)
Trained on two decades of historical data, this model acts as the authoritative scorer of urban health.
* **Performance:** $R^2$ = 0.9506 | MAE = 0.0622 (predicting on a 1-5 health scale).
* **SHAP Explainability:** We integrated SHAP to open the "black box." The AI revealed the true drivers of urban decay:
    * 🔴 **Urban Density (40.69%)**: The ultimate stressor.
    * 🔴 **LSTVI (22.41%)**: Thermal heat trapping.
    * 🟢 **Greenness (12.60%)**: The strongest natural restorer.

### Phase 2: The Neural Spatial Simulator (FCN)
Statistical models can't "see" layouts. To solve this, we treated city grids as multi-channel image tensors $(1, H, W, 6)$ and trained a **Fully Convolutional Network (FCN)**.
* **Architecture:** Convolutional Layers $\rightarrow$ Batch Normalization $\rightarrow$ **Global Average Pooling (GAP)**.
* **Size Agnosticism:** The GAP layer allows the CNN to evaluate a $5\times5$ grid or a $15\times15$ grid dynamically without retraining.
* **Performance:** 6,801 Parameters | Validation MAE = 1.79 (Beating baseline by 51.2%) | Inference Latency = **~46ms** (CPU-bound edge deployment).

### ⚡ The Heuristic Optimizer Algorithm ($O(N^2)$)
Calculating the "Highest Possible Score" for a gamified grid is mathematically intractable (e.g., $10^{60}$ permutations). We engineered a **Greedy Spatial Allocator** that bypasses brute-force by automatically deploying a checkerboard configuration. This maximizes the $Housing \leftrightarrow Greenery$ adjacency bonus in just $O(N^2)$ time.

---

## 🏗️ Module-Wise Breakdown

The ecosystem is distributed across specialized microservices for maximum scalability:

### 1. `backend_XG/` (The Geospatial Oracle)
* **What it does:** FastAPI server hosting the Phase 1 Random Forest model. It processes real-world manual inputs (Greenness, PM 2.5) from unmapped regions and predicts local health.
* **Key Tech:** Scikit-learn, XGBoost, Joblib.

### 2. `docs/` (The AP EcoGrid Dashboard)
* **What it does:** A Leaflet.js-powered interactive map of Andhra Pradesh. Users can view colormaps of PM 2.5, UHI, and Greenness, complete with historical summer/winter trend charts from 2000 to 2024.
* **Key Tech:** Leaflet.js, Chart.js, GeoJSON processing.

### 3. `CNN/` (The Spatial Engine API)
* **What it does:** A highly optimized TensorFlow FastAPI microservice deployed on Render. It accepts variable-size 2D arrays, one-hot encodes them, and returns an ecological confidence score based purely on the *arrangement* of the tiles.

### 4. `src/` (The Gamified 3D Architect)
* **What it does:** The flagship React application. It offers an immersive "City Builder" where users must meet density targets without triggering thermal crises. It feeds live grid data to the CNN and renders the layout in a stunning 60 FPS 3D voxel view. 
* **Key Tech:** React 18, `@react-three/fiber`, Tailwind, Framer Motion, Google Gemini LLM (for automated architectural audits).

---

## 📊 Core Parameters Monitored

Our models evaluate environments based on 5 critical biomonitors:
| Parameter | Description | Impact |
| :--- | :--- | :--- |
| 🌿 **Greenness (NDVI)** | Active vegetation fractional cover. | Primary Carbon sink & thermal buffer. |
| 🏢 **Urban Density** | Built-up infrastructure ratio. | Primary heat & pollution trap. |
| 🌡️ **UHI Effect** | Urban Heat Island magnitude (°C). | Localized ambient temperature spikes. |
| 🏜️ **LSTVI** | Land Surface Temp to Vegetation ratio. | Indicates severe thermal stress. |
| 💨 **PM 2.5** | Fine particulate matter (µg/m³). | Direct threat to respiratory health. |

---

## 🎮 Game Modes (EcoKnowledge)
1.  **Regional Mode:** Plan within real geographic constraints of 13 AP cities (e.g., the sinusoidal coast of Visakhapatnam RK Beach).
2.  **Green Field:** A pristine, empty terrain generation for from-scratch utopian planning.
3.  **Chaos Matrix:** A procedurally generated, highly dense environment meant to stress-test your retrofitting and Brownfield planning skills.

---

## ⚙️ Installation & Setup

### Running the Backends (Python)
```bash
# Terminal 1: Phase 1 Statistical Engine
cd backend_XG
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8001

# Terminal 2: Phase 2 Spatial CNN Engine
cd CNN
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### Running the Gamified Frontend (Node.js)
```bash
# Terminal 3: React / Vite App
cd EcoKnowledge-Game
npm install
npm run dev
```

## 👥 The Sustainable Squad (Team - 2)
This platform was engineered as part of the ES204L Ecology curriculum under the guidance of **Prof. Suresh Jain** and Project Advisor **Anamika P S**.

### Lead Engineering & Architecture
- **Pranav Tej (CS24B057**) — Team Lead & ML Architecture: Architected the ML pipeline. Built the Phase 1 RF engine, Phase 2 Spatial CNN, SHAP integrations, and cloud deployments.

- **P. Sai Sathwik (CH24B027)** — Lead Front-End Engineer: Directed the React/Vite ecosystem. Handled complex state management, heuristic optimizer integration, and wired the 3D canvas to the ML APIs.

- **Mohith K (ME24B027)** — 3D Software Integration: Established the Three.js architecture, translating 2D arrays into immersive, atmospheric voxel environments.

- **VVRV Datta (Rama Datta) (EE24B064)** — UI/UX Design: Engineered the glassmorphism dashboard, parameter controls, and responsive styling frameworks.

### Core Development & Systems
- **Manoj (CE24B020)** — ML Architecture: Drove data preprocessing, feature engineering, and neural network optimization.

- **SM Kavin (EE24B063)** — 3D Software: Designed the visual asset logic and atmospheric lighting configurations for the Three.js engine.

- **K. Navya (ME24B017) & B. Ananya (ME24B006)** — Front-End Dev: Engineered critical React components, layout tooling, and implemented Tailwind styling.

### Data, Research & Analytics
- **Sai Siddharth (CE24B024)** — Data/ML: Bridged data collection with model training; developed the tabular dataset framework.

- **M. Susmitha (CE24B023)** — Data Acquisition: Compiled and verified the vast geospatial datasets across the 13 cities.

- **Moksha K (ME24B020)** — Research: Conducted rigorous literature reviews on Nature-Based Solutions to form the project's theoretical backbone.

- **G. Siddhardha (CS24B012)** — 3D Prototyping: Built early spatial modelling proofs-of-concept.

- **Chanikya (ME24B051) & G. Madhan (ME24B011)** — Support: Assisted with documentation, presentation structuring, and early-stage mapping.

*Built with ❤️ for a Sustainable Future. © 2026 Ecology Project.*
