'use client';

import { useState, useEffect } from 'react';

interface HealthSurveyData {
  highBP: number;
  highChol: number;
  cholCheck: number;
  bmi: number;
  smoker: number;
  stroke: number;
  heartDiseaseorAttack: number;
  physActivity: number;
  fruits: number;
  veggies: number;
  hvyAlcoholConsump: number;
  anyHealthcare: number;
  noDocbcCost: number;
  genHlth: number;
  mentHlth: number;
  physHlth: number;
  diffWalk: number;
  sex: number;
  age: number;
  education: number;
  income: number;
}

interface PredictionResult {
  prediction: number;
  probability?: number;
  message: string;
}

export function HealthSurvey() {
  const [formData, setFormData] = useState<HealthSurveyData>({
    highBP: 0,
    highChol: 0,
    cholCheck: 0,
    bmi: 0,
    smoker: 0,
    stroke: 0,
    heartDiseaseorAttack: 0,
    physActivity: 0,
    fruits: 0,
    veggies: 0,
    hvyAlcoholConsump: 0,
    anyHealthcare: 0,
    noDocbcCost: 0,
    genHlth: 1,
    mentHlth: 0,
    physHlth: 0,
    diffWalk: 0,
    sex: 0,
    age: 1,
    education: 1,
    income: 1,
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(0);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totalSections = 4;

  useEffect(() => {
    const newProgress = ((currentSection + 1) / totalSections) * 100;
    setProgress(newProgress);
  }, [currentSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPrediction(null);

    try {
      console.log('Sending data:', formData);
      
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      console.log('Response:', response.status, responseData);

      if (!response.ok) {
        throw new Error(responseData.detail || 'Failed to get prediction');
      }

      setPrediction(responseData);
    } catch (err) {
      console.error('Error details:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const nextSection = () => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Health Conditions</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-lg">
                  High Blood Pressure
                  <select name="highBP" value={formData.highBP} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  High Cholesterol
                  <select name="highChol" value={formData.highChol} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Cholesterol Check in Past 5 Years
                  <select name="cholCheck" value={formData.cholCheck} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Lifestyle & Health History</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-lg">
                  BMI
                  <input
                    type="number"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    step="0.1"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Smoked 100+ Cigarettes
                  <select name="smoker" value={formData.smoker} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Previous Stroke
                  <select name="stroke" value={formData.stroke} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Heart Disease or Attack
                  <select name="heartDiseaseorAttack" value={formData.heartDiseaseorAttack} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Health Status & Diet</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-lg">
                  General Health
                  <select name="genHlth" value={formData.genHlth} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={1}>Excellent</option>
                    <option value={2}>Very Good</option>
                    <option value={3}>Good</option>
                    <option value={4}>Fair</option>
                    <option value={5}>Poor</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Mental Health Days (Past 30)
                  <input
                    type="number"
                    name="mentHlth"
                    value={formData.mentHlth}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    max="30"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Physical Health Days (Past 30)
                  <input
                    type="number"
                    name="physHlth"
                    value={formData.physHlth}
                    onChange={handleChange}
                    className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="0"
                    max="30"
                  />
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Fruits (1+ times/day)
                  <select name="fruits" value={formData.fruits} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Demographics</h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="block text-lg">
                  Sex
                  <select name="sex" value={formData.sex} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option value={0}>Female</option>
                    <option value={1}>Male</option>
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Age Category
                  <select name="age" value={formData.age} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Array.from({length: 14}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Category {i + 1}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Education Level
                  <select name="education" value={formData.education} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Array.from({length: 6}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-lg">
                  Income Level
                  <select name="income" value={formData.income} onChange={handleChange} className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Array.from({length: 8}, (_, i) => (
                      <option key={i + 1} value={i + 1}>Level {i + 1}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Health Survey</h1>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {prediction ? (
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">Prediction Results</h2>
              <div className={`p-4 rounded-lg ${
                prediction.prediction === 1 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                <p className="text-xl font-medium">{prediction.message}</p>
                {prediction.probability !== undefined && (
                  <p className="mt-2">Probability: {(prediction.probability * 100).toFixed(1)}%</p>
                )}
              </div>
              <button
                onClick={() => {
                  setPrediction(null);
                  setCurrentSection(0);
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start New Survey
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {renderSection()}

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevSection}
                  className={`px-6 py-3 rounded-lg transition-colors ${
                    currentSection === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-600 text-white hover:bg-gray-700'
                  }`}
                  disabled={currentSection === 0}
                >
                  Previous
                </button>

                {currentSection === totalSections - 1 ? (
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Submit Survey'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextSection}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                  </button>
                )}
              </div>
            </form>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 