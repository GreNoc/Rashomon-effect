import styles from './index.module.css'
import React from "react";

type Color = 'red' | "blue" | "green" | "yellow" | "grey" | "white" | "transparent"

interface BoxProps extends React.PropsWithChildren {
    color: Color
}

const Box: React.FC<BoxProps> = ({children, color})=> {
    const colorStyleMapping : Record<Color, string> = {
        red: styles.boxRed,
        blue: styles.boxBlue,
        green: styles.boxGreen,
        yellow: styles.boxYellow,
        grey: styles.boxGrey,
        white: styles.boxWhite,
        transparent: styles.boxTransparent
    }

    return (
        <div className={`${styles.box} ${colorStyleMapping[color]}`}>
            {children}
        </div>
    )
}

export default Box