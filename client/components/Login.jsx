export default function Login({setLogin, login}) {
    return (
        <div className="max-w-[700px] bg-slate-100 p-12 rounded-lg mx-auto my-12 border-1 border-slate-200">
            <form action="" className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="">Email</label>
                    <input type="email" className="border border-slate-300 p-3 rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="">Password</label>
                    <input type="password" className="border border-slate-300 p-3 rounded-md" />
                </div>
                <button className="border border-slate-300 bg-indigo-800 p-3 rounded-md font-bold text-slate-100 cursor-pointer hover:bg-indigo-900 duration-200">Login</button>
            </form>
            <div className="flex flex-col gap-2 mt-3 items-center text-sm text-indigo-400">
                <a href="/forgot">Forgot Password?</a>
                <button onClick={() => setLogin(!login)} className="cursor-pointer">Don't have an account? Register</button>
            </div>
        </div>
    )
}
