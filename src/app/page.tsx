import BarChart from '@/components/charts/demo/BarChart'
import FileUploader from '@/components/files/FileUploader'

export default function Home() {
  return (
    <section>
      <div>Home page</div>
      <div className='h-80h w-95w'>
        <BarChart />
        {/* <FileUploader /> */}
      </div>
    </section>
  )
}
