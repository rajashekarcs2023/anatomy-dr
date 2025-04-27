"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"

interface PatientData {
  patientId: string;
  timestamp: string;
  expiresIn: number;
  data: {
    recentSymptoms: Array<{
      id: number;
      name: string;
      severity: string;
      date: string;
    }>;
    vitalSigns: {
      bloodPressure: string;
      heartRate: string;
      temperature: string;
      lastChecked: string;
    };
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
    }>;
  };
}

interface MedicalRecordsManagerProps {
  patientData: PatientData | null;
  onSave: (updatedData: PatientData) => void;
}

export function MedicalRecordsManager({ patientData, onSave }: MedicalRecordsManagerProps) {
  const [vitalSigns, setVitalSigns] = useState(patientData?.data.vitalSigns || {
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    lastChecked: new Date().toISOString()
  })

  const [symptoms, setSymptoms] = useState(patientData?.data.recentSymptoms || [])
  const [medications, setMedications] = useState(patientData?.data.medications || [])

  const [newSymptom, setNewSymptom] = useState({
    name: "",
    severity: "Mild",
    date: new Date().toISOString().split('T')[0]
  })

  const [newMedication, setNewMedication] = useState({
    name: "",
    dosage: "",
    frequency: ""
  })

  const handleVitalSignsChange = (field: keyof typeof vitalSigns, value: string) => {
    setVitalSigns(prev => ({
      ...prev,
      [field]: value,
      lastChecked: new Date().toISOString()
    }))
  }

  const handleAddSymptom = () => {
    if (!newSymptom.name) return
    setSymptoms(prev => [...prev, { id: Date.now(), ...newSymptom }])
    setNewSymptom({
      name: "",
      severity: "Mild",
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleRemoveSymptom = (id: number) => {
    setSymptoms(prev => prev.filter(s => s.id !== id))
  }

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.frequency) return
    setMedications(prev => [...prev, newMedication])
    setNewMedication({
      name: "",
      dosage: "",
      frequency: ""
    })
  }

  const handleRemoveMedication = (index: number) => {
    setMedications(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!patientData) return

    const updatedData: PatientData = {
      ...patientData,
      data: {
        ...patientData.data,
        vitalSigns,
        recentSymptoms: symptoms,
        medications
      }
    }

    onSave(updatedData)
  }

  return (
    <div className="space-y-6">
      {/* Vital Signs */}
      <Card>
        <CardHeader>
          <CardTitle>Vital Signs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Blood Pressure</Label>
              <Input
                value={vitalSigns.bloodPressure}
                onChange={(e) => handleVitalSignsChange("bloodPressure", e.target.value)}
                placeholder="e.g., 120/80"
              />
            </div>
            <div className="space-y-2">
              <Label>Heart Rate</Label>
              <Input
                value={vitalSigns.heartRate}
                onChange={(e) => handleVitalSignsChange("heartRate", e.target.value)}
                placeholder="e.g., 72 bpm"
              />
            </div>
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Input
                value={vitalSigns.temperature}
                onChange={(e) => handleVitalSignsChange("temperature", e.target.value)}
                placeholder="e.g., 98.6°F"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Checked</Label>
              <Input
                value={new Date(vitalSigns.lastChecked).toLocaleString()}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Symptoms */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Symptoms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Symptom */}
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Symptom name"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom(prev => ({ ...prev, name: e.target.value }))}
              />
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom(prev => ({ ...prev, severity: e.target.value }))}
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
              </select>
              <Input
                type="date"
                value={newSymptom.date}
                onChange={(e) => setNewSymptom(prev => ({ ...prev, date: e.target.value }))}
              />
              <Button onClick={handleAddSymptom}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Symptoms List */}
            <div className="space-y-2">
              {symptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{symptom.name}</p>
                    <p className="text-sm text-gray-500">{symptom.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        symptom.severity === "Mild"
                          ? "bg-yellow-100 text-yellow-800"
                          : symptom.severity === "Moderate"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {symptom.severity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSymptom(symptom.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medications */}
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add New Medication */}
            <div className="grid grid-cols-4 gap-2">
              <Input
                placeholder="Medication name"
                value={newMedication.name}
                onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                placeholder="Dosage"
                value={newMedication.dosage}
                onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
              />
              <Input
                placeholder="Frequency"
                value={newMedication.frequency}
                onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
              />
              <Button onClick={handleAddMedication}>
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Medications List */}
            <div className="space-y-2">
              {medications.map((medication, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-500">{medication.dosage}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {medication.frequency}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMedication(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="w-full" onClick={handleSave}>
        Save Changes
      </Button>
    </div>
  )
} 