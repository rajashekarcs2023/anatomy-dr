"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, User, FileText, Pill, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
    <div className="space-y-4 pb-20">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00C58E]" size={18} />
        <Input
          placeholder="Search records..."
          className="pl-10 bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm focus-visible:ring-[#00C58E] rounded-xl"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="visits">
        <TabsList className="grid grid-cols-4 w-full p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
          <TabsTrigger value="visits" className="flex items-center gap-1.5 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            <Calendar className="w-3.5 h-3.5" />
            <span>Visits</span>
          </TabsTrigger>
          <TabsTrigger value="diagnoses" className="flex items-center gap-1.5 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
            <FileText className="w-3.5 h-3.5" />
            <span>Diagnoses</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="flex items-center gap-1.5 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
            <Pill className="w-3.5 h-3.5" />
            <span>Meds</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="flex items-center gap-1.5 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
            <FileText className="w-3.5 h-3.5" />
            <span>Files</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visits" className="mt-4 space-y-4">
          {filterItems(visits).map((visit) => (
            <Card key={visit.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="py-3 pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span className="text-blue-800">{visit.reason}</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {visit.date}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center mb-2">
                  <Avatar className="h-8 w-8 mr-2 border border-blue-100">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${visit.doctor.replace(/\s+/g, '')}`} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 text-xs">
                      {visit.doctor.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm font-medium text-gray-700">{visit.doctor}</p>
                </div>
                <p className="text-sm mt-1 text-gray-600 pl-10">{visit.summary}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="diagnoses" className="mt-4 space-y-4">
          {filterItems(diagnoses).map((diagnosis) => (
            <Card key={diagnosis.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="py-3 pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span className="text-green-800">{diagnosis.condition}</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {diagnosis.date}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center mb-2">
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    diagnosis.severity === "Mild" ? "bg-green-100 text-green-700" :
                    diagnosis.severity === "Moderate" ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    Severity: {diagnosis.severity}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-600">{diagnosis.notes}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="medications" className="mt-4 space-y-4">
          {filterItems(medications).map((medication) => (
            <Card key={medication.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm">
              <CardHeader className="py-3 pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span className="text-purple-800">{medication.name}</span>
                  <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full flex items-center gap-1">
                    {medication.endDate ? "Completed" : "Active"}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <span className="ml-1 text-gray-600">{medication.dosage}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <span className="ml-1 text-gray-600">{medication.frequency}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                    <span className="font-medium text-gray-700">Started:</span>
                    <span className="ml-1 text-gray-600">{medication.startDate}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-purple-400 mr-2"></div>
                    <span className="font-medium text-gray-700">Ended:</span>
                    <span className="ml-1 text-gray-600">{medication.endDate || "Ongoing"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="files" className="mt-4 space-y-4">
          {filterItems(files).map((file) => (
            <Card key={file.id} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm cursor-pointer group">
              <CardHeader className="py-3 pb-2">
                <CardTitle className="text-base flex justify-between items-center">
                  <span className="text-amber-800 group-hover:text-amber-600 transition-colors">{file.name}</span>
                  <span className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {file.date}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="bg-amber-100/50 text-amber-800 px-2 py-1 rounded-md text-xs">{file.type}</span>
                  <span className="text-gray-500 text-xs">{file.size}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <button className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 py-1 px-2 rounded-full hover:bg-amber-50 transition-colors">
                    <FileText className="w-3 h-3" /> View file
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
