import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next-themes
const mockSetTheme = vi.fn()
let mockTheme = 'dark'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: mockTheme, setTheme: mockSetTheme }),
}))

import { ThemeToggle } from '@/components/layout/theme-toggle'

describe('ThemeToggle', () => {
  it('renders without crashing', () => {
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /toggle theme|switch to/i })
    expect(button).toBeInTheDocument()
  })

  it('shows sun icon in dark mode (to indicate switch to light)', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /switch to light mode/i })
    expect(button).toBeInTheDocument()
  })

  it('shows moon icon in light mode (to indicate switch to dark)', () => {
    mockTheme = 'light'
    render(<ThemeToggle />)
    const button = screen.getByRole('button', { name: /switch to dark mode/i })
    expect(button).toBeInTheDocument()
  })

  it('has accessible aria-label', () => {
    mockTheme = 'dark'
    render(<ThemeToggle />)
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label')
  })
})
