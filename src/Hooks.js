import { useState } from "react";

function useToggle() {
    const [toggleState, setToggleState] = useState(true)

    function toggle() {
        setToggleState(toggleState => !toggleState)
    }

    return [toggleState, toggle]
}

export {useToggle}