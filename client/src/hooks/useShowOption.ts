import { useState } from "react";

export default function useShowOption() {
    const [showOption, setShowOption] = useState<boolean>(false);
    const handleShowOption = () => setShowOption(!showOption);

    return { handleShowOption, setShowOption, showOption }
}