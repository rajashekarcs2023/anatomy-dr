"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Info, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SurveyData {
  highBP: number
  highChol: number
  cholCheck: number
  bmi: number
  smoker: number
  stroke: number
  physActivity: number
  fruits: number
  veggies: number
  hvyAlcoholConsump: number
  anyHealthcare: number
  noDocbcCost: number
  genHlth: number
  mentHlth: number
  physHlth: number
  diffWalk: number
  sex: number
  age: number
  education: number
  income: number
}

interface PredictionResult {
  diabetes: {
    prediction: number
    message: string
    probability?: number
  }
  heart: {
    prediction: number
    message: string
    probability?: number
  }
}

export default function UserSurvey() {
  const [showSurvey, setShowSurvey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [predictions, setPredictions] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<SurveyData>({
    highBP: 0,
    highChol: 0,
    cholCheck: 1,
    bmi: 25,
    smoker: 0,
    stroke: 0,
    physActivity: 1,
    fruits: 1,
    veggies: 1,
    hvyAlcoholConsump: 0,
    anyHealthcare: 1,
    noDocbcCost: 0,
    genHlth: 3,
    mentHlth: 0,
    physHlth: 0,
    diffWalk: 0,
    sex: 0,
    age: 7,
    education: 4,
    income: 5,
  })

  const handleStartSurvey = () => {
    setLoading(true)
    // Simulate loading
    setTimeout(() => {
      setLoading(false)
      setShowSurvey(true)
    }, 1000)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log("Sending data:", data)
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error:", errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      
      const result = await response.json()
      console.log("Received result:", result)
      setPredictions(result)
    } catch (error) {
      console.error("Error details:", error)
      setError(error instanceof Error ? error.message : "Failed to get predictions. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const InfoTooltip = ({ children }: { children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info className="h-4 w-4 text-gray-400" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const RadioField = ({
    label,
    info,
    value,
    onChange,
    id,
  }: {
    label: string
    info: string
    value: number
    onChange: (value: number) => void
    id: string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        <InfoTooltip>{info}</InfoTooltip>
      </div>
      <RadioGroup
        value={value.toString()}
        onValueChange={(value) => onChange(parseInt(value))}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="0" id={`${id}-no`} />
          <Label htmlFor={`${id}-no`}>No</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="1" id={`${id}-yes`} />
          <Label htmlFor={`${id}-yes`}>Yes</Label>
        </div>
      </RadioGroup>
    </div>
  )

  const SliderField = ({
    label,
    info,
    value,
    onChange,
    min,
    max,
    step,
    formatValue,
  }: {
    label: string
    info: string
    value: number
    onChange: (value: number) => void
    min: number
    max: number
    step: number
    formatValue?: (value: number) => string
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        <InfoTooltip>{info}</InfoTooltip>
      </div>
      <Slider
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
        min={min}
        max={max}
        step={step}
      />
      <p className="text-sm text-gray-500">
        {formatValue ? formatValue(value) : value}
      </p>
    </div>
  )

  if (!showSurvey) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Health Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center mb-8 text-gray-600 max-w-md mx-auto">
              Please provide your health information to assess your risk factors.
            </p>
            <div className="w-full max-w-xs">
              <Button 
                onClick={handleStartSurvey} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-[#007AFF] to-[#00C58E] hover:from-[#0068D6] hover:to-[#00A97A] text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Self Report Health"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Monthly Check In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Column */}
            <div className="space-y-6">
              <RadioField
                label="High Blood Pressure"
                info="Have you been told you have high blood pressure?"
                value={data.highBP}
                onChange={(value) => setData({ ...data, highBP: value })}
                id="highbp"
              />

              <RadioField
                label="High Cholesterol"
                info="Have you been told you have high cholesterol?"
                value={data.highChol}
                onChange={(value) => setData({ ...data, highChol: value })}
                id="highchol"
              />

              <RadioField
                label="Cholesterol Check"
                info="Had cholesterol check in past 5 years?"
                value={data.cholCheck}
                onChange={(value) => setData({ ...data, cholCheck: value })}
                id="cholcheck"
              />

              <SliderField
                label="BMI"
                info="Body Mass Index"
                value={data.bmi}
                onChange={(value) => setData({ ...data, bmi: value })}
                min={10}
                max={60}
                step={1}
              />

              <RadioField
                label="Smoker"
                info="Smoked at least 100 cigarettes in lifetime?"
                value={data.smoker}
                onChange={(value) => setData({ ...data, smoker: value })}
                id="smoker"
              />

              <RadioField
                label="History of Stroke"
                info="Have you ever had a stroke?"
                value={data.stroke}
                onChange={(value) => setData({ ...data, stroke: value })}
                id="stroke"
              />
            </div>

            {/* Second Column */}
            <div className="space-y-6">
              <RadioField
                label="Physical Activity"
                info="Exercise in past 30 days (other than regular job)?"
                value={data.physActivity}
                onChange={(value) => setData({ ...data, physActivity: value })}
                id="phys"
              />

              <RadioField
                label="Fruit Consumption"
                info="Eat fruit at least once per day?"
                value={data.fruits}
                onChange={(value) => setData({ ...data, fruits: value })}
                id="fruits"
              />

              <RadioField
                label="Vegetable Consumption"
                info="Eat vegetables at least once per day?"
                value={data.veggies}
                onChange={(value) => setData({ ...data, veggies: value })}
                id="veggies"
              />

              <RadioField
                label="Heavy Alcohol Consumption"
                info="Men: >14 drinks/week, Women: >7 drinks/week"
                value={data.hvyAlcoholConsump}
                onChange={(value) => setData({ ...data, hvyAlcoholConsump: value })}
                id="alcohol"
              />

              <RadioField
                label="Healthcare Coverage"
                info="Do you have any kind of health insurance?"
                value={data.anyHealthcare}
                onChange={(value) => setData({ ...data, anyHealthcare: value })}
                id="healthcare"
              />

              <RadioField
                label="Doctor Cost Barrier"
                info="Couldn't see doctor due to cost in past year?"
                value={data.noDocbcCost}
                onChange={(value) => setData({ ...data, noDocbcCost: value })}
                id="doccost"
              />

              <SliderField
                label="General Health"
                info="1=Excellent, 2=Very good, 3=Good, 4=Fair, 5=Poor"
                value={data.genHlth}
                onChange={(value) => setData({ ...data, genHlth: value })}
                min={1}
                max={5}
                step={1}
                formatValue={(value) => ["Excellent", "Very Good", "Good", "Fair", "Poor"][value - 1]}
              />
            </div>

            {/* Third Column */}
            <div className="space-y-6">
              <SliderField
                label="Mental Health Days"
                info="Days of poor mental health in past month"
                value={data.mentHlth}
                onChange={(value) => setData({ ...data, mentHlth: value })}
                min={0}
                max={30}
                step={1}
              />

              <SliderField
                label="Physical Health Days"
                info="Days of poor physical health in past month"
                value={data.physHlth}
                onChange={(value) => setData({ ...data, physHlth: value })}
                min={0}
                max={30}
                step={1}
              />

              <RadioField
                label="Difficulty Walking"
                info="Serious difficulty walking or climbing stairs?"
                value={data.diffWalk}
                onChange={(value) => setData({ ...data, diffWalk: value })}
                id="walk"
              />

              <RadioField
                label="Sex"
                info="0=Female, 1=Male"
                value={data.sex}
                onChange={(value) => setData({ ...data, sex: value })}
                id="sex"
              />
            </div>

            {/* Fourth Column */}
            <div className="space-y-6">
              <SliderField
                label="Age Category"
                info="1=18-24, 2=25-29, 3=30-34, 4=35-39, 5=40-44, 6=45-49, 7=50-54, 8=55-59, 9=60-64, 10=65-69, 11=70-74, 12=75-79, 13=80+"
                value={data.age}
                onChange={(value) => setData({ ...data, age: value })}
                min={1}
                max={13}
                step={1}
                formatValue={(value) => {
                  const ageRanges = [
                    "18-24", "25-29", "30-34", "35-39", "40-44", "45-49",
                    "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80+"
                  ]
                  return ageRanges[value - 1]
                }}
              />

              <SliderField
                label="Education Level"
                info="1=Never attended school, 2=Elementary, 3=Some high school, 4=High school graduate, 5=Some college, 6=College graduate"
                value={data.education}
                onChange={(value) => setData({ ...data, education: value })}
                min={1}
                max={6}
                step={1}
                formatValue={(value) => {
                  const educationLevels = [
                    "Never attended school",
                    "Elementary",
                    "Some high school",
                    "High school graduate",
                    "Some college",
                    "College graduate"
                  ]
                  return educationLevels[value - 1]
                }}
              />

              <SliderField
                label="Income Level"
                info="1=<$10K, 2=$10-15K, 3=$15-20K, 4=$20-25K, 5=$25-35K, 6=$35-50K, 7=$50-75K, 8=>$75K"
                value={data.income}
                onChange={(value) => setData({ ...data, income: value })}
                min={1}
                max={8}
                step={1}
                formatValue={(value) => {
                  const incomeLevels = [
                    "<$10K", "$10-15K", "$15-20K", "$20-25K",
                    "$25-35K", "$35-50K", "$50-75K", ">$75K"
                  ]
                  return incomeLevels[value - 1]
                }}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="w-full max-w-xs bg-gradient-to-r from-[#007AFF] to-[#00C58E] hover:from-[#0068D6] hover:to-[#00A97A] text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {predictions && (
            <div className="mt-8 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className={`text-base ${predictions.diabetes.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                    Diabetes Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{predictions.diabetes.message}</p>
                  {predictions.diabetes.probability && (
                    <p className="text-sm text-gray-500 mt-2">
                      Confidence: {(predictions.diabetes.probability * 100).toFixed(1)}%
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className={`text-base ${predictions.heart.prediction === 1 ? 'text-red-600' : 'text-green-600'}`}>
                    Heart Disease Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <p className="text-sm">{predictions.heart.message}</p>
                  {predictions.heart.probability && (
                    <p className="text-sm text-gray-500 mt-2">
                      Confidence: {(predictions.heart.probability * 100).toFixed(1)}%
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}