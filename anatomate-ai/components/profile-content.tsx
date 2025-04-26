"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { QrCode, RefreshCw, Settings, Shield, LogOut } from "lucide-react"

export function ProfileContent() {
  const searchParams = useSearchParams()
  const showShare = searchParams.get("share") === "true"

  const [qrGenerated, setQrGenerated] = useState(showShare)
  const [remainingTime, setRemainingTime] = useState(60) // 60 minutes

  const generateQR = () => {
    setQrGenerated(true)
    setRemainingTime(60)
  }

  const refreshQR = () => {
    setRemainingTime(60)
  }

  return (
    <div className="space-y-6">
      {qrGenerated ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Share Health Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-64 h-64 bg-gray-100 flex items-center justify-center mb-4">
              {/* Placeholder for QR code */}
              <QrCode size={120} className="text-gray-400" />
            </div>
            <p className="text-center text-sm mb-4">
              This QR code provides temporary access to your health summary. Valid for {remainingTime} minutes.
            </p>
            <div className="flex gap-3">
              <Button onClick={refreshQR} variant="outline" className="flex items-center">
                <RefreshCw size={16} className="mr-2" />
                Refresh QR
              </Button>
              <Button onClick={() => setQrGenerated(false)} variant="outline" className="flex items-center">
                <Settings size={16} className="mr-2" />
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
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-3">U</div>
                <div>
                  <h2 className="text-xl">User Name</h2>
                  <p className="text-sm text-gray-500">user@example.com</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={generateQR} className="w-full bg-teal-600 hover:bg-teal-700 mb-4">
                <QrCode size={16} className="mr-2" />
                Generate Health Snapshot QR
              </Button>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Notifications</Label>
                    <p className="text-sm text-gray-500">Receive health reminders and alerts</p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-gray-500">Allow anonymous data for research</p>
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
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
