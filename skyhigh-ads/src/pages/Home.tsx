import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Home = () => {
  const features = [
    {
      icon: MapPin,
      title: "Premium Locations",
      description: "Access thousands of high-traffic billboard locations across major cities",
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Track impressions, engagement, and ROI with advanced analytics",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Safe and transparent transactions with verified billboard owners",
    },
    {
      icon: Clock,
      title: "Flexible Terms",
      description: "Book by day, week, or month with instant confirmation",
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Advertise Where It Matters
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground animate-fade-in">
              Book premium billboard space in the world's top locations. Direct booking and bidding options available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Link to="/explore">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Billboards
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                List Your Billboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose BillboardMarket
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Premium Locations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10M+</div>
              <div className="text-muted-foreground">Daily Impressions</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">Happy Advertisers</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Launch Your Campaign?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Join thousands of brands using BillboardMarket to reach their target audience
          </p>
          <Link to="/explore">
            <Button size="lg">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
