import { GoogleGenerativeAI } from "@google/generative-ai";

interface HealthData {
  heartRate: number;
  respiratoryRate: number;
  bodyTemperature: number;
  oxygenSaturation: number;
  systolicBP: number;
  diastolicBP: number;
  weight: number;
  hrv: number;
  pulsePressure: number;
  bmi: number;
  map: number;
}

interface YearlyHealthData {
  [key: string]: HealthData;
}

export function generateRandomHealthData(): YearlyHealthData {
  const data: YearlyHealthData = {};
  
  for (let year = 1; year <= 10; year++) {
    data[`year_${year}`] = {
      heartRate: Math.floor(Math.random() * (100 - 45) + 45), // 45-100 bpm
      respiratoryRate: Math.floor(Math.random() * (20 - 8) + 8), // 8-20 breaths/min
      bodyTemperature: Number((Math.random() * (37.5 - 36.0) + 36.0).toFixed(2)), // 36.0-37.5°C
      oxygenSaturation: Math.floor(Math.random() * (100 - 92) + 92), // 92-100%
      systolicBP: Math.floor(Math.random() * (140 - 75) + 75), // 75-140 mmHg
      diastolicBP: Math.floor(Math.random() * (90 - 50) + 50), // 50-90 mmHg
      weight: Number((Math.random() * (100 - 45) + 45).toFixed(1)), // 45-100 kg
      hrv: Number((Math.random() * (0.8 - 0.2) + 0.2).toFixed(6)), // 0.2-0.8
      pulsePressure: Math.floor(Math.random() * (60 - 20) + 20), // 20-60 mmHg
      bmi: Number((Math.random() * (30 - 16) + 16).toFixed(1)), // 16-30
      map: Number((Math.random() * (100 - 60) + 60).toFixed(1)) // 60-100 mmHg
    };
  }
  
  return data;
}

export async function analyzeHealthData(data: YearlyHealthData, modelPrediction: number): Promise<{
  green: string[];
  yellow: string[];
  red: string[];
}> {
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `The model predicts ${modelPrediction === 0 ? "Low Risk" : "High Risk"}. Analyze the data and give me three concise sections with the first being good(generally healthy vitals), the second section being (moderate/ warning signs or potential issues for a doctor to followup on), and the last being (dangerous injuries to health). If there are no particular signs for a particular section you can leave it blank. Give the response as a json parseable string with the sections "green", "yellow" and "red" specifically. For each of these sections, there should be json list of strings. DO NOT WRAP IT IN A JSON MARKDOWN CODE BLOCK. ONLY RETRUN THE TEXT AND NOTHING ELSE. Give a summary of all the data from all years but give prefereance for the last year. Explain it like you are explaining to the person like a doctor. Here is the data: ${JSON.stringify(data)}`;

  try {
    console.log("prompt", prompt);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text()
    console.log(text);
    // Clean up the response text to handle markdown formatting
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    console.log("text", text);
    
    // Parse the JSON response
    const analysis = JSON.parse(text);

    console.log("analysis", analysis);
    return {
      green: analysis.green || [],
      yellow: analysis.yellow || [],
      red: analysis.red || []
    };
  } catch (error) {
    console.error("Error analyzing health data:", error);
    // Return a default response in case of error
    return {
      green: ["Unable to analyze health data at this time."],
      yellow: [],
      red: []
    };
  }
} 