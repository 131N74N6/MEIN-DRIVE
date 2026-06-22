import { useParams } from "react-router-dom"
import DataModifier from "../services/data.service";
import Loading from "../components/Loading";
import { Navbar1, Navbar2 } from "../components/Navbar";
import FileViewer from "../components/FileViewer";
import type { HybridIntrf } from "../models/hybrid.model";

export default function FileDetail() {
    const { id } = useParams();
    const { getData } = DataModifier();
    
    const { data: fileDetail, error: fileDetailError, isLoading: fildeDetailLoading } = getData<HybridIntrf[]>({
        api_url: `${import.meta.env.VITE_API_BASE_URL}/files/selected/${id!}`,
        query_key: [`file-${id!}`],
        stale_time: Infinity
    });

    return (
        <section className="flex md:flex-row flex-col h-screen gap-4 p-4 bg-white z-10 relative">
            <div className="flex flex-col gap-4 md:w-3/4 w-full h-full rounded shadow-[0_0_4px_#1a1a1a] p-2.5 bg-white">
                {fildeDetailLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loading/>
                    </div>
                ) : fileDetailError ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-600 font-medium text-4xl text-center">{fileDetailError.message}</div>
                    </div>
                ) : fileDetail && fileDetail.length > 0 ? (
                    <FileViewer file={fileDetail[0]} is_processing={fildeDetailLoading}/>
                ) : (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-gray-600 font-medium text-2xl text-center">File not found</div>
                    </div>
                )}
            </div>
            {Navbar1(fildeDetailLoading)}
            {Navbar2(fildeDetailLoading)}
        </section>
    );
}