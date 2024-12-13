import { NextResponse } from 'next/server'
import path from 'path'
import { writeFile } from 'fs/promises'

export const POST = async (req: any) => {
  const formData = await req.formData()

  const file = formData.get('file')
  if (!file) {
    return NextResponse.json({ error: 'No file exists.' }, { status: 400 })
  }

  const size = file.size / 1024

  if (size > 95000) {
    return NextResponse.json({ error: 'File too large.' }, { status: 500 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const fileName = 'new' + Date.now() + file.name.replaceAll(' ', '_')

  try {
    await writeFile(path.join(process.cwd(), './backend/uploads/' + fileName), buffer)
    return NextResponse.json({ Message: 'Success', address: fileName, status: 201 })
  } catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Failed', status: 500 })
  }
}
