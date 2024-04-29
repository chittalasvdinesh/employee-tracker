import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const Header = () => {
    return (
        <div className='bg-gray-500 w-full fixed top-0 p-2 flex justify-between'>

            <Image  src="/vercel.svg" width={50} height={50} alt="icon" />
            <ul className='flex'>
                <li className='text-white px-2'><Link href="/">Home</Link></li>
                <li className='text-white px-2'><Link href="/users">Users</Link></li>

            </ul>
        </div>

    )
};

export default Header;
