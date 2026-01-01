"use client"
import { signIn, signOut, useSession } from "next-auth/react"

const Header = () => {
  const session = useSession();
  return (
    <div className="h-20 p-4 px-24 flex justify-between border items-center border-gray-200">
      <img src="https://dealdrop.vercel.app/_next/image?url=%2Fdeal-drop-logo.png&w=1200&q=75" className="h-10" alt="" />
      {session.data?.user && <button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 py-1 h-8 rounded-xl" onClick={signOut}>Sign Out</button>}

      {!session.data?.user && <button className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-4 py-1 h-8 rounded-xl" onClick={signIn}>Sign In</button>}
    </div>
  )
}

export default Header
