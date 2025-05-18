import { Suspense } from "react"
import Banner from "@/components/banner"
import ProjectDescription from "@/components/project-description"
import CourseListing from "@/components/course-listing"
import TokenExchange from "@/components/token-exchange"
import TeamSection from "@/components/team-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        <Banner />
        <ProjectDescription />
        <TokenExchange />
        <CourseListing />
        <TeamSection />
        <Footer />
      </Suspense>
    </main>
  )
}
