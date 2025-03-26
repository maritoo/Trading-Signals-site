"use client"

import type React from "react"

import { useState } from "react"
import { MessageSquare, Send } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: number
  user: string
  avatar: string
  content: string
  timestamp: string
}

export function SignalDiscussion() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: "Alex Thompson",
      avatar: "/placeholder-user.jpg",
      content: "Strong buy signal confirmed by multiple indicators. The RSI is showing oversold conditions.",
      timestamp: "5 minutes ago",
    },
    {
      id: 2,
      user: "Sarah Chen",
      avatar: "/placeholder-user.jpg",
      content: "Be careful with this one. Major resistance level at 44,200.",
      timestamp: "10 minutes ago",
    },
  ])
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: comments.length + 1,
      user: "You",
      avatar: "/placeholder-user.jpg",
      content: newComment,
      timestamp: "Just now",
    }

    setComments([comment, ...comments])
    setNewComment("")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Discussion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <Textarea
              placeholder="Add your analysis..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px]"
            />
            <Button type="submit" size="icon" className="shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.avatar} alt={comment.user} />
                <AvatarFallback>{comment.user[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{comment.user}</span>
                  <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

