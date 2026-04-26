import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const ecoConsultant = new GoogleGenAI({ apiKey });

export async function analyzeCityDesign(grid: string[][], stats: any, districtName: string, cityContext: string) {
  const gridString = grid.map(row => row.join(" ")).join("\n");
    const prompt = `
    You are a world-class Urban Planner and Sustainability Expert. Analyze this city grid for the district "${districtName}" in "${cityContext}".
    
    CRITICAL INSTRUCTIONS:
    1. Be sharp, direct, and critical. Do not sugarcoat failures.
    2. Focus on the spatial distribution of green/blue spaces. Concentration in one corner is a failure of planning.
    3. Evaluate the design against the specific district requirements.
    4. Provide exactly 3 high-impact, actionable suggestions.
    5. Use a professional, slightly authoritative tone.

    Grid Symbols:
    'G' = Green Space, 'B' = Blue Space, 'H' = Housing, 'P' = Pre-existing, '.' = Empty

    Grid Layout:
    ${gridString}

    Environmental Metrics:
    - Greenery: ${stats.greenery}%, Water: ${stats.water}%, Density: ${stats.density}%
    - Sustainability Score: ${stats.score}/100
    - AQI: ${stats.aqi}, LST: ${stats.lst.toFixed(1)}°C

    Output Format:
    # Urban Audit: ${districtName}
    ## Spatial Analysis
    [Direct critique of layout and distribution]
    
    ## Environmental Impact
    [Sharp evaluation of AQI and LST]
    
    ## Corrective Actions
    1. [Action 1]
    2. [Action 2]
    3. [Action 3]
    `;

  try {
    const response = await ecoConsultant.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing city:", error);
    return "Failed to analyze the city design. Please try again.";
  }
}
