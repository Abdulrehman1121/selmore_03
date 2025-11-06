import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: 99,
      description: "Perfect for small businesses and startups",
      features: [
        "Up to 3 billboard bookings/month",
        "Basic analytics",
        "Email support",
        "Standard locations",
      ],
    },
    {
      name: "Professional",
      price: 299,
      description: "Ideal for growing businesses",
      features: [
        "Up to 10 billboard bookings/month",
        "Advanced analytics",
        "Priority support",
        "Premium locations",
        "Campaign management tools",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: 999,
      description: "For large-scale campaigns",
      features: [
        "Unlimited billboard bookings",
        "Custom analytics & reporting",
        "Dedicated account manager",
        "All premium locations",
        "API access",
        "White-label options",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your advertising needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular ? "border-2 border-accent shadow-xl" : "border-0 shadow-md"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="pt-8 text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <Button
                  className="w-full mb-6"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
                <div className="space-y-3 text-left">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Pricing;
