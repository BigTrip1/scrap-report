type Props = {
  mainText: string
  subText: string
}
const MainHeader = ({ mainText, subText }: Props) => {
  return (
    <main className='mt-2 mb-3'>
      <div className='text-center text-3xl'>{mainText}</div>
      <div className=' text-jcb text-center text-xl'>{subText}</div>
    </main>
  )
}

export default MainHeader
