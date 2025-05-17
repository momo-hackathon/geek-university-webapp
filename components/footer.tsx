import { Github, Twitter, Youtube } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20 backdrop-blur-sm">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="pt-2 flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-10 w-10" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="h-10 w-10" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Youtube className="h-10 w-10" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              &copy; {new Date().getFullYear()} Web3 Course. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
