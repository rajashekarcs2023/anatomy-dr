"use client"

import { create } from "zustand"

type Mode = "patient" | "doctor"

interface ModeState {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useModeStore = create<ModeState>((set) => ({
  mode: "patient",
  setMode: (mode) => set({ mode }),
}))
