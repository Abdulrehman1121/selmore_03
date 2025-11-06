import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, Target, BarChart, Headphones } from "lucide-react";
import Footer from "@/components/Footer";

const Services = () => {
  const services = [
    {
      icon: Megaphone,
      title: "Campaign Management",
      description: "Full-service campaign planning and execution across multiple billboard locations.",
    },
    {
      icon: Target,
      title: "Audience Targeting",
      description: "Advanced demographic and geographic targeting to reach your ideal customers.",
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Comprehensive performance metrics and ROI tracking for all campaigns.",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Dedicated account management and round-the-clock customer support.",
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to run successful billboard advertising campaigns
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <service.icon className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;
