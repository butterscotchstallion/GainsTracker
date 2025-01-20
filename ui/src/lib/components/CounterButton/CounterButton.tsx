import {MouseEventHandler, ReactElement} from "react";
import "./CounterButton";
import {cn} from "../../utils.ts";

type ButtonProps = {
    className?: string,
    onClickCallback: MouseEventHandler,
    bgColor: string,
    value: number,
    readOnly: boolean
}

export type CounterButtonState = {
    countValue: number;
    bgColor: string;
}

export function getButtonState(currentValue: number, limit: number): CounterButtonState {
    const inactiveBgColor: string = "bg-[var(--color-background)]";
    const activeBgColor: string = "bg-[var(--color-primary)]";
    let countValue: number = 0;
    let bgColor: string = inactiveBgColor;

    if (currentValue < limit && currentValue >= 0) {
        countValue = countValue + 1;
        bgColor = activeBgColor;
    }

    if (currentValue === limit) {
        countValue = 0;
        bgColor = inactiveBgColor;
    }

    return {
        countValue,
        bgColor
    }
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
                                          onClickCallback,
                                          readOnly = true
                                      }: ButtonProps): ReactElement {
    const cursorClass: string = readOnly ? "cursor-default" : "";
    return (
        <button
            className={cn("counter-button rounded-full text-[var(--color-typography)] p-3", className, bgColor, cursorClass)}
            onClick={onClickCallback}>{value}</button>
    );
}