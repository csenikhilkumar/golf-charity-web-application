'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { useDashboard } from '@/components/providers/dashboard-provider'
import { updateProfile, deleteProfilePic, updatePassword, getCharities } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Phone, MapPin, Camera, Trash2, Save, Loader2, Sparkles, ShieldCheck, Heart, Percent, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { user } = useAuth()
  const { data, refreshData } = useDashboard()
  const [loading, setLoading] = useState(false)
  const [passLoading, setPassLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [charities, setCharities] = useState<any[]>([])
  
  useEffect(() => {
    const fetchCharities = async () => {
      const res = await getCharities()
      if (res.success) setCharities(res.charities)
    }
    fetchCharities()
  }, [])
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    imageUrl: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    charityId: '',
    charityPct: 10
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Check if form is dirty
  const isDirty = data?.user ? (
    formData.name !== (data.user.name || '') ||
    formData.username !== (data.user.username || '') ||
    formData.imageUrl !== (data.user.imageUrl || '') ||
    formData.phone !== (data.user.phone || '') ||
    formData.address !== (data.user.address || '') ||
    formData.city !== (data.user.city || '') ||
    formData.country !== (data.user.country || '') ||
    formData.charityId !== (data.user.charityId || '') ||
    formData.charityPct !== (data.user.charityPct || 10)
  ) : false

  useEffect(() => {
    if (data?.user && !hasInitialized) {
      setFormData({
        name: data.user.name || '',
        username: data.user.username || '',
        imageUrl: data.user.imageUrl || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
        city: data.user.city || '',
        country: data.user.country || '',
        charityId: data.user.charityId || '',
        charityPct: data.user.charityPct || 10
      })
      setHasInitialized(true)
    }
  }, [data, hasInitialized])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('You must be logged in to update your profile')
      return
    }

    if (formData.charityPct < 10) {
      toast.error('Minimum charity contribution is 10%')
      return
    }
    
    setLoading(true)
    try {
      console.log('Settings: handleUpdate starting with:', JSON.stringify(formData))
      const res = await updateProfile(user.id, formData)
      console.log('Settings: updateProfile response:', JSON.stringify(res))

      if (res.success && res.user) {
        toast.success(`Profile saved at ${new Date().toLocaleTimeString()}!`)
        // Update local form state with EXACT data from server
        setFormData({
          name: res.user.name || '',
          username: res.user.username || '',
          imageUrl: res.user.imageUrl || '',
          phone: res.user.phone || '',
          address: res.user.address || '',
          city: res.user.city || '',
          country: res.user.country || '',
          charityId: res.user.charityId || '',
          charityPct: res.user.charityPct || 10
        })
        setHasInitialized(true)
        await refreshData()
        console.log('Settings: Data refreshed')
      } else {
        toast.error(res.error || 'Failed to update profile')
      }
    } catch (err: any) {
      console.error('Settings: handleUpdate catch block:', err)
      toast.error(`A client-side error occurred: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePic = async () => {
    if (!user) return
    setLoading(true)
    const res = await deleteProfilePic(user.id)
    if (res.success) {
      toast.success('Profile picture removed')
      setFormData(prev => ({ ...prev, imageUrl: '' }))
      await refreshData()
    }
    setLoading(false)
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.email) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }

    setPassLoading(true)
    const res = await updatePassword(user.email, passwordData.currentPassword, passwordData.newPassword)
    if (res.success) {
      toast.success('Password updated successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      toast.error(res.error || 'Failed to update password')
    }
    setPassLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <Badge variant="outline" className="mb-4 px-3 py-1 text-sm font-medium border-primary/20 bg-primary/5 text-primary">
            <User className="w-4 h-4 mr-2 inline" />
            Account Settings
          </Badge>
          <h1 className="text-4xl font-extrabold font-heading tracking-tight">
            Manage your <span className="text-primary italic">Profile</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Customize how you appear to others and keep your information up to date.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Profile Section */}
        <Card className="rounded-3xl border-border shadow-md overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="font-heading text-xl">Public Profile</CardTitle>
            <CardDescription>Visible details across the Golf Charity platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Avatar Row */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group">
                <div className={cn(
                  "h-28 w-28 rounded-3xl bg-primary/10 border-2 border-border overflow-hidden flex items-center justify-center shadow-inner mt-2 relative",
                  isProcessing && "opacity-50"
                )}>
                  {isProcessing ? (
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                  ) : formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-primary opacity-50" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                   <input 
                    type="file" 
                    id="avatar-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      
                      if (file.size > 10 * 1024 * 1024) {
                        toast.error('Image is too large. Max 10MB allowed.')
                        return
                      }

                      setIsProcessing(true)
                      const reader = new FileReader()
                      reader.onload = (event) => {
                        const img = new Image()
                        img.onload = () => {
                          // Canvas resizing
                          const canvas = document.createElement('canvas')
                          const MAX_SIZE = 400 // Reduced from 800 for stability
                          let width = img.width
                          let height = img.height

                          if (width > height) {
                            if (width > MAX_SIZE) {
                              height *= MAX_SIZE / width
                              width = MAX_SIZE
                            }
                          } else {
                            if (height > MAX_SIZE) {
                              width *= MAX_SIZE / height
                              height = MAX_SIZE
                            }
                          }

                          canvas.width = width
                          canvas.height = height
                          const ctx = canvas.getContext('2d')
                          ctx?.drawImage(img, 0, 0, width, height)
                          
                          const dataUrl = canvas.toDataURL('image/jpeg', 0.6) // Lower quality for better DB performance
                          setFormData(prev => ({ ...prev, imageUrl: dataUrl }))
                          setIsProcessing(false)
                          toast.success('Image optimized & ready!')
                        }
                        img.src = event.target?.result as string
                      }
                      reader.readAsDataURL(file)
                    }}
                   />
                   <Button 
                    type="button"
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg bg-background shadow-md hover:border-primary transition-colors"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                   >
                     <Camera className="h-3.5 w-3.5" />
                   </Button>
                   {formData.imageUrl && (
                    <Button 
                      type="button"
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg bg-background shadow-md text-destructive hover:bg-destructive/5 border-destructive/20 hover:border-destructive transition-colors"
                      onClick={handleDeletePic}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                   )}
                </div>
              </div>
              
              <div className="flex-1 grid gap-6 w-full">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold opacity-70">Display Name</Label>
                    <Input 
                      value={formData.name} 
                      onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Tiger Woods"
                      className="rounded-xl h-12 bg-muted/20 border-border focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold opacity-70">Username</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">@</span>
                      <Input 
                        value={formData.username} 
                        onChange={e => setFormData(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                        placeholder="golfer_99"
                        className="rounded-xl h-12 pl-8 bg-muted/20 border-border focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details */}
        <Card className="rounded-3xl border-border shadow-md overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="font-heading text-xl">Personal Information</CardTitle>
            <CardDescription>Private details used for prize payouts and communication.</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70 flex items-center gap-2">
                   <Mail className="h-3.5 w-3.5" /> Email Address
                </Label>
                <Input 
                  value={user?.email || ''} 
                  disabled
                  className="rounded-xl h-12 bg-muted/50 border-border font-medium cursor-not-allowed opacity-60"
                />
                <p className="text-[10px] text-muted-foreground italic px-1">Managed via authentication provider.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70 flex items-center gap-2">
                   <Phone className="h-3.5 w-3.5" /> Phone Number
                </Label>
                <Input 
                  value={formData.phone} 
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+44 7000 000000"
                  className="rounded-xl h-12 bg-muted/20 border-border"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label className="text-sm font-bold opacity-70 flex items-center gap-2">
                   <MapPin className="h-3.5 w-3.5" /> Address Line
                </Label>
                <Input 
                  value={formData.address} 
                  onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                  placeholder="123 Fairway Green"
                  className="rounded-xl h-12 bg-muted/20 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70">City</Label>
                <Input 
                  value={formData.city} 
                  onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                  placeholder="St Andrews"
                  className="rounded-xl h-12 bg-muted/20 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70">Country</Label>
                <Input 
                  value={formData.country} 
                  onChange={e => setFormData(p => ({ ...p, country: e.target.value }))}
                  placeholder="United Kingdom"
                  className="rounded-xl h-12 bg-muted/20 border-border"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/10 p-8 pt-0 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || !isDirty}
              className={cn(
                "rounded-2xl h-14 px-10 font-bold text-lg shadow-xl transition-all",
                isDirty ? "shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]" : "opacity-50 grayscale cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : isDirty ? (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Save Changes
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600" />
                  All Changes Saved
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Charity Contribution Section (MANDATORY) */}
        <Card className="rounded-3xl border-border shadow-md overflow-hidden bg-background">
          <CardHeader className="bg-muted/30 border-b border-border">
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" />
              Charity & Impact
            </CardTitle>
            <CardDescription>Select the charity you wish to support and set your monthly contribution.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70">Support Charity</Label>
                <select 
                  value={formData.charityId}
                  onChange={e => setFormData(p => ({ ...p, charityId: e.target.value }))}
                  className="w-full rounded-xl h-12 px-4 bg-muted/20 border border-border focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                >
                  <option value="">Choose a charity...</option>
                  {charities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground italic px-1">At least 10% of your fee is donated.</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="text-sm font-bold opacity-70 flex items-center gap-2">
                    <Percent className="h-3.5 w-3.5" /> Contribution
                  </Label>
                  <span className="text-xl font-bold font-heading text-primary">{formData.charityPct}%</span>
                </div>
                <div className="space-y-4">
                  <input 
                    type="range"
                    min={10}
                    max={100}
                    step={1}
                    value={formData.charityPct} 
                    onChange={e => setFormData(p => ({ ...p, charityPct: parseInt(e.target.value) || 10 }))}
                    className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1">
                    <span>MIN (10%)</span>
                    <span>GENEROUS</span>
                    <span>MAX (100%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Security Section */}
      <Card className="rounded-3xl border-border shadow-md overflow-hidden bg-background">
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>Update your password and manage account safety.</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-bold opacity-70 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" /> Current Password
                </Label>
                <div className="relative">
                  <Input 
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword} 
                    onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                    placeholder="Confirm your identity"
                    className="rounded-xl h-12 bg-muted/20 border-border focus:ring-2 focus:ring-primary/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold opacity-70">New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword} 
                      onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="rounded-xl h-12 bg-muted/20 border-border focus:ring-2 focus:ring-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold opacity-70">Confirm New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword} 
                      onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="rounded-xl h-12 bg-muted/20 border-border focus:ring-2 focus:ring-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={passLoading || !passwordData.newPassword}
                variant="outline"
                className="rounded-2xl h-12 px-8 font-bold border-2 hover:bg-primary hover:text-white transition-all shadow-lg hover:shadow-primary/20"
              >
                {passLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <div className="flex items-center justify-between p-6 px-10 border-2 border-dashed border-border rounded-3xl bg-muted/5 opacity-50 select-none">
        <div>
          <h4 className="font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Join Date
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Member since {new Date(data?.user?.createdAt || Date.now()).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
