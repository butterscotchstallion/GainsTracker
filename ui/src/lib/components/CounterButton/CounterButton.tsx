import {MouseEventHandler, ReactElement} from "react";
import "./CounterButton";
import {cn} from "../../utils.ts";

type ButtonProps = {
    className?: string,
    onClickCallback: MouseEventHandler,
    bgColor: string,
    value: number
}

/**
 * Counter button for incrementing sets
 * - Increment
 * @constructor
 */
export default function CounterButton({
                                          bgColor,
                                          className,
                                          value = 0,
                                          onClickCallback
                                      }: ButtonProps): ReactElement {
    return (
        <button
            className={cn("counter-button rounded-full text-[var(--color-typography)] p-3", className, bgColor)}
            onClick={onClickCallback}>{value}</button>
    );
}