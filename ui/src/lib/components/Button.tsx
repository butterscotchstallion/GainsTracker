'use client'

import {ClassValue} from 'clsx'

import {cn} from '../utils'
import React from "react";

type Props = {
    className?: ClassValue,
    children: React.ReactNode,
    variant?: string,
    onClick?: () => void,
}

export default function Button({className, children, onClick}: Props) {
    return (
        <button
            onClick={onClick}
            role="button"
            aria-label="Click to perform an action"
            className={cn(
                'flex bg-buttons text-cardText cursor-pointer items-center rounded-base border-2 border-border dark:border-darkBorder px-4 py-2 text-sm font-base shadow-light dark:shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none dark:hover:shadow-none',
                className,
            )}
        >
            {children}
        </button>
    )
}