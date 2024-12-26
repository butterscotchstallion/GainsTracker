import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

import CounterButton from "../src/lib/components/CounterButton/CounterButton";

test('loads and displays greeting', async () => {
    // ARRANGE
    render(<CounterButton />)

    // ACT
    await userEvent.click(screen.getByText('Load Greeting'))
    await screen.findByRole('heading')

    // ASSERT
    expect(screen.getByRole('heading')).toHaveTextContent('hello there')
    expect(screen.getByRole('button')).toBeDisabled()
})