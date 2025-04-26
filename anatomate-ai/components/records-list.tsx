"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data
const visits = [
  {
    id: "v1",
    date: "2023-04-15",
    doctor: "Dr. Sarah Johnson",
    reason: "Annual checkup",
    summary: "All vitals normal. Recommended regular exercise and balanced diet.",
  },
  {
    id: "v2",
    date: "2023-02-10",
    doctor: "Dr. Michael Chen",
    reason: "Chest pain",
    summary: "Diagnosed with mild GERD. Prescribed antacids and dietary changes.",
  },
]

const diagnoses = [
  {
    id: "d1",
    date: "2023-02-10",
    condition: "Gastroesophageal Reflux Disease (GERD)",
    severity: "Mild",
    notes: "Triggered by spicy foods and stress.",
  },
  {
    id: "d2",
    date: "2022-11-05",
    condition: "Seasonal Allergies",
    severity: "Moderate",
    notes: "Worse during spring. Antihistamines prescribed.",
  },
]

const medications = [
  {
    id: "m1",
    name: "Omeprazole",
    dosage: "20mg",
    frequency: "Once daily",
    startDate: "2023-02-10",
    endDate: "2023-03-10",
  },
  {
    id: "m2",
    name: "Loratadine",
    dosage: "10mg",
    frequency: "As needed",
    startDate: "2022-11-05",
    endDate: null,
  },
]

const files = [
  {
    id: "f1",
    name: "Blood Test Results",
    date: "2023-04-15",
    type: "PDF",
    size: "1.2 MB",
  },
  {
    id: "f2",
    name: "Chest X-Ray",
    date: "2023-02-10",
    type: "Image",
    size: "3.5 MB",
  },
]

export function RecordsList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filterItems = (items: any[]) => {
    if (!searchTerm) return items
    return items.filter((item) =>
      Object.values(item).some(
        (value) => typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Search records..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="visits">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
          <TabsTrigger value="medications">Meds</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4 space-y-3">
          {filterItems(visits).map((visit) => (
            <Card key={visit.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex justify-between">
                  <span>{visit.reason}</span>
                  <span className="text-sm text-gray-500">{visit.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <p className="text-sm text-gray-700">{visit.doctor}</p>
                <p className="text-sm mt-1">{visit.summary}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="diagnoses" className="mt-4 space-y-3">
          {filterItems(diagnoses).map((diagnosis) => (
            <Card key={diagnosis.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base flex justify-between">
                  <span>{diagnosis.condition}</span>
                  <span className="text-sm text-gray-500">{diagnosis.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium mr-2">Severity:</span>
                  <span className="text-sm">{diagnosis.severity}</span>
                </div>
                <p className="text-sm">{diagnosis.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="mt-4 space-y-3">
          {filterItems(medications).map((medication) => (
            <Card key={medication.id}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">{medication.name}</CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Dosage:</span> {medication.dosage}
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span> {medication.frequency}
                  </div>
                  <div>
                    <span className="font-medium">Started:</span> {medication.startDate}
                  </div>
                  <div>
                    <span className="font-medium">Ended:</span> {medication.endDate || "Ongoing"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="files" className="mt-4 space-y-3">
          {filterItems(files).map((file) => (
            <Card key={file.id} className="cursor-pointer hover:bg-gray-50">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex justify-between">
                  <span>{file.name}</span>
                  <span className="text-sm text-gray-500">{file.date}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex justify-between text-sm">
                  <span>{file.type}</span>
                  <span>{file.size}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
