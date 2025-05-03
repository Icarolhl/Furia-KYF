'use client'

import { useId } from 'react'

interface StyledSelectProps {
  label?: string
  name: string
  options: { value: string; label: string }[]
  register?: any
  disabled?: boolean
}

export default function StyledSelect({
  label,
  name,
  options,
  register,
  disabled
}: StyledSelectProps) {
  const id = useId()

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm text-white font-medium">
          {label}
        </label>
      )}
      <select
        id={id}
        {...(register ? register(name) : {})}
        disabled={disabled}
        className="w-full bg-zinc-900 text-white border border-zinc-700
                   px-4 py-2 rounded-md shadow-sm appearance-none
                   focus:outline-none focus:ring-2 focus:ring-fuchsia-500
                   disabled:opacity-50"
      >
        <option value="">Selecione uma opção</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
