import Link from "next/link";
import AILink from "./AILink";

export default function UserNavegation() {
  return (
    <nav className="flex  items-center justify-center gap-4 mt-5 md:mt-0">
        <AILink />
        <Link
        href={'/dashboard'}
        className="font-bold text-sm bg-pink-600 p-2 text-white block w-full text-center"


        >Panel de administracion</Link>

    </nav>
  )
}
