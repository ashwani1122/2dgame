

export default function Navbar(){

    return (
    <div className="flex justify-between bg-slate-900">
        <div className="ml-10 text-2xl p-4 font-extrabold text-indigo-500">
            Metaverse
        </div>
        <div className="flex mr-5 text-xl ">
            <button className="px-4 py-2 m-2 rounded item-center bg-indigo-500 hover:bg-fuchsia-500">
                Signup
            </button>
            <button className=" px-4 py-2 m-2 rounded item-center bg-indigo-500 hover:bg-fuchsia-500">
                Login
            </button>
        </div>
    </div>
    )
}