import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About BillboardMarket</h1>

          <Card className="mb-8">
            <CardContent className="pt-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                BillboardMarket is revolutionizing outdoor advertising by making premium billboard
                space accessible to businesses of all sizes. We believe that great advertising
                shouldn't be limited to those with big budgets and industry connections.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform connects advertisers directly with billboard owners, offering
                transparency, flexibility, and competitive pricing. Whether you're a startup looking
                to make a splash or an established brand planning a nationwide campaign, we have the
                perfect billboard for you.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2">500+</div>
                <div className="text-muted-foreground">Premium Locations</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2">10M+</div>
                <div className="text-muted-foreground">Daily Impressions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8 text-center">
                <div className="text-4xl font-bold text-accent mb-2">1000+</div>
                <div className="text-muted-foreground">Happy Clients</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-8">
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Transparent Pricing</h3>
                  <p className="text-muted-foreground">
                    No hidden fees or surprise costs. See exactly what you're paying for upfront.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Direct Booking</h3>
                  <p className="text-muted-foreground">
                    Book instantly or participate in our bidding marketplace for premium spots.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data-Driven</h3>
                  <p className="text-muted-foreground">
                    Make informed decisions with real-time analytics and demographic insights.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
