'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'

type Portfolio = {
  id?: string
  title: string
  description: string
  cover_url: string | null
  images: string[]
  tags: string[]
  url: string
}

type Props = {
  initial?: Portfolio
  mode: 'new' | 'edit'
}

const BUCKET = 'portfolio-images'

export default function PortfolioForm({ initial, mode }: Props) {
  const supabase = createClient()
  const router = useRouter()

  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [url, setUrl] = useState(initial?.url ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.cover_url ?? null)
  const [images, setImages] = useState<string[]>(initial?.images ?? [])
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const coverRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef<HTMLInputElement>(null)

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
    e.target.value = ''
  }

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setImageFiles(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(imagePreviews[index])
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  function removeExistingImage(url: string) {
    setImages(prev => prev.filter(u => u !== url))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag))
  }

  async function uploadFile(file: File, path: string): Promise<string> {
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type })
    if (error) throw new Error(error.message)
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
  }

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      setError('กรุณากรอก Title และ Description')
      return
    }
    setLoading(true)
    setError('')

    try {
      const ts = Date.now()
      const rand = () => Math.random().toString(36).slice(2, 7)

      // Upload cover
      let finalCoverUrl = coverUrl
      if (coverFile) {
        const ext = coverFile.name.split('.').pop()
        finalCoverUrl = await uploadFile(coverFile, `cover/${ts}-${rand()}.${ext}`)
      }

      // Upload new images
      const newImageUrls: string[] = []
      for (const file of imageFiles) {
        const ext = file.name.split('.').pop()
        const url = await uploadFile(file, `gallery/${ts}-${rand()}.${ext}`)
        newImageUrls.push(url)
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        cover_url: finalCoverUrl,
        images: [...images, ...newImageUrls],
        tags,
        url: url.trim() || null,
      }

      if (mode === 'new') {
        const { error } = await supabase.from('portfolios').insert(payload)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase
          .from('portfolios')
          .update(payload)
          .eq('id', initial!.id)
        if (error) throw new Error(error.message)
      }

      router.push('/admin/portfolio')
      router.refresh()
    } catch (err: any) {
      setError(err.message ?? 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('ลบผลงานนี้?')) return
    setDeleting(true)
    await supabase.from('portfolios').delete().eq('id', initial!.id)
    router.push('/admin/portfolio')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto px-6 pt-10 pb-24">

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold text-zinc-100">
          {mode === 'new' ? 'เพิ่มผลงาน' : 'แก้ไขผลงาน'}
        </h1>
        {mode === 'edit' && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm text-red-400 border border-red-900/50 rounded-lg px-3 py-1.5 hover:bg-red-950/30 transition disabled:opacity-40"
          >
            {deleting ? 'กำลังลบ...' : 'ลบผลงาน'}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 px-4 py-2.5 rounded-lg mb-6">
          {error}
        </p>
      )}

      <div className="space-y-6">

        {/* Title */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ชื่อผลงาน"
            className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Description *</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="คำอธิบายผลงาน"
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500 resize-none"
          />
        </div>

        {/* URL */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Project URL</label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Tags</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
              placeholder="พิมพ์แล้วกด Enter"
              className="flex-1 bg-zinc-900 border border-zinc-700 text-zinc-100 placeholder-zinc-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-500"
            />
            <button
              onClick={addTag}
              className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2.5 hover:border-zinc-500 hover:text-zinc-200 transition"
            >
              เพิ่ม
            </button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 rounded-full px-3 py-1 cursor-pointer hover:border-red-800 hover:text-red-400 transition"
                >
                  {tag} ✕
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover image */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Cover Image</label>
          {(coverPreview ?? coverUrl) && (
            <img
              src={coverPreview ?? coverUrl!}
              alt="cover"
              className="w-full h-48 object-cover rounded-xl border border-zinc-700 mb-3"
            />
          )}
          <button
            onClick={() => coverRef.current?.click()}
            className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2.5 hover:border-zinc-500 hover:text-zinc-200 transition"
          >
            {(coverPreview ?? coverUrl) ? 'เปลี่ยนรูป Cover' : 'อัปโหลด Cover'}
          </button>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        {/* Gallery images */}
        <div>
          <label className="text-xs text-zinc-500 uppercase tracking-widest block mb-2">Gallery</label>

          {/* Existing images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-20 object-cover rounded-lg border border-zinc-700" />
                  <button
                    onClick={() => removeExistingImage(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-900 border border-zinc-600 rounded-full text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {imagePreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {imagePreviews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-20 h-20 object-cover rounded-lg border border-zinc-700 opacity-70" />
                  <button
                    onClick={() => removeNewImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-zinc-900 border border-zinc-600 rounded-full text-zinc-400 hover:text-red-400 text-xs flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => imagesRef.current?.click()}
            className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-4 py-2.5 hover:border-zinc-500 hover:text-zinc-200 transition"
          >
            + เพิ่มรูป Gallery
          </button>
          <input ref={imagesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImagesChange} />
        </div>

      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-10">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-white text-zinc-900 font-medium text-sm rounded-lg px-6 py-2.5 hover:bg-zinc-100 disabled:opacity-40 transition"
        >
          {loading ? 'กำลังบันทึก...' : mode === 'new' ? 'เพิ่มผลงาน' : 'บันทึกการแก้ไข'}
        </button>
        <button
          onClick={() => router.back()}
          className="text-sm text-zinc-400 border border-zinc-700 rounded-lg px-5 py-2.5 hover:border-zinc-500 transition"
        >
          ยกเลิก
        </button>
      </div>

    </div>
  )
}