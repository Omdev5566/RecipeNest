import { AdminSidebar } from '../components/AdminSidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, MapPin, Award, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function ChefProfile() {
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully!');
  };

  // Mock chef data
  const chefData = {
    name: 'Marco Rossi',
    email: 'marco.rossi@recipenest.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    specialty: 'Italian Cuisine',
    experience: '15 years',
    joinDate: 'January 2024',
    bio: 'Passionate Italian chef specializing in traditional and modern Italian cuisine. Trained in Rome and Milan, bringing authentic flavors to home cooks worldwide.',
    totalRecipes: 8,
    totalViews: '12,450',
    followers: '2,847'
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-2">Chef Profile</h1>
          <p className="text-muted-foreground">Manage your professional profile and credentials</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src="" />
                    <AvatarFallback className="text-3xl">MR</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{chefData.name}</h3>
                  <Badge variant="secondary" className="mb-4">
                    <Award className="h-3 w-3 mr-1" />
                    Professional Chef
                  </Badge>
                  <Button variant="outline" size="sm">Change Photo</Button>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{chefData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{chefData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{chefData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Joined {chefData.joinDate}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{chefData.totalRecipes}</p>
                    <p className="text-xs text-muted-foreground">Recipes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{chefData.totalViews}</p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{chefData.followers}</p>
                    <p className="text-xs text-muted-foreground">Followers</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Profile Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile Information</CardTitle>
                <CardDescription>
                  Update your professional details and credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        defaultValue={chefData.name}
                        required 
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email"
                        defaultValue={chefData.email}
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        defaultValue={chefData.phone}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        defaultValue={chefData.location}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialty">Specialty/Cuisine</Label>
                      <Input 
                        id="specialty" 
                        defaultValue={chefData.specialty}
                        placeholder="e.g., Italian, French, Asian Fusion"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input 
                        id="experience" 
                        defaultValue={chefData.experience}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={5}
                      defaultValue={chefData.bio}
                      placeholder="Tell food lovers about your culinary journey, specialties, and cooking philosophy..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" size="lg">
                      Save Changes
                    </Button>
                    <Button type="button" variant="outline" size="lg">
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Credentials Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Professional Credentials</CardTitle>
                <CardDescription>
                  Add certifications, awards, and professional achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Culinary Arts Diploma</p>
                      <p className="text-sm text-muted-foreground">Le Cordon Bleu, Paris - 2009</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Master Chef Certification</p>
                      <p className="text-sm text-muted-foreground">Italian Culinary Institute - 2015</p>
                    </div>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <Button variant="outline" className="w-full">
                    Add Credential
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
