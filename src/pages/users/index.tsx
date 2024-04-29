import Error from "next/error"
import { useState } from "react"

type FormData = { id: number, fname: string, lname: string }


const Users = ({ data, errorCode }: { data: [], errorCode: any }) => {
    const [userData, setUserData] = useState<FormData[]>(data ||[])
    const [addStatus, setAddStatus] = useState<boolean>(false);
    const [editFormData, setEditFormData] = useState<null | FormData>(null);
    const [filterText, setFilterText] = useState<string>("");
    const [errorStatus, setErrorStatus] = useState<{ fname: boolean, lname: boolean }>({ fname: false, lname: false })

    const url=process.env.NEXT_PUBLIC_BASE_URL;

//   useEffect(()=>{
//     const fetchApi=async()=>{
//         try {
//             const res=await fetch(`${url}api/users`);
//             const data=await res.json(); 
//             setUserData(data)
//         } catch (error) {
//             console.log(error)
//         }
       
//     }

//     fetchApi()

//   },[])

    const onUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log(event)
        const formData = new FormData(event.currentTarget as HTMLFormElement)
        const formDataObject: { [key: string]: string | number } = {}
        if (editFormData !== null) {
            formDataObject["id"] = editFormData?.id
        }


        formData.forEach((value, key) => {
            formDataObject[key] = value.toString()
        })


        const updatedUrl = editFormData === null ? '/api/users' : `/api/users/${formDataObject.id}`
        console.log(formDataObject,updatedUrl)
        try {
            const res = await fetch(updatedUrl, {
                method: editFormData === null ? "POST" : "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ ...formDataObject })
            })
            if (res.ok) {
                const updatedRes = await fetch(`${url}api/users`);
                const updatedData = await updatedRes.json();
                setUserData(updatedData)
                setAddStatus(false)
            }
            else {
                console.log('Error adding user', res.status)

            }
        } catch (error) {
            console.log('Error adding user', error)
            setAddStatus(false)

        }

    }

    const onChangeSearch = (e:React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setFilterText(e.target.value)
    }


    const editHandler = (obj: FormData) => {
        setErrorStatus({ fname: false, lname: false })
        setFilterText("")
        console.log(obj);
        setEditFormData(obj)
        setAddStatus(true)
    }
    const addhandler = () => {
        setErrorStatus({ fname: false, lname: false })

        setFilterText("")
        setAddStatus(true)
        setEditFormData(null)
    }

    const deleteHandler = async (id: {id:string}) => {
        try {

            if (!id) {
                throw new Error({message:"Id not found in FormData",statusCode:500});
            }
            const res = await fetch(`/api/users/${id}`, { method: 'DELETE', body: JSON.stringify({id}) })

            if (!res.ok) {
                throw new Error({ message: "Failed To delete user", statusCode: 500 })
            }
            console.log(res)
            const deleteUser = userData.filter((item: any) => item.id !==id)
            setUserData(deleteUser)

        } catch (error) {
            console.log(error)
        }
    }

    if (errorCode) return <Error statusCode={errorCode} />
    console.log(editFormData, userData,errorCode);


    const filterSearchResults = userData?.filter((val: any) => {
        return (
            val.fname && val.fname.toLowerCase().includes(filterText.toLowerCase()) ||
            val.lname && val.lname.toLowerCase().includes(filterText.toLowerCase()) ||
            val.id && val.id.toString().toLowerCase().includes(filterText.toLowerCase())
        )
    }) || [];
    const filterUserData = filterText === "" ? userData : filterSearchResults;


    return (
        <>
            <div>Users</div>
            {!addStatus ?
                <>
                    <div className="flex justify-between items-baseline m-3">
                        <button className="text-white bg-blue-500 p-2 w-50 border rounded self-baseline" onClick={addhandler}>Add user</button>
                        <input type="search" placeholder="Search" onChange={onChangeSearch} className="border-2 border-gray-500 rounded  outline-none focus:scale-x-105 p-3 h-5 self-baseline" onBlur={()=>console.log("blurred")} />
                    </div>
                    {/* <button id="clearButton" aria-label="Clear search input">&times;</button> */}
                    <table className="border border-collapse w-3/5 m-5">
                        <thead className="p-5">
                            <tr>
                                <th className="border border-collapse" >Employee Id</th>
                                <th className="border border-collapse">First Name</th>
                                <th className="border border-collapse">Last Name</th>
                                <th className="border border-collapse">Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {filterUserData.map((val: any) => {
                                return <tr key={val.id}>
                                    <td className="border border-collapse p-5">{val.id}</td>
                                    <td className="border border-collapse p-5">{val.fname}</td>
                                    <td className="border border-collapse p-5">{val.lname}</td>
                                    <td className="border border-collapse p-5">
                                        <button className="bg-orange-500 text-white border-2 border-orange-500 mx-1 mt-5 p-1" type="button" onClick={() => editHandler({ id: val.id, fname: val.fname, lname: val.lname })}>Edit</button>
                                        <button className="bg-red-500 text-white border-2 border-red-500 mx-1 mt-5 p-1" type="button" onClick={() => deleteHandler(val.id)}>Delete</button>
                                    </td>



                                </tr>
                            })}
                        </tbody>
                    </table>
                </>
                :
                //             position: absolute;
                // top: 50%;
                // left: 50%;
                // transform: translate(-50%, -50%);
                <div className="d-flex justify-center items-center">
                    <form className="m-3 border rounded flex flex-col w-80 p-5 justify-center absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 bg-blue-100" onSubmit={onUserSubmit}>
                        <label htmlFor="fname" className="block m-1">First name:</label>
                        <input name="fname" id="fname" defaultValue={editFormData?.fname} onBlur={(e) => e.target.value === "" ? setErrorStatus({ ...errorStatus, fname: true }) : setErrorStatus({ ...errorStatus, fname: false })} className="block border-2 border-gray-500 m-1 p-1 rounded" type="text" placeholder="first Name" required />
                        {errorStatus.fname && <span className="text-red-500">First Name is Required !</span>}
                        <label htmlFor="lname" className="block m-1">Last name:</label>
                        <input name="lname" id="lname" defaultValue={editFormData?.lname} onBlur={(e) => e.target.value === "" ? setErrorStatus({ ...errorStatus, lname: true }) : setErrorStatus({ ...errorStatus, lname: false })} className="block border-2 border-gray-500 m-1 p-1 rounded" type="text" placeholder="last Name" required />
                        {errorStatus.lname && <span className="text-red-500">Last Name is Required !</span>}

                        <div className="flex">
                            <input className="bg-blue-500 w-20 text-white border-2 border-gray-500 mx-1 mt-5 p-1" type="submit" />
                            <button className="bg-red-500 w-20 text-white border-2 border-gray-500 mx-1 mt-5 p-1" type="button" onClick={() => setAddStatus(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            }
        </>
    )
}


export default Users;

export const getServerSideProps = async () => {
    // let loading=true;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`);
        if (res.status === 404) {
            return {
                notFound: true // Return a special flag for Next.js to handle 404 errors
            };
        }
        if(!res.ok){
            throw new Error({statusCode:500})
        }

        const data = await res.json()
        console.log("dataaaaa",data,res)
        // loading=false
        return {
            props: { errorCode: null, data }
        }
    } catch (error: any) {
        // loading=false
        console.log("error", error)
        const errorCode = error?.status|| 500;
        return {
            props: { errorCode: errorCode,data:[] }
        }
    }



}