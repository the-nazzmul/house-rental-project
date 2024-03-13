import Link from "next/link";


export default function page() {
    return (
        <div className=" text-center flex flex-col items-center justify-center">
            <img src="/images/Check-mark.png" alt="" className="w-[80px]" />
            <div>
                <h1 className="text-lg">Payment Success</h1>
                <Link href={'/trips'}>Go to Trips</Link>
            </div>
        </div>
    )
}
