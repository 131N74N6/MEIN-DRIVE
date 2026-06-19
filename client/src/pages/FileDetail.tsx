import { useParams } from "react-router-dom"

export default function FileDetail() {
    const { id } = useParams();

    console.log(id!);

    return (
        <div>FileDetail</div>
    );
}