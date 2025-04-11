'use client';

import { getIconClass } from "@/components/riotIcons/PlaceholderIcon";
import { cn } from "@/lib/utils";

/** Props for {@link ScoreIconProps}. */
export type ScoreIconProps = {
    /** The player's score from the machine learning model, 0-100. */
    value: number;
    /** The size of the scoreboard component. */
    size?: 'sm' | 'md' | 'lg';
}

/** An individual player's score in the match scoreboard. */
export const ScoreIcon = ({ value, size = 'md' }: ScoreIconProps): JSX.Element =>
    <div className={
        cn(
            'flex items-center text-center align-middle text-white border-2 font-bold',
            {
                'border-green-500 bg-green-400': value >= 70,
                'border-yellow-500 bg-yellow-400': value >= 30 && value < 70,
                'border-red-500 bg-red-400': value < 30
            },
            getIconClass(size)
        )
    }><div className={cn('m-auto', {
        'p-2': size = 'lg', 'p-1': size = 'md', 'p-0.5': size = 'sm'
    })}>{value}</div></div>

