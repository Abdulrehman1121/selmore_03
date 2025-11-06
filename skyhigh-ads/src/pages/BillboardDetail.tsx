import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Eye, Calendar, Star, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const BillboardDetail = () => {
  const { id } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week");

  const billboard = {
    name: "Times Square Digital Billboard",
    location: "New York, NY",
    type: "Digital",
    size: "48ft x 14ft",
    impressions: "2M+",
    availability: "Available",
    prices: {
      day: 800,
      week: 5000,
      month: 18000,
    },
    images: [
      new URL("@/assets/billboard-times-square.jpg", import.meta.url).href,
      new URL("@/assets/billboard-times-square.jpg", import.meta.url).href,
      new URL("@/assets/billboard-times-square.jpg", import.meta.url).href,
    ],
    features: [
      "HD LED Display",
      "24/7 Visibility",
      "High Foot Traffic",
      "Tourist Hotspot",
      "Flexible Scheduling",
      "Real-time Updates",
    ],
    description:
      "Premium digital billboard in the heart of Times Square. This high-traffic location offers unparalleled visibility with over 2 million daily impressions. Perfect for brands looking to make a bold statement in one of the world's most iconic locations.",
    demographics: {
      ageRange: "25-54 years",
      incomeLevel: "$75K+ annually",
      audience: "Tourists, Business Professionals, Locals",
    },
    owner: {
      name: "Premium Outdoor Media",
      initials: "PM",
      rating: 4.9,
      billboards: 45,
    },
  };

  const price = billboard.prices[selectedPeriod];

  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/explore" className="hover:text-primary">
            Billboards
          </Link>
          <span className="mx-2">/</span>
          <span>{billboard.name}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Badge */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold">{billboard.name}</h1>
                <Badge className="bg-accent">{billboard.type}</Badge>
              </div>
            </div>

            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-muted">
                <img
                  src={billboard.images[0]}
                  alt={billboard.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {billboard.images.slice(1).map((img, idx) => (
                    <div key={idx} className="relative h-24 bg-muted rounded cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={img} alt={`View ${idx + 2}`} className="w-full h-full object-cover rounded" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Card>
              <CardContent className="pt-6">
                <Tabs defaultValue="overview">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6 mt-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {billboard.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {billboard.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Target Demographics</h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Age Range</div>
                          <div className="font-medium">{billboard.demographics.ageRange}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Income Level</div>
                          <div className="font-medium">{billboard.demographics.incomeLevel}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Primary Audience</div>
                          <div className="font-medium">{billboard.demographics.audience}</div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="location" className="mt-6">
                    <div className="h-96 bg-muted rounded flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-12 h-12 mx-auto mb-2" />
                        <p>Map view would be displayed here</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="mt-6">
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Daily Impressions</div>
                                <div className="text-2xl font-bold">{billboard.impressions}</div>
                              </div>
                              <Eye className="w-8 h-8 text-accent" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-muted-foreground mb-1">Peak Hours</div>
                                <div className="text-2xl font-bold">8AM - 9PM</div>
                              </div>
                              <Calendar className="w-8 h-8 text-accent" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <Card className="sticky top-24">
              <CardContent className="pt-6 space-y-6">
                {/* Billing Period Selector */}
                <div>
                  <h3 className="text-sm font-semibold mb-3">Select Billing Period</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {(["day", "week", "month"] as const).map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className="capitalize"
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Price Display */}
                <div className="border-t pt-6">
                  <div className="text-3xl font-bold text-accent mb-1">
                    ${price.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">per {selectedPeriod}</div>
                </div>

                {/* Specifications */}
                <div className="space-y-3 border-t pt-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Size</span>
                    <span className="font-medium">{billboard.size}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{billboard.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <Badge variant="outline" className="text-success border-success">
                      {billboard.availability}
                    </Badge>
                  </div>
                </div>

                {/* Book Button */}
                <Button size="lg" className="w-full">
                  Book Now
                </Button>
              </CardContent>
            </Card>

            {/* Owner Card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-4">Billboard Owner</h3>
                <div className="flex items-start gap-3 mb-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {billboard.owner.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{billboard.owner.name}</div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-warning text-warning mr-1" />
                        {billboard.owner.rating}
                      </div>
                      <span>•</span>
                      <span>{billboard.owner.billboards} billboards</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BillboardDetail;
