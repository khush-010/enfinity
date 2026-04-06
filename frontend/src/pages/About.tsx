import { Brain, Mountain, Target, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-4xl space-y-16">
        {/* Header */}
        <div className="space-y-4 animate-slide-up">
          <p className="text-sm font-mono tracking-widest uppercase text-primary">About the Project</p>
          <h1 className="text-4xl md:text-5xl font-bold">
            AI-Powered <span className="text-gradient">Offroad Scene Segmentation</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            This project was built for a hackathon to explore how deep learning can make offroad navigation safer by understanding terrain at the pixel level.
          </p>
        </div>

        {/* What it does */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Brain, title: "Deep Learning Model", desc: "A semantic segmentation model trained on offroad terrain datasets, capable of classifying every pixel in an image into categories like trail, rock, vegetation, water, and sky." },
            { icon: Mountain, title: "Offroad Focus", desc: "Unlike urban self-driving datasets, our model is optimized for unstructured offroad environments — dirt trails, forests, rocky paths, and wilderness terrain." },
            { icon: Target, title: "Obstacle Detection", desc: "By segmenting the scene, the system can identify traversable paths and potential hazards, enabling safer autonomous or assisted offroad navigation." },
            { icon: Users, title: "Hackathon Project", desc: "Built as a team effort combining computer vision research, model training, FastAPI backend deployment, and this modern React frontend." },
          ].map((item) => (
            <div key={item.title} className="glass rounded-xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">How It Works</h2>
          <div className="glass rounded-xl p-8 space-y-4">
            <ol className="space-y-4 text-sm text-muted-foreground">
              {[
                "Upload an offroad image through the Predict page.",
                "The image is sent as a POST request to the FastAPI backend at /predict.",
                "The backend runs the image through a trained segmentation model.",
                "The segmented output is returned and displayed alongside the original for comparison.",
              ].map((step, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-mono font-bold flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Tech stack */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {["React", "TypeScript", "Tailwind CSS", "FastAPI", "Python", "PyTorch", "Semantic Segmentation"].map((t) => (
              <span key={t} className="px-4 py-2 rounded-full text-xs font-mono bg-secondary text-secondary-foreground border border-border">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          Built for a hackathon — SegAI © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default About;
