type HeaderProps = { fixed?: boolean } & React.ComponentProps<'header'>

export function Header({ children, fixed: _fixed, ...props }: HeaderProps) {
  return (
    <header className='mx-auto w-full max-w-6xl px-4 pt-10' {...props}>
      {children}
    </header>
  )
}