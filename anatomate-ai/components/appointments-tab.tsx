"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { Video, User } from "lucide-react"
import { TimeSlotSelector } from "./time-slot-selector"

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

interface Appointment {
  id: string
  patientName: string
  date: Date
  time: string
  type: "in-person" | "telehealth"
  status: "scheduled" | "completed" | "cancelled"
  meetLink?: string
}

interface TimeSlot {
  day: Date
  hour: number
  selected: boolean
}

interface AppointmentsTabProps {
  patientData: PatientData | null;
}

export function AppointmentsTab({ patientData }: AppointmentsTabProps) {
  const [appointmentType, setAppointmentType] = useState<"in-person" | "telehealth">("in-person")
  const [patientName, setPatientName] = useState(patientData?.patientId || "")
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      patientName: "John Doe",
      date: new Date(2024, 3, 15),
      time: "10:00 AM",
      type: "in-person",
      status: "scheduled"
    },
    {
      id: "2",
      patientName: "Jane Smith",
      date: new Date(2024, 3, 15),
      time: "2:30 PM",
      type: "telehealth",
      status: "scheduled",
      meetLink: "https://meet.google.com/abc-defg-hij"
    }
  ])

  const handleTimeSlotsSelected = (slots: TimeSlot[]) => {
    setAvailableSlots(slots)
  }

  const handleScheduleAppointment = async (slot: TimeSlot) => {
    if (!patientName) return

    // TODO: Integrate with Google Calendar API
    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientName,
      date: slot.day,
      time: `${slot.hour}:00`,
      type: appointmentType,
      status: "scheduled",
      meetLink: appointmentType === "telehealth" ? "https://meet.google.com/xyz-abc-def" : undefined
    }

    setAppointments([...appointments, newAppointment])
    setPatientName("")
  }

  return (
    <div className="space-y-6">
      {/* Schedule New Appointment */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule New Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label>Patient Name</Label>
              <Input
                placeholder="Enter patient name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                disabled={!!patientData?.patientId}
              />
            </div>

            <div className="grid gap-2">
              <Label>Appointment Type</Label>
              <RadioGroup
                value={appointmentType}
                onValueChange={(value) => setAppointmentType(value as "in-person" | "telehealth")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="in-person" id="in-person" />
                  <Label htmlFor="in-person" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    In-Person
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telehealth" id="telehealth" />
                  <Label htmlFor="telehealth" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Telehealth
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Time Slot Selector */}
            <TimeSlotSelector onTimeSlotsSelected={handleTimeSlotsSelected} />

            {/* Available Time Slots */}
            {availableSlots.length > 0 && (
              <div className="grid gap-2">
                <Label>Available Patient Time Slots</Label>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="flex items-center justify-center"
                      onClick={() => handleScheduleAppointment(slot)}
                      disabled={!patientName}
                    >
                      {format(slot.day, 'MMM d')} at {slot.hour}:00
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{appointment.patientName}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    {format(appointment.date, "PPP")} at {appointment.time}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {appointment.type === "telehealth" && appointment.meetLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => window.open(appointment.meetLink, "_blank")}
                    >
                      <Video className="w-4 h-4" />
                      Join Meet
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 