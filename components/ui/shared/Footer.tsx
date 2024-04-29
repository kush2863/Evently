import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="border-t">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link className="flex justify-center" href='/'>
          <Image 
            src="/favicon.ico"
            alt="logo"
            width={50}
            height={20}
          />
          <p className="mt-3">College Connect</p>
        </Link>

        <p>2024 College Connect. All Rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer