export function SectionWrapper({ children }: { children: React.ReactNode }) {
  return (
    <section className='md:pt-18 mx-auto min-h-screen max-w-[1200px] px-4 pb-10 pt-[100px] text-white lg:px-0'>
      {children}
    </section>
  )
}
