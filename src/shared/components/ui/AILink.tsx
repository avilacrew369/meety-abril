import Link from "next/link";

export default function AILink() {
  return (
    <Link
    href={'/ia'}
    className="font-bold text-sm"
    >Asistente<span className="text-pink-600 font-black">AI</span></Link>
  )
}
