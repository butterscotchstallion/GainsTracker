import {ReactElement, useState} from "react";
import "./CounterButton";
import {cn} from "../../utils.ts";

type ButtonProps = {
    className?: string,
    limit?: number,
    readOnly?: false,
    onClickCallback: Function,
}

/**
 * Counter button for incrementing sets
 * - Increment
 * @constructor
 */
export default function CounterButton({
                                          readOnly = false,
                                          className = '',
                                          limit = 5,
                                          onClickCallback
                                      }: ButtonProps): ReactElement {
    const inactiveBgColor: string = "bg-[var(--color-background)]";
    const activeBgColor: string = "bg-[var(--color-primary)]";
    const [countValue, setCountValue] = useState(0);
    const [bgColor, setBgColor] = useState(inactiveBgColor);

    function updateCountValue() {
        if (readOnly) {
            console.info("CounterButton: readonly mode")
            return;
        }

        if (countValue < limit && countValue >= 0) {
            setCountValue(countValue + 1);
            setBgColor(activeBgColor);
        }

        if (countValue === limit) {
            setCountValue(0);
            setBgColor(inactiveBgColor);
        }

        onClickCallback();
    }

    return (
        <button
            className={cn("counter-button rounded-full text-[var(--color-typography)] p-3", bgColor, className)}
            onClick={updateCountValue}>{countValue}</button>
    );
}