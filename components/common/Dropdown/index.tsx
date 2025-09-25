import React, {
    useCallback,
    useState,
    useEffect,
    useRef
} from 'react'
import Link from 'next/link'
import styles from './Dropdown.module.css'

export type DropdownItemType = {
  label: string
  onClick?: React.MouseEventHandler
  href?: string
  newTab?: boolean
}

type Props = {
    items: DropdownItemType[]
    children: React.ReactNode
}

export const Dropdown: React.FC<Props> = ({
    items,
    children
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null)
    const [isOpen, setIsOpen] = useState(false)

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false)
        }
    }, [dropdownRef])

    const handleEscapeKeyPress = useCallback((event: KeyboardEvent) => {
        if (isOpen && event.key === 'Escape') {
            setIsOpen(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) {
            return
        }

        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [handleClickOutside, isOpen])

    useEffect(() => {
        document.addEventListener("keydown", handleEscapeKeyPress)

        return () => {
            document.removeEventListener("keydown", handleEscapeKeyPress)
        }
    }, [handleEscapeKeyPress])

    const linkAttributes = useCallback((item: typeof items[1]) => {
        if (!item.newTab) {
            return {}
        }

        return {
            target: '_blank',
            rel: 'noopener noreferrer'
        }
    }, [])

    const beforeItemOnClick = useCallback((e: React.MouseEvent, item: typeof items[1]) => {
      if (item.onClick) {
        item.onClick(e)
        setIsOpen(false)
      }
    }, [])

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
              {children}
            </button>
            {isOpen && (
                <ul tabIndex={-1} role="listbox">
                    {items.map(item => (
                        <li 
                            key={item.label} 
                            role="option"
                            aria-selected={false}
                        >
                            {!!item.href
                                ? <Link href={item.href} {...linkAttributes(item)}>{item.label}</Link>
                                : <button type="button" onClick={(e) => beforeItemOnClick(e, item)}>{item.label}</button>
                            }
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

