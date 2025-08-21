"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { ShoppingBag, Plus, Edit, Trash2, IndianRupee } from "lucide-react"
import type { Merch } from "@/lib/models/Merch"

export function MerchManagement() {
  const [merch, setMerch] = useState<Merch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMerch, setEditingMerch] = useState<Merch | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [""],
    sizes: [""],
    price: "",
  })

  useEffect(() => {
    fetchMerch()
  }, [])

  const fetchMerch = async () => {
    try {
      const response = await fetch("/api/admin/merch")
      if (response.ok) {
        const data = await response.json()
        setMerch(data)
      }
    } catch (error) {
      console.error("Error fetching merch:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const submitData = {
        ...formData,
        images: formData.images.filter((img) => img.trim() !== ""),
        sizes: formData.sizes.filter((size) => size.trim() !== ""),
        price: Number.parseFloat(formData.price),
      }

      const url = editingMerch ? `/api/admin/merch/${editingMerch._id}` : "/api/admin/merch"
      const method = editingMerch ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        await fetchMerch()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error("Error saving merch:", error)
    }
  }

  const handleEdit = (item: Merch) => {
    setEditingMerch(item)
    setFormData({
      title: item.title,
      description: item.description,
      images: item.images.length > 0 ? item.images : [""],
      sizes: item.sizes.length > 0 ? item.sizes : [""],
      price: item.price.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this merchandise?")) {
      try {
        const response = await fetch(`/api/admin/merch/${id}`, { method: "DELETE" })
        if (response.ok) {
          await fetchMerch()
        }
      } catch (error) {
        console.error("Error deleting merch:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      images: [""],
      sizes: [""],
      price: "",
    })
    setEditingMerch(null)
  }

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] })
  }

  const removeImageField = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages.length > 0 ? newImages : [""] })
  }

  const addSizeField = () => {
    setFormData({ ...formData, sizes: [...formData.sizes, ""] })
  }

  const removeSizeField = (index: number) => {
    const newSizes = formData.sizes.filter((_, i) => i !== index)
    setFormData({ ...formData, sizes: newSizes.length > 0 ? newSizes : [""] })
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading merchandise...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Merchandise Management</CardTitle>
            <CardDescription>Manage festival merchandise and products</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="w-4 h-4 mr-2" />
                Add Merchandise
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingMerch ? "Edit Merchandise" : "Add New Merchandise"}</DialogTitle>
                <DialogDescription>
                  {editingMerch ? "Update merchandise details" : "Add a new merchandise item"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Product Images</Label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="url"
                        value={image}
                        onChange={(e) => {
                          const newImages = [...formData.images]
                          newImages[index] = e.target.value
                          setFormData({ ...formData, images: newImages })
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.images.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeImageField(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addImageField}>
                    Add Another Image
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Available Sizes</Label>
                  {formData.sizes.map((size, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={size}
                        onChange={(e) => {
                          const newSizes = [...formData.sizes]
                          newSizes[index] = e.target.value
                          setFormData({ ...formData, sizes: newSizes })
                        }}
                        placeholder="e.g., S, M, L, XL"
                      />
                      {formData.sizes.length > 1 && (
                        <Button type="button" variant="outline" onClick={() => removeSizeField(index)}>
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSizeField}>
                    Add Another Size
                  </Button>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingMerch ? "Update Merchandise" : "Add Merchandise"}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {merch.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No merchandise added yet</h3>
            <p className="text-muted-foreground mb-4">Add your first merchandise item</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sizes</TableHead>
                <TableHead>Images</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {merch.map((item) => (
                <TableRow key={item._id?.toString()}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.images[0] || "/placeholder.svg"}
                        alt={item.title}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-xs">{item.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      {item.price}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.sizes.map((size, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {size}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.images.length} images</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(item._id?.toString() || "")}>
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
