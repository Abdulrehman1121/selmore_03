import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Map, List, MapPin, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Explore = () => {
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const billboards = [
    {
      id: "times-square",
      name: "Times Square Digital Billboard",
      location: "New York, NY",
      type: "Digital",
      size: "48ft x 14ft",
      impressions: "2M+",
      price: 800,
      priceType: "day",
      weekPrice: 5000,
      monthPrice: 18000,
      image: new URL("@/assets/billboard-times-square.jpg", import.meta.url).href,
      bookingType: "direct",
    },
    {
      id: "sunset-blvd",
      name: "Sunset Boulevard Premium",
      location: "Los Angeles, CA",
      type: "Static",
      size: "14ft x 48ft",
      impressions: "1.5M+",
      price: 2800,
      priceType: "bid",
      image: new URL("@/assets/billboard-sunset-blvd.jpg", import.meta.url).href,
      bookingType: "bidding",
    },
    {
      id: "chicago-led",
      name: "Downtown Chicago LED",
      location: "Chicago, IL",
      type: "Digital",
      size: "20ft x 60ft",
      impressions: "1.8M+",
      price: 650,
      priceType: "day",
      weekPrice: 4200,
      monthPrice: 15000,
      image: new URL("@/assets/billboard-chicago.jpg", import.meta.url).href,
      bookingType: "direct",
    },
    {
      id: "miami-beach",
      name: "Miami Beach Highway",
      location: "Miami, FL",
      type: "Static",
      size: "14ft x 48ft",
      impressions: "900K+",
      price: 2200,
      priceType: "bid",
      image: new URL("@/assets/billboard-miami.jpg", import.meta.url).href,
      bookingType: "bidding",
    },
    {
      id: "sf-bridge",
      name: "San Francisco Bay Bridge",
      location: "San Francisco, CA",
      type: "Digital",
      size: "30ft x 60ft",
      impressions: "2.5M+",
      price: 950,
      priceType: "day",
      weekPrice: 6000,
      monthPrice: 21000,
      image: new URL("@/assets/billboard-sf.jpg", import.meta.url).href,
      bookingType: "direct",
    },
    {
      id: "austin-mobile",
      name: "Austin Downtown Mobile",
      location: "Austin, TX",
      type: "Mobile",
      size: "10ft x 20ft",
      impressions: "500K+",
      price: 1200,
      priceType: "bid",
      image: new URL("@/assets/billboard-austin.jpg", import.meta.url).href,
      bookingType: "bidding",
    },
  ];

  // 🧮 Apply Filters Logic
  const applyFilters = () => {
    let filtered = billboards.filter((b) => {
      const matchesSearch =
        b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = selectedCity ? b.location.includes(selectedCity) : true;

      const matchesPrice = b.price >= priceRange[0] && b.price <= priceRange[1];

      const matchesBooking =
        selectedBooking.length > 0
          ? selectedBooking.includes(b.bookingType)
          : true;

      const matchesType =
        selectedTypes.length > 0 ? selectedTypes.includes(b.type) : true;

      return matchesSearch && matchesCity && matchesPrice && matchesBooking && matchesType;
    });

    setFilteredData(filtered);
  };

  // ♻️ Clear All Filters
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setSelectedBooking([]);
    setSelectedTypes([]);
    setPriceRange([0, 10000]);
    setFilteredData([]);
  };

  // 📦 Final Data to Render
  const displayData = filteredData.length > 0 ? filteredData : billboards;

  // 🧩 Toggle checkbox helper
  const toggleSelection = (value: string, setFn: any, list: string[]) => {
    if (list.includes(value)) {
      setFn(list.filter((item) => item !== value));
    } else {
      setFn([...list, value]);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Explore Billboards</h1>
          <p className="text-muted-foreground">{displayData.length} results found</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* View Toggle */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">View</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={viewMode === "map" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("map")}
                        className="flex-1"
                      >
                        <Map className="w-4 h-4 mr-2" /> Map
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex-1"
                      >
                        <List className="w-4 h-4 mr-2" /> List
                      </Button>
                    </div>
                  </div>

                  {/* Search */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">City or ZIP</Label>
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* City Filter */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">City</Label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full border border-input bg-background rounded-md px-3 py-2 text-sm"
                    >
                      <option value="">All Cities</option>
                      <option value="New York">New York, NY</option>
                      <option value="Los Angeles">Los Angeles, CA</option>
                      <option value="Chicago">Chicago, IL</option>
                      <option value="Miami">Miami, FL</option>
                      <option value="San Francisco">San Francisco, CA</option>
                      <option value="Austin">Austin, TX</option>
                    </select>
                  </div>

                  {/* Booking Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Booking Type</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="direct"
                          checked={selectedBooking.includes("direct")}
                          onCheckedChange={() =>
                            toggleSelection("direct", setSelectedBooking, selectedBooking)
                          }
                        />
                        <label htmlFor="direct" className="text-sm cursor-pointer">
                          Direct Booking
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="bidding"
                          checked={selectedBooking.includes("bidding")}
                          onCheckedChange={() =>
                            toggleSelection("bidding", setSelectedBooking, selectedBooking)
                          }
                        />
                        <label htmlFor="bidding" className="text-sm cursor-pointer">
                          Bidding
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Billboard Type */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">Billboard Type</Label>
                    <div className="space-y-2">
                      {["Digital", "Static", "Mobile"].map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type.toLowerCase()}
                            checked={selectedTypes.includes(type)}
                            onCheckedChange={() =>
                              toggleSelection(type, setSelectedTypes, selectedTypes)
                            }
                          />
                          <label htmlFor={type.toLowerCase()} className="text-sm cursor-pointer">
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-semibold mb-3 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}+
                    </Label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      step={100}
                      className="mb-2"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={applyFilters} className="flex-1">
                      Apply Filters
                    </Button>
                    <Button variant="outline" onClick={clearFilters} className="flex-1">
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="grid md:grid-cols-2 gap-6">
              {displayData.map((billboard) => (
                <Card key={billboard.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 bg-muted">
                    <img src={billboard.image} alt={billboard.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-3 left-3 bg-accent">{billboard.type}</Badge>
                    {billboard.bookingType === "bidding" && (
                      <Badge className="absolute top-3 right-3 bg-warning">Bidding</Badge>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-bold mb-2">{billboard.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin className="w-4 h-4 mr-1" /> {billboard.location}
                    </div>
                    <div className="flex items-center justify-between text-sm mb-3">
                      <span>{billboard.size}</span>
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {billboard.impressions}
                      </div>
                    </div>
                    <div className="border-t pt-3 flex items-end justify-between">
                      <div>
                        {billboard.priceType === "bid" ? (
                          <>
                            <div className="text-sm text-muted-foreground">Starting Bid</div>
                            <div className="text-2xl font-bold text-warning">
                              ${billboard.price.toLocaleString()}
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-muted-foreground">From</div>
                            <div className="text-2xl font-bold text-accent">
                              ${billboard.price}
                              <span className="text-sm font-normal text-muted-foreground">
                                / {billboard.priceType}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ${billboard.weekPrice} / week • ${billboard.monthPrice} / month
                            </div>
                          </>
                        )}
                      </div>
                      <Link to={`/billboard/${billboard.id}`}>
                        <Button size="sm">View Details</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explore;
  // 🧮 Apply Filters Logic