"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Plus, Edit, Trash2 } from "lucide-react"
import type { College } from "@/lib/models/College"

export function CollegesManagement() {
  const [colleges, setColleges] = useState<College[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCollege, setEditingCollege] = useState<College | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
  })

  const collegeTypes = [
    "IIT",
    "NIT",
    "IIIT",
    "Government Engineering College",
    "Private Engineering College",
    "University",
    "Deemed University",
    "Central University",
    "State University",
    "Other",
  ]

  useEffect(() => {
    fetchColleges()
  }, [])

  const fetchColleges = async () => {
    try {
      const response = await fetch("/api/admin/colleges")
      if (response.ok) {
        const data = await response.json()
        setColleges(data)
      }
    } catch (error) {
      console.error("Error fetching colleges:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingCollege ? `/api/admin/colleges/${editingCollege._id}` : "/api/admin/colleges"
      const method = editingCollege ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchColleges()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving college:", error)
    }
  }

  const handleEdit = (college: College) => {
    setEditingCollege(college)
    setFormData({
      name: college.name,
      type: college.type,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this college?")) {
      try {
        const response = await fetch(`/api/admin/colleges/${id}`, { method: "DELETE" })
        if (response.ok) {
          await fetchColleges()
        }
      } catch (error) {
        console.error("Error deleting college:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
    })
    setEditingCollege(null)
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading colleges...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>College Management</CardTitle>
            <CardDescription>Manage participating colleges and institutions</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add College
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCollege ? "Edit College" : "Add New College"}</DialogTitle>
                <DialogDescription>
                  {editingCollege ? "Update college information" : "Add a participating college or institution"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">College Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Indian Institute of Technology Mandi"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">College Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select college type" />
                    </SelectTrigger>
                    <SelectContent>
                      {collegeTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingCollege ? "Update College" : "Add College"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {colleges.length === 0 ? (
          <div className="text-center py-12">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No colleges registered yet</h3>
            <p className="text-muted-foreground mb-4">Add participating colleges</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Added Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colleges.map((college) => (
                <TableRow key={college._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div className="font-medium">{college.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{college.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(college.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(college)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(college._id?.toString() || "")}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
