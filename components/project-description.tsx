import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function ProjectDescription() {
  const features = [
    "Access premium courses using GEEK tokens",
    "Course content automatically integrated into AI knowledge base via RAG technology",
    "Publish related articles and earn GEEK token rewards after learning",
    "Additional rewards for articles certified by DAO organization",
    "Earn unique NFT badges upon course completion",
    "Participate in DAO governance with sufficient NFT badges",
  ]

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">About Our Platform</div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Geek University: A New Paradigm for On-chain Learning and Community Governance</h2>
            <p className="text-muted-foreground">
              Geek University is an innovative on-chain learning platform that integrates course learning, article publishing, DAO governance, and community interaction.
              By holding GEEK tokens, you can access premium course content, participate in community governance, and earn rewards through creation.
              Our platform utilizes RAG technology to ensure seamless integration of learning content with the AI knowledge base, providing learners with the best possible learning experience.
            </p>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                Start Learning
              </Button>
              <Button variant="outline" className="rounded-full">
                View Courses
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video overflow-hidden rounded-xl bg-muted/50 backdrop-blur-sm border border-muted">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-transparent" />
              <div className="relative h-full w-full p-6 md:p-8">
                <div className="space-y-4">
                  <div className="h-2 w-24 rounded-full bg-muted-foreground/20" />
                  <div className="h-2 w-32 rounded-full bg-muted-foreground/20" />
                  <div className="h-2 w-20 rounded-full bg-muted-foreground/20" />
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                  <div className="aspect-square rounded-lg bg-muted-foreground/10" />
                </div>
                <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">W3</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 blur-2xl opacity-50" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 blur-2xl opacity-50" />
          </div>
        </div>
      </div>
    </section>
  )
}
