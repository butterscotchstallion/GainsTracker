import {useState} from "react";

type CounterReturnProps = {
    updateCountValue: () => void;
    setBgColor: (color: string) => void;
    countValue: number;
    bgColor: string;
}

const useCounterButton = (limit: number): CounterReturnProps => {
    const inactiveBgColor: string = "bg-[var(--color-background)]";
    const activeBgColor: string = "bg-[var(--color-primary)]";
    const [countValue, setCountValue] = useState(0);
    const [bgColor, setBgColor] = useState(inactiveBgColor);

    function updateCountValue() {
        if (countValue < limit && countValue >= 0) {
            setCountValue(countValue + 1);
            setBgColor(activeBgColor);
        }

        if (countValue === limit) {
            setCountValue(0);
            setBgColor(inactiveBgColor);
        }
    }

    return {updateCountValue, setBgColor, countValue, bgColor};
};

export default useCounterButton;