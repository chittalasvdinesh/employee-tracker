import Image from "next/image";
import { Inter } from "next/font/google";
import Users from "./users";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router=useRouter()
  return (
    <>
      <h2 className="text-4xl">Welcome to  <span className="text-blue-500">Employee Tracker!!!</span></h2>
        <p className="text-2xl py-5">Employee Tracker is a powerful tool designed to help you manage your employee data efficiently. Whether you're a small business owner, a human resources manager, or simply looking to streamline your employee management process, Employee Tracker has you covered.</p>
        <p className="text-2xl">With Employee Tracker, you can easily view, add, and edit employee information, all from one convenient dashboard. Keep track of essential details such as employee names, contact information, job titles, departments, and more. Say goodbye to messy spreadsheets and manual data entry – Employee Tracker simplifies the process of managing employee data, saving you time and effort.
        </p>
        <div className="flex justify-center items-center mt-5">
        <button onClick={()=>router.push('/users')} className="border rounded bg-blue-500 text-white p-2 w-20">Users</button>
        </div>

    </>
  );
}
