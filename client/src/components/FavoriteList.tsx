import type { FavoriteListProps } from "../models/favoriteModel";
import FavoriteFile from "./FavoriteFile";
import Loading from "./Loading";

export default function FavoriteList(props: FavoriteListProps) {
    if (props.favorites.length === 0) {
        return (
            <section className="flex h-full items-center justify-center">
                <span className="text-gray-700 font-[600] text-[1rem]">No favorited files currently...</span>
            </section>
        );
    }

    return (
        <div className="bg-white flex flex-col gap-[1rem] px-4 pt-4 overflow-y-auto">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[1rem]">
                {props.favorites.map((favorite) => (
                    <FavoriteFile 
                        key={`file_${favorite._id}`}
                        file={favorite} 
                        deleteOne={props.deleteOne}
                    />
                ))}
            </div>
            <div className="flex justify-center">
                {props.isFetchingNextPage ?  <Loading/> : null}
                {props.favorites.length < 14 ? (
                    <></>
                ) : props.isReachedEnd ? (
                    <p className="text-gray-700 font-[500] text-center text-[1rem]">No More Files to Show</p>
                ) : (
                    <button 
                        type="button" onClick={() => props.fetchNextPage()} 
                        className="bg-blue-600 cursor-pointer w-[90px] text-white font-[500] p-[0.4rem] text-[0.9rem]"
                    >
                        <span>Show More</span>
                    </button>
                )}
            </div>
        </div>
    );
}