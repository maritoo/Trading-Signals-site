"use client"

import { CalendarDays } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const events = [
  {
    id: 1,
    title: "FOMC Meeting Minutes",
    date: "2024-02-20T19:00:00Z",
    impact: "high",
    currency: "USD",
  },
  {
    id: 2,
    title: "ECB Interest Rate Decision",
    date: "2024-02-21T12:45:00Z",
    impact: "high",
    currency: "EUR",
  },
  {
    id: 3,
    title: "US GDP Data",
    date: "2024-02-22T13:30:00Z",
    impact: "medium",
    currency: "USD",
  },
]

export function EconomicCalendar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Economic Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{event.currency}</Badge>
                <Badge
                  variant={
                    event.impact === "high" ? "destructive" : event.impact === "medium" ? "default" : "secondary"
                  }
                >
                  {event.impact}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

