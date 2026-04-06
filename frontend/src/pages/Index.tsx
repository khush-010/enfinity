import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Eye, Map } from "lucide-react";
import heroImg from "@/assets/hero-offroad.jpg";

const features = [
  { icon: Eye, title: "Semantic Segmentation", desc: "Pixel-level scene understanding for offroad environments" },
  { icon: Map, title: "Terrain Classification", desc: "Identify trails, obstacles, vegetation, and traversable paths" },
  { icon: Cpu, title: "AI-Powered", desc: "Deep learning model trained on offroad datasets for real-time inference" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img
          src={heroImg}
          alt="Offroad terrain"
          width={1920}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />

        <div className="relative z-10 container text-center space-y-8 animate-slide-up">
          <p className="text-sm font-mono tracking-widest uppercase text-primary">AI Scene Segmentation</p>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl mx-auto">
            See the <span className="text-gradient">unseen</span> in offroad terrain
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload any offroad image and let our AI model segment every element — trails, rocks, vegetation, sky — with pixel-perfect precision.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity glow-primary"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 container">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-xl p-8 space-y-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container text-center text-sm text-muted-foreground">
          Built for a hackathon — SegAI © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Index;
