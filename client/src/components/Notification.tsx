export default function Notification(props: { message: string | null }) {
    return (
        <div className="flex justify-center items-center fixed z-20 inset-0 bg-[rgba(0,0,0,0.66)]">
            <span className="bg-white w-[400px] h-[400px] text-gray-700 text-[1rem] font-[600] p-[1rem] rounded shadow-lg">
                {props.message}
            </span>
        </div>
    )
}