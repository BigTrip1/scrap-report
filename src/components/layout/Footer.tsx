import Image from 'next/image'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className=' bg-jcb fixed bottom-0 w-full'>
      <div className='flex justify-between px-2'>
        <div className='flex pt-2 gap-2'>
          <div>
            <Image src={`/images/logos/jcb-logo.png`} alt='Logo' width={75} height={24} />
          </div>
          <div>
            <Image src={`/images/logos/df.png`} alt='Logo' width={133} height={24} />
          </div>
        </div>

        <div className='flex p-2 justify-end'>
          <div className=' text-black font-bold text-md '>J.C.Bamford Excavators &copy; {currentYear}</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
