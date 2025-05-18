import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, Twitter } from "lucide-react"

const teamMembers = [
  {
    name: "SenMu",
    role: "Blockchain Developer",
    bio: "Experienced blockchain developer with 5+ years in Ethereum and Solidity.",
    image: 'senmu.png', // GameFi style avatar 1
  },
  {
    name: "Lin",
    role:"Blockchain Developer",
    bio: "Experienced blockchain developer with 5+ years in Ethereum and Solidity.",
    image: "lin.png", // GameFi style avatar 2
  }
]

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team of Web3 experts is passionate about blockchain technology and dedicated to helping you succeed in
            the decentralized future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden backdrop-blur-sm bg-card/80 border-muted">
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4 mt-3">
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-start gap-4">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Linkedin className="h-5 w-5" />
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
