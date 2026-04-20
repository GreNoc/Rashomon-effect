import React from "react";

interface BinaryButtonsProps {
    handleClick: (reward: number) => void;
}

export const BinaryButtons : React.FC<BinaryButtonsProps>= ({handleClick}) => {
    return (
        <div className="button-container">
            <button onClick={() => handleClick(-1)}>-1</button>
            <button onClick={() => handleClick(+1)}>+1</button>
        </div>
    )
}