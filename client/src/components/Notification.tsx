export default function Notification(message: string) {
    return (
        <div className="flex justify-center items-center fixed z-20 inset-0 bg-[rgba(0,0,0,0.66)]">
            <span className="bg-white flex items-center justify-center text-center gap-4 p-4 w-75 h-75 border shadow_[0_0_6px_rgba(0,0,0,0.3)] rounded-[1.3rem]">
                {message}
            </span>
        </div>
    )
}