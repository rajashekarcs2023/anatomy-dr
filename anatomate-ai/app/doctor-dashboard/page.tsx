"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsTab } from "@/components/appointments-tab";
import { MedicalRecordsManager } from "@/components/medical-records-manager";
import { PatientAnatomyViewer } from "@/components/patient-anatomy-viewer";

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

interface VerificationStep {
  id: string;
  label: string;
  status: "pending" | "loading" | "complete" | "error";
}

export default function DoctorDashboard() {
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationSteps, setVerificationSteps] = useState<
    VerificationStep[]
  >([
    // { id: "decrypt", label: "Decrypting patient data", status: "pending" },
    { id: "hash", label: "Computing data hash", status: "pending" },
    {
      id: "blockchain",
      label: "Fetching blockchain record",
      status: "pending",
    },
    { id: "verify", label: "Verifying data integrity", status: "pending" },
  ]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState("patient");

  // Simulate the verification process
  const runVerification = async (encodedData: string) => {
    setIsVerifying(true);

    // Step 1: Decrypt
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "decrypt" ? { ...step, status: "loading" } : step
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let decodedData;
    try {
      decodedData = JSON.parse(atob(encodedData));
      setVerificationSteps((steps) =>
        steps.map((step) =>
          step.id === "decrypt" ? { ...step, status: "complete" } : step
        )
      );
    } catch (err) {
      setVerificationSteps((steps) =>
        steps.map((step) =>
          step.id === "decrypt" ? { ...step, status: "error" } : step
        )
      );
      setError("Failed to decrypt data");
      setIsVerifying(false);
      return;
    }

    // Step 2: Compute Hash
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "hash" ? { ...step, status: "loading" } : step
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "hash" ? { ...step, status: "complete" } : step
      )
    );

    // Step 3: Fetch Blockchain Record
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "blockchain" ? { ...step, status: "loading" } : step
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "blockchain" ? { ...step, status: "complete" } : step
      )
    );

    // Step 4: Verify
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "verify" ? { ...step, status: "loading" } : step
      )
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setVerificationSteps((steps) =>
      steps.map((step) =>
        step.id === "verify" ? { ...step, status: "complete" } : step
      )
    );

    // Check expiration
    const expirationTime =
      new Date(decodedData.timestamp).getTime() + decodedData.expiresIn * 1000;
    if (Date.now() > expirationTime) {
      setError(
        "This health snapshot has expired. Please request a new one from the patient."
      );
      setIsVerifying(false);
      return;
    }

    setPatientData(decodedData);
    setIsVerifying(false);
  };

  useEffect(() => {
    const encodedData = searchParams.get("data");
    if (!encodedData) {
      return;
    }

    runVerification(encodedData);
  }, [searchParams]);

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-red-100 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Verifying Health Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {verificationSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  {step.status === "pending" && (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                  {step.status === "loading" && (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  )}
                  {step.status === "complete" && (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                  {step.status === "error" && (
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  )}
                  <span
                    className={`flex-1 ${
                      step.status === "complete"
                        ? "text-gray-600"
                        : step.status === "loading"
                        ? "text-blue-600 font-medium"
                        : step.status === "error"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-4">
                Verifying data integrity using blockchain...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-[#3498DB]">PatientView</span>
        <sup className="text-xs ml-1">™</sup>
        <span className="text-gray-500 ml-2">by</span>
        <span className="text-[#1ABC9C] ml-2">AnatoMate</span>
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patient">Patient Data</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
        </TabsList>

        <TabsContent value="patient">
          {!patientData ? (
            <Card>
              <CardHeader>
                <CardTitle>Patient Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Scan a patient's QR code using your device's camera to view their
                  health snapshot.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* 3D Anatomy Viewer */}
              <Card>
                <CardHeader>
                  <CardTitle>Anatomy Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <PatientAnatomyViewer symptoms={patientData.data.recentSymptoms} />
                </CardContent>
              </Card>

              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle>Vital Signs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-lg font-medium">
                        {patientData.data.vitalSigns.bloodPressure}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Heart Rate</p>
                      <p className="text-lg font-medium">
                        {patientData.data.vitalSigns.heartRate} bpm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Temperature</p>
                      <p className="text-lg font-medium">
                        {patientData.data.vitalSigns.temperature}°F
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Checked</p>
                      <p className="text-lg font-medium">
                        {patientData.data.vitalSigns.lastChecked}
                      </p>
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
                    {patientData.data.recentSymptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex justify-between items-center"
                      >
                        <div>
                          <p className="font-medium">{symptom.name}</p>
                          <p className="text-sm text-gray-500">{symptom.date}</p>
                        </div>
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
                      </div>
                    ))}
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
                    {patientData.data.medications.map((medication, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{medication.name}</p>
                          <p className="text-sm text-gray-500">{medication.dosage}</p>
                        </div>
                        <span className="text-sm text-gray-600">
                          {medication.frequency}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-gray-500">
                Data snapshot from {new Date(patientData.timestamp).toLocaleString()}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments">
          <AppointmentsTab patientData={patientData} />
        </TabsContent>

        <TabsContent value="records">
          {!patientData ? (
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Scan a patient's QR code using your device's camera to view and edit their
                  medical records.
                </p>
              </CardContent>
            </Card>
          ) : (
            <MedicalRecordsManager
              patientData={patientData}
              onSave={(updatedData) => {
                // TODO: Implement saving to blockchain
                setPatientData(updatedData)
              }}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
