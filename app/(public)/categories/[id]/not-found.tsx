import Heading from '@/src/shared/components/typography/Heading'
import Link from 'next/link'
import React from 'react'

export default function notFound() {
  return (
    <div className='py-10 text-center'>
        <Heading>No Existe esa Categoria</Heading>
        <Link href={'/'}>Ir Al Inicio</Link>

    </div>
  )
}
