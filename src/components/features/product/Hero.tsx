import { Button } from "@/components/ui/button"

interface HeroProps {
  title: React.ReactNode
  description: string
  ctaText?: string
  ctaHref?: string
}

export function Hero({ title, description, ctaText = "Explore Collection", ctaHref = "/collections" }: HeroProps) {
  return (
    <section className="max-w-[1440px] mx-auto px-5 md:px-[80px] py-[128px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-6 flex flex-col gap-8">
          <h1 className="font-heading text-[40px] md:text-[64px] leading-[48px] md:leading-[72px] tracking-[-0.02em]">
            {title}
          </h1>
          <p className="font-sans text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] max-w-[400px]">
            {description}
          </p>
          <div className="flex">
            <Button variant="default" asChild>
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </div>
        </div>
        <div className="md:col-span-6 aspect-[4/5] bg-secondary relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground font-sans text-sm tracking-widest uppercase">
            Campaign Image
          </div>
        </div>
      </div>
    </section>
  )
}
