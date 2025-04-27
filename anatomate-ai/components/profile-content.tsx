"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@auth0/nextjs-auth0";
import {
  ArrowLeft,
  Clock,
  LogOut,
  QrCode,
  RefreshCw,
  Settings,
  Shield,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

// Mock patient data - in a real app, this would come from your backend
const mockPatientData = {
  recentSymptoms: [
    { id: 1, name: "Headache", severity: "Mild", date: "2024-04-27" },
    { id: 2, name: "Fatigue", severity: "Moderate", date: "2024-04-26" },
  ],
  vitalSigns: {
    bloodPressure: "120/80",
    heartRate: "72",
    temperature: "98.6",
    lastChecked: "2024-04-27",
  },
  medications: [
    { name: "Ibuprofen", dosage: "200mg", frequency: "As needed" },
    { name: "Vitamin D", dosage: "1000IU", frequency: "Daily" },
  ],
};

export function ProfileContent() {
  const searchParams = useSearchParams();
  const showShare = searchParams.get("share") === "true";

  const [qrGenerated, setQrGenerated] = useState(showShare);
  const [remainingTime, setRemainingTime] = useState(60); // 60 minutes
  const [qrData, setQrData] = useState("");

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!qrGenerated) return;

    // Generate QR data as a URL
    const data = {
      patientId: user?.sub,
      timestamp: new Date().toISOString(),
      expiresIn: remainingTime * 60, // Convert to seconds
      data: mockPatientData,
    };

    // Create a URL-safe base64 encoded string
    const encodedData = btoa(JSON.stringify(data));
    const shareUrl = new URL("/doctor-dashboard", window.location.origin);
    shareUrl.searchParams.set("data", encodedData);

    setQrData(shareUrl.toString());

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [qrGenerated, user?.sub, remainingTime]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const generateQR = () => {
    setQrGenerated(true);
    setRemainingTime(60);
  };

  const refreshQR = () => {
    setRemainingTime(60);
  };

  // Format remaining time as MM:SS
  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m`;
  };

  return (
    <div className="space-y-6 pb-20">
      {qrGenerated ? (
        <Card className="border-0 shadow-lg overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-blue-800 text-xl sm:text-2xl flex items-center justify-center gap-2">
              <QrCode size={24} className="text-[#007AFF]" />
              Share Health Snapshot
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {/* QR Code with beautiful styling */}
            <div className="w-64 h-64 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md border border-blue-100 p-3 flex items-center justify-center mb-6 relative">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>

              {/* QR Code */}
              <div className="bg-white p-3 rounded-xl shadow-sm">
                <QRCodeSVG
                  value={qrData}
                  size={180}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Timer indicator */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-blue-50 px-4 py-2 rounded-full text-blue-700">
              <Clock size={16} className="animate-pulse" />
              <p className="text-sm font-medium">
                Valid for {formatTime(remainingTime)}
              </p>
            </div>

            <p className="text-center text-sm mb-6 text-gray-600 max-w-xs">
              This QR code provides temporary access to your health summary for
              healthcare providers.
            </p>

            <div className="flex flex-col sm:flex-row w-full max-w-xs gap-3">
              <Button
                onClick={refreshQR}
                className="flex-1 bg-gradient-to-r from-[#007AFF] to-[#0056b3] hover:from-[#0068D6] hover:to-[#004494] text-white font-medium py-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-0 flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} className="animate-spin-slow" />
                Refresh QR
              </Button>
              <Button
                onClick={() => setQrGenerated(false)}
                variant="outline"
                className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 py-5 rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                  U
                </div>
                <div>
                  <h2 className="text-xl">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={generateQR}
                className="w-full bg-teal-600 hover:bg-teal-700 mb-4"
              >
                <QrCode size={16} className="mr-2" />
                Generate Health Snapshot QR
              </Button>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Receive health reminders and alerts
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-gray-500">
                      Allow anonymous data for research
                    </p>
                  </div>
                  <Switch id="data-sharing" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Shield size={16} className="mr-2" />
                Privacy Settings
              </Button>

              <Button variant="outline" className="w-full justify-start">
                <Settings size={16} className="mr-2" />
                Account Settings
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  const logoutUrl = new URL(
                    "/auth/logout",
                    window.location.origin
                  );
                  window.location.href = logoutUrl.toString();
                }}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
